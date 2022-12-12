import {render} from '@testing-library/react';
import Lock from "./Lock";

describe('Lock', () => {
    it('should render correctly', () => {
        const {asFragment} = render(<Lock isLocked={false} isDisabled={false} onLockAction={() => {
        }} text="Unlocked text" lockedText="Locked text"/>);
        expect(asFragment()).toMatchSnapshot();
    });
});
