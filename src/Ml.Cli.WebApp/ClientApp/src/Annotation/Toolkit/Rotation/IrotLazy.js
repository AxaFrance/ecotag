import React, {Suspense} from "react";
import IrotContainer from "./Irot.container";

const IrotLazy = ({expectedLabels, url, onSubmit}) => {
    
    const IrotContainer = React.lazy(() => import('./Irot.container'));
    
    return <Suspense fallback={<div>Chargement de la rotation...</div>}>
        <IrotContainer
            expectedLabels={expectedLabels}
            url={url}
            onSubmit={onSubmit}
        />
    </Suspense>
};

export default IrotLazy;
