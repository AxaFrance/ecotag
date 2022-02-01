import React from 'react';
import { AnnotationContainer } from './Annotation.container';
import { MemoryRouter, Route} from "react-router-dom";

export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const fetch = async (url, config) => {
    await sleep(1);
    switch (url){
        case 'projects/projects':
            return {
                status: 200,
                json: async () => {
                    await sleep(1);

                    return {
                        classification: "Publique",
                        createDate: "1977-04-22T06:00:00Z",
                        dataSetId: "0001",
                        groupId: "0002",
                        id: "0005",
                        labels: [{name: "Recto", color: "#212121", id: "0"}, {
                            name: "Verso",
                            color: "#ffbb00",
                            id: "1"
                        }, {name: "Signature", color: "#f20713", id: "2"}],
                        name: "Carte verte",
                        numberCrossAnnotation: 0,
                        typeAnnotation: "OCR"
                    }
                },
            };
        case "projects/0005/annotations/1/annot1":
            return {
                status: 200,
                json: async () => {
                    await sleep(1);
                    return "";
                }
            };
        case "projects/0005/annotations/2":
            return {
                status: 201,
                json: async () => {
                    await sleep(1);
                    return "annot2";
                }
            };
        case "projects/0005/annotations/3":
            return {
                status: 201,
                json: async () => {
                    await sleep(1);
                    return "annot3";
                }
            };
        case "projects/0005/annotations/4":
            return {
                status: 201,
                json: async () => {
                    await sleep(1);
                    return "annot4";
                }
            };
        case "projects/projects/reserve":
        default:
            return {
            status: 200,
            json: async () => {
                await sleep(1);
                return [{
                    annotation: {
                        expectedOutputJson: "{\"type\":\"/api/server/projects/0005/files/572bb480-18e7-4914-839a-f669908fe93c\",\"width\":1488,\"height\":899,\"labels\":{\"Recto\":\"annotation1\",\"Verso\":\"annotation2\"}}",
                        id: "annot1",
                    },
                    fileId: "1",
                    fileName: "1.PNG",
                    timeStamp: 0
                },
                    {
                        annotation: {
                            expectedOutputJson: null,
                            id: null,
                        },
                        fileId: "2",
                        fileName: "2.PNG",
                        timeStamp: 0
                    },
                    {
                        annotation: {
                            expectedOutputJson: null,
                            id: null,
                        },
                        fileId: "3",
                        fileName: "3.PNG",
                        timeStamp: 0
                    },
                    {
                        annotation: {
                            expectedOutputJson: null,
                            id: null,
                        },
                        fileId: "4",
                        fileName: "4.PNG",
                        timeStamp: 0
                    }]
            }}
    }
};

export default {
    title: 'Project/Annotations',
    component: AnnotationContainer
};

const Template = (args) => <MemoryRouter initialEntries={["/projects/0005/start"]}>
    <Route path="/:projectId/0005/:documentId">
        <AnnotationContainer{...args}/>
    </Route>
</MemoryRouter>;

export const Container = Template.bind({});
Container.args = {
    fetch,
    environment : {apiUrl: "/server/{path}"}
}
