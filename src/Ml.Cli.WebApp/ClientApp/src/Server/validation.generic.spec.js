import { computeInitialStateErrorMessage, validate } from './validation.generic';

describe('validation.generic', () => {
    describe('.computeInitialStateErrorMessage', () => {
        it('should compute initial state with values', async () => {
            const MYFIELD = 'myfield';
            const expectedState = {
                name: MYFIELD,
                value: 'myValue',
                viewValue: 'viewValue',
            };
            const givenState = {
                [MYFIELD]: expectedState,
            };

            const rulesRequired = {
                required: {
                message: 'Le champ est obligatoire',
                },
            };

            const givenRules = {
                [MYFIELD]: [rulesRequired],
            };

            const actualState = computeInitialStateErrorMessage(
                givenState,
                givenRules
            );

            expect(actualState).toMatchObject({
                    [MYFIELD]: { message: null },
                    ...givenState,
            });
        });

        it('should compute initial state without values', async () => {
            const MYFIELD = 'myfield';
            const givenState = {
                [MYFIELD]: {
                name: MYFIELD,
                value: 'myValue',
                viewValue: 'viewValue',
                },
            };

            const rulesRequired = {
                required: {
                message: 'Le champ est obligatoire',
                },
            };

            const givenRules = {
                [MYFIELD]: [rulesRequired],
            };
            // when
            const actualState = computeInitialStateErrorMessage(
                givenState,
                givenRules
            );

            // then
            const expectedState = {
                [MYFIELD]: {
                message: null,
                name: MYFIELD,
                value: 'myValue',
                viewValue: 'viewValue',
                },
            };
            expect(actualState).toMatchObject(expectedState);
        });

        it('should compute initial state without values and viewValue', async () => {
            // given
            const MYFIELD = 'myfield';
            const givenState = {
                [MYFIELD]: {
                name: MYFIELD,
                value: 'myValue',
                },
            };

            const rulesRequired = {
                required: {
                message: 'Le champ est obligatoire',
                },
            };

            const givenRules = {
                [MYFIELD]: [rulesRequired],
            };
            // when
            const actualState = computeInitialStateErrorMessage(
                givenState,
                givenRules
            );

            // then
            const expectedState = {
                [MYFIELD]: {
                message: null,
                name: MYFIELD,
                value: 'myValue',
                },
            };
            expect(expectedState).toMatchObject(actualState);
        });
    });

    describe('.validate()', () => {
        it('should return no errors', async () => {
            // given
            const MYFIELD = 'myfield';
            const rulesRequired = {
                required: {
                message: 'Le champ est obligatoire',
                },
            };
            const givenRules = {
                [MYFIELD]: [rulesRequired],
            };

            // when
            const actualState = validate(givenRules[MYFIELD], 'myvalue');

            // then
            expect(actualState).toBeNull();
        });

        it('should return one error', async () => {
            // given
            const MYFIELD = 'myfield';
            const rulesMaxLength = (max) => ({
                maxLength: {
                maxLength: max,
                message: 'Le champ contient trop de caractères',
                },
            });
            const givenRules = {
                [MYFIELD]: [rulesMaxLength(5)],
            };

            // when
            const actualState = validate(givenRules[MYFIELD], '1234567890');

            // then
            expect(actualState).toBe('Le champ contient trop de caractères');
        });
    });
});
