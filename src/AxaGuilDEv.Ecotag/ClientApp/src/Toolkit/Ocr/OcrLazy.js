import React, {Suspense} from "react";

const OcrContainer = React.lazy(() => import('./Ocr.container'));

const OcrLazy = ({labels, expectedLabels, url, onSubmit}) => {

    return <Suspense fallback={<div>Loading...</div>}>
        <OcrContainer
            labels={labels}
            expectedLabels={expectedLabels}
            url={url}
            onSubmit={onSubmit}
        />
    </Suspense>;
};

export default OcrLazy;
