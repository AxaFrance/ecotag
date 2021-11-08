import React, {Suspense} from "react";

const ImageClassifier = React.lazy(() => import('./ImageClassifier'));

const ImageClassifierLazy = ({url, labels, onSubmit}) => {
    
    return <Suspense fallback={<div>Loading image classifier...</div>}>
        <ImageClassifier
            url={url}
            labels={labels}
            onSubmit={onSubmit}
        />
    </Suspense>
    
};

export default ImageClassifierLazy;
