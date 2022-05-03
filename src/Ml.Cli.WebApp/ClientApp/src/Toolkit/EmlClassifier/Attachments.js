import Attachment from "./Attachment";

const Attachments = ({mail, styleTitle, styleImageContainer, onChange}) => {
    return <div>
        {mail.attachments.map((attachment) => {
            return <Attachment key={attachment.id} attachment={attachment} styleTitle={styleTitle} styleImageContainer={styleImageContainer} onChange={onChange} />;
        })}
    </div>
}

export default Attachments;