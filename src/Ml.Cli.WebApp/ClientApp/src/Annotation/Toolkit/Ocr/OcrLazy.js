import React, {Suspense} from "react";

const OcrLazy = ({labels, expectedLabels, url, onSubmit}) => {
    
    const OcrContainer = React.lazy(() => import('./Ocr.container'));
    
    return <Suspense fallback={<div>Chargement de l'Ocr...</div>}>
        <OcrContainer
            labels={labels}
            expectedLabels={expectedLabels}
            url={url}
            onSubmit={onSubmit}
        />
    </Suspense>;
};

export default OcrLazy;
