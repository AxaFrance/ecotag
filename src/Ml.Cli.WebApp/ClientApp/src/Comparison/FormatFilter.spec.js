import {formatJson} from "./FormatFilter";

const items = [
    {
        fileName: "first_file",
        left: {
            Body: `[{"firstname":"JOHN","lastname":"DOE","birthdate":"1990 - 01 - 01","license_validity_date":"2030 - 01 - 01","categoryB":"2010 - 01 - 01"}]`
        },
        right: {
            Body: `[{"firstname":"JOHNNY","lastname":"DOE","birthdate":"1990 - 01 - 01","license_validity_date":"2030 - 01 - 01","categoryB":"2010 - 01 - 01"}]`
        }
    },
    {
        fileName: "second_file",
        left: {
            Body: 
                `[{"firstname":"firstname_value","lastname":"lastname_value","birthdate":"birthdate_value","license_validity_date":"license_validity_date_value",
                "categoryB":"categoryB_value"}]`
        },
        right: {
            Body: `[{"firstname":"firstname_value_2","lastname":"lastname_value","birthdate":"birthdate_value","license_validity_date":"license_validity_date_value",
            "categoryB":"categoryB_value"}]`
        }
    }
];

const filtersSides = {
    filterLeft: `try { let body = JSON.parse(rawBodyInput); if(body[0].lastname === "DOE"){ isSkipped = true; } rawBodyOutput = JSON.stringify(body); }
     catch(ex) { console.log("Plantage parsing left"); console.log(ex.toString()); rawBodyOutput = rawBodyInput; }`,
    filterRight: `try { let body = JSON.parse(rawBodyInput); rawBodyOutput = JSON.stringify(body); } catch(ex) { console.log("Plantage parsing left");
     console.log(ex.toString()); rawBodyOutput = rawBodyInput; }`
};

describe('Check items front filtering' ,() => {
    test('Should remove an item from items list', () => {
        const state = {items, filters: filtersSides};
        
        const returnedItems = formatJson(state);
        
        expect(returnedItems.length).toEqual(1);
        expect(returnedItems[0].fileName).toEqual("second_file");
    });
    
    test('Should throw an exception', () => {
        const newItems = [
            {
                fileName: "first_file",
                left: {
                    Body: `[{{"firstname":"JOHN","lastname":"DOE","birthdate":"1990 - 01 - 01","license_validity_date":"2030 - 01 - 01","categoryB":"2010 - 01 - 01"}]`
                },
                right: {
                    Body: `[{"firstname":"JOHNNY","lastname":"DOE","birthdate":"1990 - 01 - 01","license_validity_date":"2030 - 01 - 01","categoryB":"2010 - 01 - 01"}]`
                }
            },
            {
                fileName: "second_file",
                left: {
                    Body: `[{"firstname":"firstname_value","lastname":"lastname_value","birthdate":"birthdate_value","license_validity_date":"license_validity_date_value",
                    "categoryB":"categoryB_value"}]`
                },
                right: {
                    Body: `[{"firstname":"firstname_value_2","lastname":"lastname_value","birthdate":"birthdate_value","license_validity_date":"license_validity_date_value",
                    "categoryB":"categoryB_value"}]`
                }
            }
        ];
        
        const state = {items: newItems, filters: filtersSides};
        
        const returnedItems = formatJson(state);
        
        //elements going through the "catch" block will be returned unmodified and not removed from the items list, but a message will be written to inform the user
        expect(returnedItems.length).toEqual(2);
    });
    
    test('Should apply filters', () => {
        const filters = {
            filterLeft: `try {
                    let body = JSON.parse(rawBodyInput);
                    if(body[0].firstname === "JOHN"){
                        body[0].firstname = "testLeftFirstname";
                    }
                    rawBodyOutput = JSON.stringify(body);
                } catch(ex) {
                    console.log("Plantage parsing left");
                    console.log(ex.toString());
                    rawBodyOutput = rawBodyInput;
                }`,
            filterRight: `try { 
                    let body = JSON.parse(rawBodyInput);
                    if(body[0].firstname === "firstname_value_2"){
                        body[0].firstname = "testRightFirstname";
                    }
                    rawBodyOutput = JSON.stringify(body);
                } catch(ex) {
                    console.log("Plantage parsing right");
                    console.log(ex.toString());
                    rawBodyOutput = rawBodyInput;
                }`
        };
        const state = {items, filters};
        
        const returnedItems = formatJson(state);
        
        expect(returnedItems[0].left.Body).toEqual(
            `[{"firstname":"testLeftFirstname","lastname":"DOE","birthdate":"1990 - 01 - 01","license_validity_date":"2030 - 01 - 01","categoryB":"2010 - 01 - 01"}]`);
        expect(returnedItems[0].right.Body).toEqual(
            `[{"firstname":"JOHNNY","lastname":"DOE","birthdate":"1990 - 01 - 01","license_validity_date":"2030 - 01 - 01","categoryB":"2010 - 01 - 01"}]`);
        
        expect(returnedItems[1].left.Body).toEqual(
            `[{"firstname":"firstname_value","lastname":"lastname_value","birthdate":"birthdate_value","license_validity_date":"license_validity_date_value","categoryB":"categoryB_value"}]`);
        expect(returnedItems[1].right.Body).toEqual(
            `[{"firstname":"testRightFirstname","lastname":"lastname_value","birthdate":"birthdate_value","license_validity_date":"license_validity_date_value","categoryB":"categoryB_value"}]`);
    });
});
