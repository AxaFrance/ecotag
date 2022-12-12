import React, {Suspense} from "react";

const CroppingContainer = React.lazy(() => import('./Cropping.container'));

const CroppingLazy = ({labels, url, onSubmit, expectedOutput}) => {

    return <Suspense fallback={<div>Loading...</div>}>
        <CroppingContainer
            labels={labels}
            url={url}
            onSubmit={onSubmit}
            expectedOutput={expectedOutput}
        />
    </Suspense>;
};

export default React.memo(CroppingLazy);
