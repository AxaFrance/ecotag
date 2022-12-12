import {cropImage, imageResize, isImgGray, loadImageAsync, rotateImage, toImageBase64} from "../Opencv/image";
import {computeAndComputeHomographyRectangle} from "../Opencv/match";
import convertPdfToImagesAsync from "../Pdf/pdf";
import convertTiffToImagesAsync from "../Tiff/tiff";
import {cropContours, findContours} from "../Opencv/contours";
import {LoaderModes} from "@axa-fr/react-toolkit-loader";


export const toBase64Async = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

const findFirstGoodPageAsync = (cv) => async (files, imgDescription, goodMatchSizeThreshold = 6) => {
    let firstResult = null;
    for (let i = 0; i < files.length; i++) {
        const result = await zoneAsync(cv)(files[i], imgDescription, goodMatchSizeThreshold);
        if (i === 0) {
            firstResult = result;
        }
        if (result.expectedOutput.length > 0) {
            return result;
        }
    }
    if (firstResult) {
        return firstResult;
    }
}

export const playAlgoAsync = (cv) => async (file, imgDescription, goodMatchSizeThreshold = 6, feedback = message => message) => {
    const filename = file.name.toLowerCase();
    let files;
    if (filename.endsWith(".pdf")) {
        files = await convertPdfToImagesAsync()(file, 2);
    } else if (filename.endsWith(".tif") || filename.endsWith(".tiff")) {
        files = await convertTiffToImagesAsync()(file);
    } else {
        files = [await toBase64Async(file)];
    }
    const data = await findFirstGoodPageAsync(cv)(files, imgDescription, goodMatchSizeThreshold);
    return {data, filename, files, feedback};
}

export const playAlgoNoTemplateAsync = async (file) => {
    const filename = file.name.toLowerCase();
    let files;
    if (filename.endsWith(".pdf")) {
        files = await convertPdfToImagesAsync()(file, 2);
    } else if (filename.endsWith(".tif") || filename.endsWith(".tiff")) {
        files = await convertTiffToImagesAsync()(file);
    } else {
        files = [await toBase64Async(file)];
    }
    return files;
}

