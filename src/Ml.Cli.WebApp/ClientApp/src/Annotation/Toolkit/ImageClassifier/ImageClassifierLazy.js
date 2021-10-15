import React, {Suspense} from "react";

const ImageClassifierLazy = ({url, labels, onSubmit}) => {
    
    const ImageClassifier = React.lazy(() => import('./ImageClassifier'));
    
    return <Suspense fallback={<div>Loading image classifier...</div>}>
        <ImageClassifier
            url={url}
            labels={labels}
            onSubmit={onSubmit}
        />
    </Suspense>
    
};

export default ImageClassifierLazy;
