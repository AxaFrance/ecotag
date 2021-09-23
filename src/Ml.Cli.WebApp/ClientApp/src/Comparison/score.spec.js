import {flattenObject, levenshteinBetweenTwoDictionnary, normalizeKeys, totalScores} from "./score";
import {calcTotalCompleteness} from "./StatsTable";


const left = [
    {
        "birthdate": "1960-01-01",
        "document_id": "0",
        "document_type": "nouveau_permis_recto",
        "firstname": "JOHN",
        "lastname": "DOE",
        "license_validity_date": "2020-01-01",
        "page": 1
    },
    {
        "categoryB": "1980-01-01",
        "document_id": "0",
        "document_type": "nouveau_permis_verso",
        "page": 2
    }
];

const right = [
    {
        "categoryB": null,
        "document_id": "0",
        "document_type": "nouveau_permis_verso",
        "page": 1
    },
    {
        "categoryB": "1980-01-01",
        "document_id": "0",
        "document_type": "nouveau_permis_verso",
        "page": 2
    }
];

describe('Check score functions', () => {

    test('flatten deep object to flat dictionnary', async () => {
        const leftDictionnary = flattenObject(left, {}, "", ["document_id", "document_type"]);
        expect(leftDictionnary).toStrictEqual({
            '0_birthdate': '1960-01-01',
            '0_firstname': 'JOHN',
            '0_lastname': 'DOE',
            '0_license_validity_date': '2020-01-01',
            '1_categoryB': '1980-01-01'
        })
    });

    test('compute levenshteinBetweenToDictionnary', async () => {
        const score = levenshteinBetweenTwoDictionnary(flattenObject(left, {}, "", ["document_id", "document_type"]), flattenObject(right, {}, "", ["document_id", "document_type"]));
        expect(score).toStrictEqual( {
            '0_birthdate': 10,
            '0_firstname': 4,
            '0_lastname': 3,
            '0_license_validity_date': 10,
            '1_categoryB': 0
        })
    });

    test('compute total levenshtein', async () => {
        
        const expected_0_birthdate = {score: 20, score_ok: 0, score_ko: 2, total: 2, completeness_left: {ok: 2, ko: 0}, completeness_right: {ok: 0, ko: 0}, percentages: {completeness_ok_left: "100.00 %", completeness_ok_right: "0.00 %", ok: "0 %"}};
        const expected_0_document_id = {score: 0, score_ok: 2, score_ko: 0, total: 2, completeness_left: {ok: 2, ko: 0}, completeness_right: {ok: 2, ko: 0}, percentages: {completeness_ok_left: "100.00 %", completeness_ok_right: "100.00 %", ok: "100 %"}};
        const expected_0_document_type = {score: 6, score_ok: 0, score_ko: 2, total: 2, completeness_left: {ok: 2, ko: 0}, completeness_right: {ok: 2, ko: 0}, percentages: {completeness_ok_left: "100.00 %", completeness_ok_right: "100.00 %", ok: "0 %"}};
        const expected_0_firstname = {score: 8, score_ok: 0, score_ko: 2, total: 2, completeness_left: {ok: 2, ko: 0}, completeness_right: {ok: 0, ko: 0}, percentages: {completeness_ok_left: "100.00 %", completeness_ok_right: "0.00 %", ok: "0 %"}};
        const expected_0_lastname = {score: 6, score_ok: 0, score_ko: 2, total: 2, completeness_left: {ok: 2, ko: 0}, completeness_right: {ok: 0, ko: 0}, percentages: {completeness_ok_left: "100.00 %", completeness_ok_right: "0.00 %", ok: "0 %"}};
        const expected_0_license_validity_date = {score: 20, score_ok: 0, score_ko: 2, total: 2,completeness_left: {ok: 2, ko: 0}, completeness_right: {ok: 0, ko: 0}, percentages: {completeness_ok_left: "100.00 %", completeness_ok_right: "0.00 %", ok: "0 %"}};
        const expected_0_categoryB = {score: "-", score_ok: 0, score_ko: 0, total: 0, completeness_left: {ok: 0, ko: 0}, completeness_right: {ok: 0, ko: 2}, percentages: {completeness_ok_left: "0.00 %", completeness_ok_right: "0.00 %", ok: "-"}};
        const expected_1_categoryB = {score: 0, score_ok: 2, score_ko: 0, total: 2, completeness_left: {ok: 2, ko: 0}, completeness_right: {ok: 2, ko: 0}, percentages: {completeness_ok_left: "100.00 %", completeness_ok_right: "100.00 %", ok: "100 %"}};
        const expected_1_document_id = {score: 0, score_ok: 2, score_ko: 0, total: 2, completeness_left: {ok: 2, ko: 0}, completeness_right: {ok: 2, ko: 0}, percentages: {completeness_ok_left: "100.00 %", completeness_ok_right: "100.00 %", ok: "100 %"}};
        const expected_1_document_type = {score: 0, score_ok: 2, score_ko: 0, total: 2, completeness_left: {ok: 2, ko: 0}, completeness_right: {ok: 2, ko: 0}, percentages: {completeness_ok_left: "100.00 %", completeness_ok_right: "100.00 %", ok: "100 %"}};
            
        const item = {
            left: {Body:JSON.stringify(left)},
            right: {Body:JSON.stringify(right)}
        }
        const items = [item, item];
        const result = totalScores(items);
        expect(result["0_birthdate"]).toStrictEqual(expected_0_birthdate);
        expect(result["0_document_id"]).toStrictEqual(expected_0_document_id);
        expect(result["0_document_type"]).toStrictEqual(expected_0_document_type);
        expect(result["0_firstname"]).toStrictEqual(expected_0_firstname);
        expect(result["0_lastname"]).toStrictEqual(expected_0_lastname);
        expect(result["0_license_validity_date"]).toStrictEqual(expected_0_license_validity_date);
        expect(result["0_categoryB"]).toStrictEqual(expected_0_categoryB);
        expect(result["1_categoryB"]).toStrictEqual(expected_1_categoryB);
        expect(result["1_document_id"]).toStrictEqual(expected_1_document_id);
        expect(result["1_document_type"]).toStrictEqual(expected_1_document_type);
    });
    
    test('Compute completeness', () => {
        const itemOK = {
            left: {Body: JSON.stringify(left)},
            right: {Body: JSON.stringify(left)}
        };
        const itemKO = {
            left: {Body: JSON.stringify(left)},
            right: {Body: JSON.stringify(right)}
        };
        const items = [itemOK, itemKO];
        const result = totalScores(items);
        expect(result["0_birthdate"].completeness_left).toStrictEqual({
            ok: 2,
            ko: 0
        });
        expect(result["0_firstname"].completeness_right).toStrictEqual({
            ok: 1,
            ko: 0
        });
    });
    
    test('Compute total completeness', () => {
        const itemOK = {
            left: {Body: JSON.stringify(left)},
            right: {Body: JSON.stringify(left)}
        };
        const itemKO = {
            left: {Body: JSON.stringify(left)},
            right: {Body: JSON.stringify(right)}
        };
        const items = [itemOK, itemKO];
        const result = totalScores(items);
        const totalCompleteness = calcTotalCompleteness(result, items.length);
        
        const expectedResultLeft = Number(100.00).toFixed(2);
        const expectedResultRight = Number(70.00).toFixed(2);
        expect(totalCompleteness.left).toStrictEqual(expectedResultLeft);
        expect(totalCompleteness.right).toStrictEqual(expectedResultRight);
    });
    
    test('Check keys normalization', () => {
        const itemOK = {
            left: {Body: JSON.stringify(left)},
            right: {Body: JSON.stringify(left)}
        };
        const itemKO = {
            left: {Body: JSON.stringify(left)},
            right: {Body: JSON.stringify(right)}
        };
        const items = [itemOK, itemKO];
        const levenshteinResults = totalScores(items);
        const result = normalizeKeys(levenshteinResults, Object.keys(levenshteinResults));
        expect(result.birthdate).not.toBeNull();
        expect(result.categoryB.score).toEqual(0);
    });

});
