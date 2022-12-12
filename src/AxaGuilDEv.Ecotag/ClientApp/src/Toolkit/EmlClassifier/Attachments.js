import Attachment from "./Attachment";

const Attachments = ({mail, styleImageContainer, onChange}) => {
    return <div>
        {mail.attachments.map((attachment) => {
            return <Attachment key={attachment.id} attachment={attachment} styleImageContainer={styleImageContainer}
                               onChange={onChange}/>;
        })}
    </div>
}

export default Attachments;