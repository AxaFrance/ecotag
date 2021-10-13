export const StatusCodes = {
    OK: 200
};

const setQueryUrl = (params, controllerPath) => {
    const testUrlParams = Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
    if(!testUrlParams){
        return controllerPath
    }
    return `${controllerPath}/${testUrlParams}`;
};

export const fetchGetData = fetchFunction => (controllerPath, params = {}) => {
    return fetchFunction(
        setQueryUrl(params, controllerPath),
        {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'cache-control': 'no-store'
            }
        }
    );
};

export const fetchPostJson = fetchFunction => (url, newData) => {
    return fetchFunction(
        url,
        {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'cache-control': 'no-store'
            },
            body: JSON.stringify(newData)
        }
    );
};
