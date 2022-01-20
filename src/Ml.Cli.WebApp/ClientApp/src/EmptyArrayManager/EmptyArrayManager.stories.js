import EmptyArrayManager from "./index";

const noItems = [];
const items = ["test"];

export default{
    title: 'EmptyArrayManager',
    component: EmptyArrayManager
};

const Template = (args) => <EmptyArrayManager {...args}><p>Demo</p></EmptyArrayManager>

export const WithItems = Template.bind({});
WithItems.args = {
    items,
    emptyArrayMessage: "Empty items list"
};

export const NoItems = Template.bind({});
NoItems.args = {
    items: noItems,
    emptyArrayMessage: "Empty items list"
}