import {extractRoles} from "./withAuthentication";

describe.each([
    ["ECOTAG_DATA_SCIENTIST", "ECOTAG_DATA_SCIENTIST,ECOTAG_ANNOTATEUR"],
    ["ECOTAG_ANNOTATEUR", "ECOTAG_ANNOTATEUR"],
    ["ECOTAG_ADMINISTRATEUR", "ECOTAG_ADMINISTRATEUR,ECOTAG_DATA_SCIENTIST,ECOTAG_ANNOTATEUR"],
    ["fdsfsdf", ""]
])('withAuthentication (%i)', (memberOf, expectedRoles) => {
    test('Extract roles ${expectedRoles} from access_token', async () => {

        const roles = extractRoles({
            "member_of": [memberOf]
        }, "AXA_FRANCE");

        expect(roles).toStrictEqual(expectedRoles ? expectedRoles.split(",") : [])
    });
});
