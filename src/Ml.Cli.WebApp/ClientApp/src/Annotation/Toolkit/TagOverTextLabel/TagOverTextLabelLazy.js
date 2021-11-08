import React, {Suspense} from "react";

const TagOverTextLabelContainer = React.lazy(() => import('./TagOverTextLabel.container'));

const TagOverTextLabelLazy = ({expectedOutput, url, onSubmit, labels}) => {
    return <Suspense fallback={<div>Chargement de TagOverTextLabel...</div>}>
        <TagOverTextLabelContainer
            expectedOutput={expectedOutput}
            url={url}
            onSubmit={onSubmit}
            labels={labels}
        />
    </Suspense>
}

export default TagOverTextLabelLazy;
