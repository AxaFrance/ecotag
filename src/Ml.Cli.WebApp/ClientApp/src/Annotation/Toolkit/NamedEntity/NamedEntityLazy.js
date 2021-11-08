import React, {Suspense} from "react";

const NamedEntity = React.lazy(() => import('./NamedEntity'));

const NamedEntityLazy = ({text, labels, annotationAction, placeholder}) => {
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
