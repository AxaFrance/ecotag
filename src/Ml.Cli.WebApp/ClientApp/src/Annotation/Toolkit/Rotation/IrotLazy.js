import React, {Suspense} from "react";

const IrotContainer = React.lazy(() => import('./Irot.container'));

const IrotLazy = ({expectedLabels, url, onSubmit}) => {
    
    return <Suspense fallback={<div>Loading...</div>}>
        <IrotContainer
            expectedLabels={expectedLabels}
            url={url}
            onSubmit={onSubmit}
        />
    </Suspense>
};

export default IrotLazy;
