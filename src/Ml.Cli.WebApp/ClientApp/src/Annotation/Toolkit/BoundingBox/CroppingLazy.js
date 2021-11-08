import React, {Suspense} from "react";

const CroppingContainer = React.lazy(() => import('./Cropping.container'));

const CroppingLazy = ({labels, url, onSubmit}) => {
    
    return <Suspense fallback={<div>loading...</div>}>
        <CroppingContainer
            labels={labels}
            url={url}
            onSubmit={onSubmit}
        />
    </Suspense>;
};

export default React.memo(CroppingLazy);
