
const match = (cv) => (descriptors1, descriptors2) => {
    console.log("using match...");
    
    const goodMatchesTmp = []
    let bf = new cv.BFMatcher(cv.NORM_HAMMING, true);
    let matches = new cv.DMatchVector();
    bf.match(descriptors1, descriptors2, matches);
    
    console.log("matches.size: ", matches.size());
    const matchDistance_option = 70;
    for (let i = 0; i < matches.size(); i++) {
        if (matches.get(i).distance < matchDistance_option) {
            goodMatchesTmp.push(matches.get(i));
        }
    }

    const goodMatches = new cv.DMatchVector();
    const sorted = goodMatchesTmp.sort((a,b) => a.distance - b.distance);
    sorted.forEach(match =>  goodMatches.push_back(match));
    return goodMatches;
}

const knnMatch = (cv) =>  (descriptors1, descriptors2, knnDistanceOption = 0.6) => {
    console.log("using knnMatch...");
    const goodMatchesTmp = []
    const bf = new cv.BFMatcher(cv.NORM_HAMMING, false); // NORM_L2 NORM_HAMMING
    const matches = new cv.DMatchVectorVector();
    //Reference: https://docs.opencv.org/3.3.0/db/d39/classcv_1_1DescriptorMatcher.html#a378f35c9b1a5dfa4022839a45cdf0e89
    bf.knnMatch(descriptors1, descriptors2, matches, 4);

    let counter = 0;
    for (let i = 0; i < matches.size(); ++i) {
        let match = matches.get(i);
        let dMatch1 = match.get(0);
        let dMatch2 = match.get(1);
        
        if (dMatch1.distance <= dMatch2.distance * parseFloat(knnDistanceOption)) {
            goodMatchesTmp.push(dMatch1);
            counter++;
        }
    }

    const goodMatches = new cv.DMatchVector();

    const sorted = goodMatchesTmp.filter(b => b.distance < 80).sort((a,b) => a.distance - b.distance);
    console.log(sorted);
    sorted.forEach(match =>  goodMatches.push_back(match));
    
    return goodMatches;
}

export const matchSwitch= (cv) => (descriptors1, descriptors2, minMatch = 20, matchOption =1) => {
    let goodMatches = null;
    if(matchOption === 0){//match
        goodMatches = match(cv)(descriptors1, descriptors2);
    }
    else if(matchOption === 1) { //knnMatch
        goodMatches = knnMatch(cv)(descriptors1, descriptors2);
    }
    if(goodMatches == null || goodMatches.size() <= minMatch){
        console.warn(`Less than ${minMatch} good matches found! Counter=${goodMatches.size()} try changing distance.`);
        return null;
    }
    console.log("goodMatches.size: ", goodMatches.size());
    return goodMatches;
}

export const detectAndCompute= (cv) => (img, detectionAlgorithm) => {
    const keypoints = new cv.KeyPointVector();
    const descriptors = new cv.Mat();
    detectionAlgorithm.detectAndCompute(img, new cv.Mat(), keypoints, descriptors);
    return {keypoints, descriptors};
}

export const detectAndComputeSerializable= (cv) => (img) => {
    const detectionAlgorithm = new cv.BRISK();

    // find the keypoints with ORB
    const { keypoints, descriptors } =  detectAndCompute(cv)(img, detectionAlgorithm);

    const serializableDescriptor = {
        rows: descriptors.rows,
        cols: descriptors.cols,
        type: descriptors.type(),
        data: []
    };

    descriptors.data.map(d => serializableDescriptor.data.push(d));
    

    let serializableKeyPoints = [];
    for (let i=0; i< keypoints.size();i++){
        let kp = keypoints.get(i);
        serializableKeyPoints.push({
            angle: kp.angle,
            octave: kp.octave,
            pt: {x:kp.pt.x, y:kp.pt.y},
            response: kp.response,
            size: kp.size
        });
    }
    return {
        serializableDescriptor,
        serializableKeyPoints
    }
}

export const detectAndComputeSerializableToCv= (cv) => (descriptorSerializable, keyPointsSerializable) => {
    let descriptors = cv.matFromArray(descriptorSerializable.rows, descriptorSerializable.cols, descriptorSerializable.type, descriptorSerializable.data);

    const keypoints =  {
        get: (i) => keyPointsSerializable[i]
    }
    return {descriptors, keypoints};
}


