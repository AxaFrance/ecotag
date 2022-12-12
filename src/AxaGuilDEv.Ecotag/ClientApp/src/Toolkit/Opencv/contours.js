export const findContours = (cv) => (imgCv, dilate = 6) => {
    const imgThresh = new cv.Mat();
    cv.cvtColor(imgCv, imgThresh, cv.COLOR_RGBA2GRAY, 0);

    cv.adaptiveThreshold(imgThresh, imgThresh, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 15, -2);

    const M = cv.Mat.ones(3, 3, cv.CV_8U);
    cv.morphologyEx(imgThresh, imgThresh, cv.MORPH_CLOSE, M);
    cv.morphologyEx(imgThresh, imgThresh, cv.MORPH_OPEN, M);
    if (dilate <= 0) {
        const M2 = cv.Mat.ones(6, 6, cv.CV_8U);
        cv.dilate(imgThresh, imgThresh, M2);
    }
    const s = new cv.Scalar(0, 0, 0, 255);
    cv.copyMakeBorder(imgThresh, imgThresh, 10, 10, 10, 10, cv.BORDER_CONSTANT, s);
    let contours = _findContours(cv)(imgThresh);

    imgThresh.delete();
    return contours;
}

export const _findContours = (cv) => (src, thresholdMinArea = 0.04, contourMode = null) => {
    const height = src.cols;
    const width = src.rows;

    if (!contourMode) {
        contourMode = cv.RETR_EXTERNAL
    }

    const originArea = height * width
    const percentageAreaMin = parseInt(originArea * thresholdMinArea, 10)
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(src, contours, hierarchy, contourMode, cv.CHAIN_APPROX_SIMPLE);

    const filteredContours = []
    for (let i = 0; i < contours.size(); ++i) {
        let contour = contours.get(i);
        let area = cv.contourArea(contour, false);
        if (area > percentageAreaMin) {
            filteredContours.push(contour)
        }
    }

    return filteredContours;
}

export const cropContours = (cv) => (img, filteredContours) => {
    const croppedImages = [];
    let i = 0;
    filteredContours.forEach((contour) => {
        let rotatedRect = cv.minAreaRect(contour);
        let vertices = cv.RotatedRect.points(rotatedRect);

        //Find the corners
        let corner1 = new cv.Point(vertices[0].x - 10, vertices[0].y - 10);
        let corner2 = new cv.Point(vertices[1].x - 10, vertices[1].y - 10);
        let corner3 = new cv.Point(vertices[2].x - 10, vertices[2].y - 10);
        let corner4 = new cv.Point(vertices[3].x - 10, vertices[3].y - 10);

        //Order the corners
        let cornerArray = [{corner: corner1}, {corner: corner2}, {corner: corner3}, {corner: corner4}];
        //Sort by Y position (to get top-down)
        cornerArray.sort((item1, item2) => {
            return (item1.corner.y < item2.corner.y) ? -1 : (item1.corner.y > item2.corner.y) ? 1 : 0;
        }).slice(0, 5);

        //Determine left/right based on x position of top and bottom 2
        const tl = cornerArray[0].corner.x < cornerArray[1].corner.x ? cornerArray[0] : cornerArray[1];
        const tr = cornerArray[0].corner.x > cornerArray[1].corner.x ? cornerArray[0] : cornerArray[1];
        const bl = cornerArray[2].corner.x < cornerArray[3].corner.x ? cornerArray[2] : cornerArray[3];
        const br = cornerArray[2].corner.x > cornerArray[3].corner.x ? cornerArray[2] : cornerArray[3];

        //Calculate the max width/height
        const widthBottom = Math.hypot(br.corner.x - bl.corner.x, br.corner.y - bl.corner.y);
        const widthTop = Math.hypot(tr.corner.x - tl.corner.x, tr.corner.y - tl.corner.y);
        const theWidth = (widthBottom > widthTop) ? widthBottom : widthTop;
        const heightRight = Math.hypot(tr.corner.x - br.corner.x, tr.corner.y - br.corner.y);
        const heightLeft = Math.hypot(tl.corner.x - bl.corner.x, tr.corner.y - bl.corner.y);
        const theHeight = (heightRight > heightLeft) ? heightRight : heightLeft;

        //Transform!
        const to = [0, 0, theWidth - 1, 0, theWidth - 1, theHeight - 1, 0, theHeight - 1];
        const finalDestCoords = cv.matFromArray(4, 1, cv.CV_32FC2, to); //
        const from = [tl.corner.x, tl.corner.y, tr.corner.x, tr.corner.y, br.corner.x, br.corner.y, bl.corner.x, bl.corner.y];
        const srcCoords = cv.matFromArray(4, 1, cv.CV_32FC2, from);
        const dsize = new cv.Size(theWidth, theHeight);
        const M = cv.getPerspectiveTransform(srcCoords, finalDestCoords)
        const finalDest = new cv.Mat();
        cv.warpPerspective(img, finalDest, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
        croppedImages.push({img: finalDest, from, to})
        i++;
    });
    return croppedImages;
}