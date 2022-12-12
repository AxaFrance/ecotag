export const fetch = async (url, config) => {

    if (url.includes("annotations/0001")) {
        return {
            ok: true, json: () => Promise.resolve({
                percentageNumberAnnotationsDone: 88,
                numberAnnotationsToDo: 2000,
                numberAnnotationsDone: 40
            })
        }
    }
    if (url.includes("projects")) {
        return {
            ok: true, json: () => Promise.resolve([{
                "id": "0001",
                "name": "Relevé d'information",
                "groupId": "0001",
                "numberTagToDo": 10,
                "createDate": 76979897879799,
                "annotationType": "NER",
            }])
        }
    }
    return {
        ok: true, json: () => Promise.resolve([{
            "id": "0001",
            "name": "groupName"
        }])
    };
};