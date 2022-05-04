import React, {Suspense} from "react";

const EmlClassifier = React.lazy(() => import('./EmlClassifier'));

const EmlClassifierLazy = ({url, labels, onSubmit, expectedOutput}) => {
    
    return <Suspense fallback={<div>Loading...</div>}>
        <EmlClassifier
            url={url}
            labels={labels}
            onSubmit={onSubmit}
            expectedOutput={expectedOutput}
        />
    </Suspense>
    
};

export default EmlClassifierLazy;
