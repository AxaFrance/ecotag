import React from 'react';

const withLoader = Component => ({loaderMode, ...otherProps}) => {
    return <Component loaderMode={loaderMode} {...otherProps} />;
};

export default withLoader;