export const detectAndMatch= (cv) => (imgDescription, im2, minMatch=20) => {
    
    // Initiate STAR detector
    //const detectionAlgorithm = new cv.ORB(10000);
    //const detectionAlgorithm = new cv.AKAZE();
    const detectionAlgorithm = new cv.BRISK();

    // find the keypoints with ORB
    const { keypoints: keypointsObject, descriptors: descriptorsObject } =  detectAndComputeSerializableToCv(cv)(imgDescription.descriptor, imgDescription.keyPoints);
    const { keypoints: keypointsScene, descriptors: descriptorsScene } =  detectAndCompute(cv)(im2, detectionAlgorithm);

    const goodMatches = matchSwitch(cv)(descriptorsObject, descriptorsScene, minMatch);
    
    const clean = () => {
        descriptorsObject.delete();
        descriptorsScene.delete();
        detectionAlgorithm.delete();
        if(goodMatches) {
            goodMatches.delete();
        }
    }
    
    return {keypointsObject, keypointsScene, goodMatches, clean};
}

const convertHomographyPointsToLines = (cv) => (points) => {
    const lines = []
    for(let i=0 ;i<=4;i=i+2) {
        let a = new cv.Point( parseInt(points[i],10), parseInt(points[i + 1],10));
        let b = new cv.Point(parseInt(points[(i + 2)],10), parseInt(points[i + 3],10));
        lines.push([a,b]);
    }
    lines.push([new cv.Point(parseInt(points[(6)],10), parseInt(points[7],10)),new cv.Point(parseInt(points[0],10), parseInt(points[1],10))]);
    return lines;
}

export const convertHomographyPointsToRectangle = (cv) => (points, witdh, height) => {
    let xmin = 9999999;
    let ymin = 9999999;
    let xmax = 0;
    let ymax = 0;
    const lines = convertHomographyPointsToLines(cv)(points);
    console.log(lines);
    lines.forEach(p => {
        xmin = Math.min(xmin, p[0].x);
        ymin = Math.min(ymin, p[0].y);
        xmax = Math.max(xmax, p[0].x);
        ymax = Math.max(ymax, p[0].y);
    });
    
    const threshold = 0.2;
    
    let isError = false;
    if(xmin < 0 && xmin + witdh * threshold < 0){
        isError = true;
    }
    if(ymin < 0 && ymin + height * threshold < 0){
        isError = true;
    }
    if(ymax > height && ymax > height + height * threshold) {
        isError = true;
    }
    if(xmax > witdh && xmax > witdh + witdh * threshold) {
        isError = true;
    }
    
    xmin = xmin <=0? 0 : xmin
    ymin = ymin <=0 ? 0: ymin;
    xmax = Math.min(xmax, witdh);
    ymax = Math.min(ymax, height);
    
    const boundedX = (x) => {
        x = x <=0? 0 : x;
        x = Math.min(x, witdh);
        return x;
    }

    const boundedY = (y) => {
        y = y <=0 ? 0: y;
        y = Math.min(y, height);
        return y;
    }
    
    const newLines = lines.map(l => [new cv.Point( boundedX(l[0].x), boundedY(l[0].y)), new cv.Point( boundedX(l[1].x), boundedY(l[1].y))]);
    
    return {xmin, ymin, xmax, ymax, lines:newLines, isError};
}


export const computeHomography = (cv) => (imgDescription, sceneImg, minMatch=20, inverseSourceAndDestination=false) => {
    //https://icollect.money/opencv_align#
    const {keypointsObject, keypointsScene, goodMatches, clean} = detectAndMatch(cv)(imgDescription, sceneImg, minMatch);
    
    if(goodMatches == null){
        clean();
        return null;
    }

    let sourcePoints = [];
    let destinationPoints = [];
    let goodMatchSize = goodMatches.size();
    
    for (let i = 0; i < goodMatchSize; i++) {

        sourcePoints.push(keypointsObject.get(goodMatches.get(i).queryIdx ).pt.x);
        sourcePoints.push(keypointsObject.get(goodMatches.get(i).queryIdx ).pt.y);
        destinationPoints.push(keypointsScene.get(goodMatches.get(i).trainIdx ).pt.x);
        destinationPoints.push(keypointsScene.get(goodMatches.get(i).trainIdx ).pt.y);
    }

    const matSource = new cv.Mat(sourcePoints.length, 1, cv.CV_32FC2);
    matSource.data32F.set(sourcePoints);
    const matDestination = new cv.Mat(destinationPoints.length, 1, cv.CV_32FC2);
    matDestination.data32F.set(destinationPoints);

    const findHomographyMask = new cv.Mat();
    
    let homographyPoints;
        if(inverseSourceAndDestination) {
            homographyPoints = cv.findHomography(matSource, matDestination, cv.RHO   , 3, findHomographyMask);
        } else {
            homographyPoints = cv.findHomography(matDestination, matSource, cv.RHO   , 3, findHomographyMask);
        }
    const localClean = () => {
        matSource.delete();
        matDestination.delete();
        findHomographyMask.delete();
        clean()
    }
    if (homographyPoints.empty())
    {
        localClean();
        console.warn("homography matrix empty!");
        return null;
    }


    return {homographyPoints, goodMatchSize, clean:localClean};
}

