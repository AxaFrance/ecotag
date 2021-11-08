import React, {Suspense} from "react";

const TagOverTextContainer = React.lazy(() => import('./TagOverText.container'));

const TagOverTextLazy = ({expectedOutput, url, onSubmit}) => {
    return <Suspense fallback={<div>Chargement de TagOverText...</div>}>
        <TagOverTextContainer
            expectedOutput={expectedOutput}
            url={url}
            onSubmit={onSubmit}
        />
    </Suspense>
};

export default TagOverTextLazy;
