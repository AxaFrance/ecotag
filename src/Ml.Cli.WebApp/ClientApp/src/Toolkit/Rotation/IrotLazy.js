import React, {Suspense} from "react";

const IrotContainer = React.lazy(() => import('./Irot.container'));

const IrotLazy = ({expectedOutput, url, onSubmit}) => {
    
    return <Suspense fallback={<div>Loading...</div>}>
        <IrotContainer
            expectedOutput={expectedOutput}
            url={url}
            onSubmit={onSubmit}
        />
    </Suspense>
};

export default IrotLazy;
