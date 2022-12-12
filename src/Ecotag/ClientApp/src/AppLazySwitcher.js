import React, {Suspense} from "react";

const AppLazy = React.lazy(() => import("./" + process.env.REACT_APP_MODE + "/index.js"));

const AppLazySwitcher = () => <Suspense fallback={<div>Loading...</div>}>
    <AppLazy/>
</Suspense>;

export default React.memo(AppLazySwitcher);
