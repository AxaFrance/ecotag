import {extractRoles} from "./withAuthentication";

describe.each([
    ["CN=ECOTAG_DATA_SCIENTIST,CN=IAM_ECOTAG,OU=applis,O=organisation,DC=ADC,DC=demo-fr,DC=int", "ECOTAG_DATA_SCIENTIST,ECOTAG_ANNOTATEUR"],
    ["CN=ECOTAG_ANNOTATEUR,CN=IAM_ECOTAG,OU=applis,O=organisation,DC=ADC,DC=demo-fr,DC=int", "ECOTAG_ANNOTATEUR"],
    ["CN=ECOTAG_ADMINISTRATEUR,CN=IAM_ECOTAG,OU=applis,O=organisation,DC=ADC,DC=demo-fr,DC=int", "ECOTAG_ADMINISTRATEUR,ECOTAG_DATA_SCIENTIST,ECOTAG_ANNOTATEUR"],
    ["OU=applis,O=organisation,DC=ADC,DC=demo-fr,DC=int", ""]
])('withAuthentication (%i)', (memberOf, expectedRoles) => {
    test('Extract roles ${expectedRoles} from access_token', async () => {

        const roles = extractRoles({
            "member_of": [memberOf]
        }, "AXA_FRANCE");

        expect(roles).toStrictEqual(expectedRoles ? expectedRoles.split(",") : [])
    });
});
