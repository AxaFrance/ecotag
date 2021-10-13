export const StatusCodes = {
    OK: 200
};

export const b64_to_utf8 = str => {
    return decodeURIComponent(escape(window.atob( str )));
}

export const utf8_to_b64 = str => {
    return window.btoa(unescape(encodeURIComponent( str )));
}


export const fetchGetData = fetchFunction => (controllerPath) => {
    return fetchFunction(
        controllerPath,
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
