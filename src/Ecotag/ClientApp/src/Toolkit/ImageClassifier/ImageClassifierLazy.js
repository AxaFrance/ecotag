import React, {Suspense} from "react";

const ImageClassifierContainer = React.lazy(() => import('./ImageClassifier.container'));

const ImageClassifierLazy = ({url, labels, onSubmit, expectedOutput}) => {

    return <Suspense fallback={<div>Loading...</div>}>
        <ImageClassifierContainer
            url={url}
            labels={labels}
            onSubmit={onSubmit}
            expectedOutput={expectedOutput}
        />
    </Suspense>

};

export default ImageClassifierLazy;
