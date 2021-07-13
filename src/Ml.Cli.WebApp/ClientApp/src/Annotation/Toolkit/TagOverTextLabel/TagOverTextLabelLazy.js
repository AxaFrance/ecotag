import React, {Suspense} from "react";

const TagOverTextLabelLazy = ({expectedOutput, url, onSubmit, labels}) => {
    
    const TagOverTextLabelContainer = React.lazy(() => import('./TagOverTextLabel.container'));
    
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
