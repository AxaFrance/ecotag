import ConfirmModal from "./ConfirmModal";

export default { title: 'Shared/ConfirmModal' };

export const Default = () => <ConfirmModal isOpen={true} onCancel={() => {}} onSubmit={() => {}} title="Modal title"><div>Modal content</div></ConfirmModal>;