try{
    const new_data = [
        {
            "annotation0": {
                "labels": {
                    "boundingBoxes": [
                        {
                            "id": "7ed8df70-9408-4b5a-b660-a36ef3447d02",
                            "level": 5,
                            "page_num": 1,
                            "block_num": 1,
                            "par_num": 1,
                            "line_num": 1,
                            "word_num": 1,
                            "left": 25,
                            "top": 5,
                            "width": 110,
                            "height": 25,
                            "conf": 73,
                            "text": "14.07.1981"
                        },
                        {
                            "id": "7ed8df70-9408-4b5a-b660-a36ef3447d03",
                            "level": 3,
                            "page_num": 1,
                            "block_num": 2,
                            "par_num": 1,
                            "line_num": 1,
                            "word_num": 1,
                            "left": 145,
                            "top": 5,
                            "width": 109,
                            "height": 28,
                            "conf": 53,
                            "text": "Utopia city"
                        }
                    ]
                }
            }
        }
    ];
    rawBodyOutput = JSON.stringify(new_data);
}
catch (e) {
    rawBodyOutput = ""
}