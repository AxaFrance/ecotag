import {useInView} from "react-intersection-observer";
import {useEffect} from "react";
import MailWithAttachment from "./MailWithAttachment";
import PdfAttachment from "./PdfAttachment";
import DownloadAttachment from "./DownloadAttachment";

export const formatTitle =(level, filename) => {
    if(!level){
        return filename;
    }
    let levelString= "";
    for(let i=0; i<level;i++){
        levelString += ">"
    }
    return `${levelString} Pièce jointe: ${filename}`;
}

const adaptTypeMime=(mimeType, filename) =>{
    if(mimeType === "application/octet-stream"){
        const filenameLowerCase = filename.toLocaleLowerCase();
        const extension = filenameLowerCase.split('.').pop();
        switch (extension){
            case "pdf":
                return "application/pdf";
            case "eml":
                return "message/rfc822";
            case "jpg":
            case "jpeg":
                return "image/jpeg";
            case "png":
                return "image/png";
            case "gif":
                return "image/gif";
            case "webp":
                return "image/webp";
        }
    }
    return mimeType;
}

const Attachment = ({attachment, onChange, styleImageContainer }) => {
    const { ref, inView } = useInView({
        inViewThreshold: 0,
    });
    useEffect(() => {
        onChange("visibility", {id: attachment.id, isVisible: inView});
    }, [inView]);
    const id = attachment.id;
    const level = attachment.level || 0;
    const classNameTitle = "eml__attachment-title";

    let mimeType = adaptTypeMime(attachment.mimeType, attachment.filename);

    switch (mimeType) {
        case "message/rfc822":
            return <div id={id}>
                <h2 ref={ref} className={classNameTitle} id={attachment.filename}>{formatTitle(level, attachment.filename)}</h2>
                <MailWithAttachment attachment={attachment}
                                    styleImageContainer={styleImageContainer} onChange={onChange}/>
            </div>
        case "image/jpeg":
        case "image/png":
        case "image/gif":
        case "image/webp":
        case "image/svg+xml":
            const url = URL.createObjectURL(attachment.blob);
            return <div id={id}>
                <h2 className={classNameTitle} id={attachment.filename}>{formatTitle(level, attachment.filename)}</h2>
                <div ref={ref} style={styleImageContainer}>
                    <img src={url} alt={attachment.filename} className="eml__attachment-image"/>
                </div>
            </div>
        case "application/pdf":
            return <div id={id}>
                <h2 className={classNameTitle} id={attachment.filename}>{formatTitle(level, attachment.filename)}</h2>
                <div ref={ref} style={styleImageContainer}>
                    <PdfAttachment blob={attachment.blob} id={id} onChange={onChange}/>
                </div>
            </div>
        default:
            return <div ref={ref} id={id}>
                <h2 className={classNameTitle} >{formatTitle(level, `${attachment.filename} ${attachment.mimeType}`)}</h2>
                <DownloadAttachment filename={attachment.filename} blob={attachment.blob} />
            </div>
    }
}

export default Attachment;

