import React, {Suspense} from "react";

const TagOverTextLazy = ({expectedOutput, url, onSubmit}) => {
    
    const TagOverTextContainer = React.lazy(() => import('./TagOverTextContainer'));
    
    return <Suspense fallback={<div>Chargement de TagOverText...</div>}>
        <TagOverTextContainer
            expectedOutput={expectedOutput}
            url={url}
            onSubmit={onSubmit}
        />
    </Suspense>
};

export default TagOverTextLazy;