function extracted(objectImg, cv, homographyPoints) {
    const objectWidth = objectImg.cols;
    const objectHeight = objectImg.rows;
    const M = new cv.Mat();
    const objectCoords = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, objectWidth - 1, 0, objectWidth - 1, objectHeight - 1, 0, objectHeight - 1]);
    cv.perspectiveTransform(objectCoords, M, homographyPoints);
    return M;
}

export const computeAndComputeHomographyRectangle = (cv) => (imgDescription, sceneImg, minMatch=20) => {
    let isBug = true;
    let result = null
    let numberIteration = 0;
    while (isBug) {
        if(numberIteration > 4){
            return null;
        }
        numberIteration++;
        
        isBug = false;
        result = computeHomography(cv)(imgDescription, sceneImg, minMatch, true)
        if (!result) {
            isBug=false; 
            return null;
        }
        /*  const h = result.homographyPoints
          console.log("h:", h);
          console.log("[", h.data64F[0],",", h.data64F[1], ",", h.data64F[2]);
          console.log("", h.data64F[3],",", h.data64F[4], ",", h.data64F[5]);
          console.log("", h.data64F[6],",", h.data64F[7], ",", h.data64F[8], "]");*/
        result.homographyPoints.data32F.forEach(d => {
            if(isNaN(d)){
                
                isBug = true;
                console.warn("Bug Nan");
            }
        } )
        
        if(isBug) continue;
    
        const {homographyPoints, clean, goodMatchSize} = result;
        if(homographyPoints !== null) {
            const M = extracted(imgDescription.img, cv, homographyPoints);
            const rectangle = convertHomographyPointsToRectangle(cv)(M.data32F, sceneImg.cols, sceneImg.rows);
            if(rectangle.isError){
                isBug = true;
                console.warn("rectangle.isError");
                continue;
            }
            const thresholdMinArea = 0.04;
            const area = (rectangle.xmax - rectangle.xmin) * (rectangle.ymax - rectangle.ymin);
            const sceneArea = sceneImg.cols * sceneImg.rows;
            
            if(area < sceneArea * thresholdMinArea){
                isBug = true;
                console.warn("thresholdMinArea");
                continue;
            }
            
            const localClean = () => {
               M.delete();
               homographyPoints.delete();
    
               clean();
           }
            localClean();
            return { rectangle, goodMatchSize, lines: rectangle.lines };
        }
    }
    return null;
}

export const computeAndApplyHomography = (cv) => (objectImg, sceneImg, minMatch=20) => {
    const {homographyPoints, clean, goodMatchSize } = computeHomography(cv)(objectImg, sceneImg, minMatch)
    if(homographyPoints != null) {
        let finalImage = new cv.Mat();
        cv.warpPerspective(sceneImg, finalImage, homographyPoints, objectImg.size());
        homographyPoints.delete();
        clean();
        return  { finalImage, goodMatchSize };
    }
    return null;
}

const drawMatch = (cv) => (findHomographyMask, h, points1, points2, goodMatches, keypoints2) =>{
    console.log("h:", h);
    console.log("[", h.data64F[0],",", h.data64F[1], ",", h.data64F[2]);
    console.log("", h.data64F[3],",", h.data64F[4], ",", h.data64F[5]);
    console.log("", h.data64F[6],",", h.data64F[7], ",", h.data64F[8], "]");

    console.log("here are the inliers from RANSAC, compare to the goodMatches array above", findHomographyMask.rows);//test
    let good_inlier_matches = new cv.DMatchVector();
    for (let i = 0; i < findHomographyMask.rows; i=i+2) {
        if(findHomographyMask.data[i] === 1 || findHomographyMask.data[i+1] === 1) {
            let x = points2[i];
            let y = points2[i + 1];
            for (let j = 0; j < keypoints2.size(); ++j) {
                if (x === keypoints2.get(j).pt.x && y === keypoints2.get(j).pt.y) {
                    for (let k = 0; k < goodMatches.size(); ++k) {
                        if (j === goodMatches.get(k).trainIdx) {
                            good_inlier_matches.push_back(goodMatches.get(k));
                        }
                    }
                }
            }
        }
    }
}