export const zoneAsync = (cv) => async (sceneUrl, imgDescription, goodMatchSizeThreshold = 6) => {
    const imgCv = await loadImageAsync(cv)(sceneUrl);

    const isGray = isImgGray(cv)(imgCv);

    const {image: imgResized, ratio} = imageResize(cv)(imgCv, 1400);
    //const imgVersoCvTemplate = await loadImageAsync(cv)(imgDescription.template_url);
    //const imgVersoCvTemplateResized = imageResize(cv)(imgVersoCvTemplate, 600).image;
    // const youhou = detectAndComputeSerializable(cv)( imgVersoCvTemplateResized);

    const result = computeAndComputeHomographyRectangle(cv)(imgDescription, imgResized, goodMatchSizeThreshold);
    let angle = 0;
    let mat = new cv.Mat(imgCv.rows, imgCv.cols, imgCv.type(), new cv.Scalar());

    if (result && result.lines) {
        let i = 0;
        const lines = result.lines;
        lines.forEach(l => {
            const rectangleColor = new cv.Scalar(i, 128, 0, 128);
            const p0 = l[0]
            const point0 = new cv.Point(parseInt(p0.x / ratio, 10), parseInt(p0.y / ratio, 10));
            const p1 = l[1]
            const point1 = new cv.Point(parseInt(p1.x / ratio, 10), parseInt(p1.y / ratio, 10));
            i = i + 50
            cv.line(mat, point0, point1, rectangleColor, 5);
        });

        const ax = lines[0][0].x + lines[0][1].x;
        const ay = lines[0][0].y + lines[0][1].y;

        const bx = lines[1][0].x + lines[1][1].x;
        const by = lines[1][0].y + lines[1][1].y;

        const cx = lines[2][0].x + lines[2][1].x;
        const cy = lines[2][0].y + lines[2][1].y;

        const dx = lines[3][0].x + lines[3][1].x;
        const dy = lines[3][0].y + lines[3][1].y;

        const maxX = Math.max(ax, bx, cx, dx);
        const minX = Math.min(ax, bx, cx, dx);
        const maxY = Math.max(ay, by, cy, dy);
        const minY = Math.min(ay, by, cy, dy);

        if (maxX === ax) {
            angle = 270;
        } else if (maxY === ay) {
            angle = 180;
        } else if (minX === ax) {
            angle = 90;
        }

    }
    const base64Url = toImageBase64(cv)(imgCv);
    if (!result) {
        return {
            expectedOutput: [],
            url: base64Url,
            confidenceRate: 0,
            isGray,
            croppedContoursBase64: null,
            outputInfo: null
        };
    }

    const {xmax, xmin, ymax, ymin} = result.rectangle;

    const contours = findContours(cv)(mat, 0);
    let croppedContours = cropContours(cv)(imgCv, contours);
    let croppedContourImgs = croppedContours.map(cc => rotateImage(cv)(cc.img, angle));
    let croppedContoursBase64 = croppedContourImgs.map(cc => {
        let result = imageResize(cv)(cc, 680);
        return toImageBase64(cv)(result.image);
    });

    let outputInfo = {
        result: croppedContours.map(cc => {
            return {
                homography: {
                    from: cc.from,
                    to: cc.to
                },
                angle_rotation: angle,
            }
        }),
        img: {
            width: imgCv.cols,
            height: imgCv.rows
        }
    }

    const left = parseInt(xmin / ratio, 10);
    const top = parseInt(ymin / ratio, 10);
    const width = parseInt(xmax / ratio, 10) - left;
    const height = parseInt(ymax / ratio, 10) - top;
    const expectedOutput = [{left, top, width, height}];

    imgCv.delete();
    imgResized.delete();

    let confidenceRate = parseInt((result.goodMatchSize / goodMatchSizeThreshold) * 10, 10);
    if (confidenceRate > 100) {
        confidenceRate = 100;
    }
    if (isGray) {
        confidenceRate = 0;
    }

    return {expectedOutput, url: base64Url, confidenceRate, isGray, croppedContoursBase64, outputInfo};
}

export const cropImageAsync = (cv) => async (imageUrlBase64, xmin, ymin, witdh, height, angle = 0) => {
    const img = await loadImageAsync(cv)(imageUrlBase64);
    let rotatedImage = null;
    if (angle) {
        rotatedImage = rotateImage(cv)(img, angle);
    }

    const imgCropped = cropImage(cv)(rotatedImage ? rotatedImage : img, xmin, ymin, witdh, height);
    const base64url = toImageBase64(cv)(imgCropped);
    img.delete();
    if (rotatedImage) {
        rotatedImage.delete();
    }
    imgCropped.delete();
    return base64url;
}

export const playAlgoWithCurrentTemplateAsync = (template, setState, state, file) => {
    playAlgoAsync(window.cv)(file, template.imgDescription, template.goodMatchSizeThreshold).then(result => {
        if (result) {
            setState({
                ...state, ...result.data,
                files: result.files,
                loaderMode: LoaderModes.none,
                filename: result.filename,
                errorMessage: "",
                noTemplateImage: ""
            });
        } else {
            setState({
                ...state,
                loaderMode: LoaderModes.none,
                errorMessage: "An error occured during cropping template application (no result found)"
            });
        }
    })
};

export const getExpectedOutputWithCurrentTemplateAsync = (template, setState, state, file) => {
    playAlgoAsync(window.cv)(file, template.imgDescription, template.goodMatchSizeThreshold).then(result => {
        if (result) {
            if (result.data.expectedOutput.length > 0) {
                setState({
                    ...state, ...result.data,
                    files: result.files,
                    loaderMode: LoaderModes.none,
                    filename: result.filename,
                    errorMessage: "",
                    noTemplateImage: ""
                });
            } else {
                setState({
                    ...state,
                    loaderMode: LoaderModes.none,
                    errorMessage: "An error occured during cropping template application"
                });
            }
        } else {
            setState({
                ...state,
                loaderMode: LoaderModes.none,
                errorMessage: "An error occured during cropping template application (no result found)"
            });
        }
    })
}