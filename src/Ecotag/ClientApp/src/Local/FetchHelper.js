export const StatusCodes = {
    OK: 200
};

export const b64_to_utf8 = str => {
    return decodeURIComponent(escape(window.atob(str)));
}

export const utf8_to_b64 = str => {
    return window.btoa(unescape(encodeURIComponent(str)));
}

export const fetchGetData = fetch => (controllerPath) => {
    return fetch(
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

export const fetchPostJson = fetch => (url, newData) => {
    return fetch(
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