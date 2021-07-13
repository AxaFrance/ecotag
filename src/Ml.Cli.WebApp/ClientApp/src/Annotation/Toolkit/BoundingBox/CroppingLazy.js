import React, {Suspense} from "react";

const CroppingLazy = ({labels, url, onSubmit}) => {
    
    const CroppingContainer = React.lazy(() => import('./Cropping.container'));
    
    return <Suspense fallback={<div>Chargement du cropping...</div>}>
        <CroppingContainer
            labels={labels}
            url={url}
            onSubmit={onSubmit}
        />
    </Suspense>;
};

export default CroppingLazy;
