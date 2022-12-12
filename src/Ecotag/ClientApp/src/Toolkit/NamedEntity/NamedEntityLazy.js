import React, {Suspense} from "react";

const NamedEntity = React.lazy(() => import('./NamedEntity'));

const NamedEntityLazy = ({text, labels, onSubmit, placeholder, url, expectedOutput}) => {
    return <Suspense fallback={<div>Loading...</div>}>
        <NamedEntity
            text={text}
            url={url}
            labels={labels}
            onSubmit={onSubmit}
            placeholder={placeholder}
            expectedOutput={expectedOutput}
        />
    </Suspense>
};

export default NamedEntityLazy;
