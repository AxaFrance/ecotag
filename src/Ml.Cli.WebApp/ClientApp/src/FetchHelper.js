export const StatusCodes = {
    OK: 200
};

export const StringEncoding = {
    PLUS: '%2B'
};

const setQueryUrl = (params, controllerPath) => {
    const testUrlParams = Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
    return `${controllerPath}/${testUrlParams}`;
};

export const fetchGetData = (fetchFunction) => (params, controllerPath) => {
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

export const fetchPostJson = fetchFunction => (url, newData) => {
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
