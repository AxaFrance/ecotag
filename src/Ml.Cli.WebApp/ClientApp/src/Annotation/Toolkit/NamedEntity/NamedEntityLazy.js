import React, {Suspense} from "react";

const NamedEntityLazy = ({text, labels, annotationAction, placeholder}) => {
    const NamedEntity = React.lazy(() => import('./NamedEntity'));
    
    return <Suspense fallback={<div>Loading NamedEntity...</div>}>
        <NamedEntity
            text={text}
            labels={labels}
            annotationAction={annotationAction}
            placeholder={placeholder}
        />
    </Suspense>
};

export default NamedEntityLazy;
