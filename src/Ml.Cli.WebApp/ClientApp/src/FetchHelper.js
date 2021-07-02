const setQueryUrl = (params, controllerPath) => {
    const testUrlParams = Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
    return `${controllerPath}/${testUrlParams}`;
};

export const fetchGetData = async (params, controllerPath, fetchFunction) => {
    return fetchFunction(
        setQueryUrl(params, controllerPath),
        {
            method: 'GET',
            header: {
                'content-type': 'application/json'
            }
        }
    );
};

export const fetchPostJson = (newData, fetchFunction) => url => {
    return fetchFunction(
        url,
        {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json'
            },
            body: JSON.stringify(newData)
        }
    );
};
