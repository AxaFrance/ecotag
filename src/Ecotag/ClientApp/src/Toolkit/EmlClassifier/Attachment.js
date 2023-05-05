import {useInView} from "react-intersection-observer";
import {useEffect} from "react";
import MailWithAttachment from "./MailWithAttachment";
import PdfAttachment from "./PdfAttachment";
import DownloadAttachment from "./DownloadAttachment";
import TxtAttachment from "./TxtAttachment";
import useProjectTranslation from "../../useProjectTranslation";

export const formatTitle = (level, filename, attachmentStr) => {
    if (!level) {
        return filename;
    }
    let levelString = "";
    for (let i = 0; i < level; i++) {
        levelString += ">"
    }
    return `${levelString} ${attachmentStr} ${filename}`;
}

const mappingExtension = {
    "pdf": "application/pdf",
    "eml": "message/rfc822",
    "jpg": "image/jpeg",
    "jpeg": "image/jpeg",
    "gif": "image/gif",
    "webp": "image/webp",
}

const adaptTypeMime = (mimeType, filename) => {
    if (mimeType === "application/octet-stream") {
        const filenameLowerCase = filename.toLocaleLowerCase();
        const extension = filenameLowerCase.split('.').pop();
        if (mappingExtension.hasOwnProperty(extension)) {
            return mappingExtension[extension];
        }
    }
    return mimeType;
}

const Attachment = ({attachment, onChange, styleImageContainer}) => {
    const {translate} = useProjectTranslation('toolkit');
    const {ref, inView} = useInView({
        inViewThreshold: 0,
    });
    useEffect(() => {
        onChange("visibility", {id: attachment.id, isVisible: inView});
    }, [inView]);
    const id = attachment.id;
    const level = attachment.level || 0;
    const classNameTitle = "eml__attachment-title";
    const attachmentStr = translate('eml_classifier.attachments.title');

    let mimeType = adaptTypeMime(attachment.mimeType, attachment.filename);

    switch (mimeType) {
        case "message/rfc822":
            return <div id={id}>
                <h2 ref={ref} className={classNameTitle}
                    id={attachment.filename}>{formatTitle(level, attachment.filename, attachmentStr)}</h2>
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
                <h2 className={classNameTitle} id={attachment.filename}>{formatTitle(level, attachment.filename, attachmentStr)}</h2>
                <div ref={ref} style={styleImageContainer}>
                    <img src={url} alt={attachment.filename} className="eml__attachment-image"/>
                </div>
            </div>
        case "application/pdf":
            return <div id={id}>
                <h2 className={classNameTitle} id={attachment.filename}>{formatTitle(level, attachment.filename, attachmentStr)}</h2>
                <div ref={ref} style={styleImageContainer}>
                    <PdfAttachment blob={attachment.blob} id={id} onChange={onChange}/>
                </div>
            </div>
        case "text/plain":
            return <div id={id}>
                <h2 className={classNameTitle} id={attachment.filename}>{formatTitle(level, attachment.filename, attachmentStr)}</h2>
                <div ref={ref} style={styleImageContainer}>
                    <TxtAttachment blob={attachment.blob} id={id} onChange={onChange}/>
                </div>
            </div>
        default:
            return <div ref={ref} id={id}>
                <h2 className={classNameTitle}>{formatTitle(level, `${attachment.filename, attachmentStr} ${attachment.mimeType}`)}</h2>
                <DownloadAttachment filename={attachment.filename} blob={attachment.blob}/>
            </div>
    }
}

export default Attachment;

