import React, {useEffect} from "react";
import {useInView} from "react-intersection-observer";
import {formatTitle} from "./Attachment";
import Attachments from "./Attachments";
import classNames from "classnames";
import useProjectTranslation from "../../translations/useProjectTranslation";


const displayEmail = (email) => {
    if (email.name) {
        return `${email.address} (${email.name})`;
    }
    return email.address
}

const DisplayEmails = (emails) => {
    if (!emails) {
        return null;
    }
    const length = emails.length;
    return <>{emails.map((mail, index) => {
        if (index === length - 1) {
            return displayEmail(mail)
        }
        return displayEmail(mail) + ", "
    })}</>
}

export const Mail = ({attachment, title, onChange}) => {
    const {translate} = useProjectTranslation('toolkit');
    const {ref, inView} = useInView({
        threshold: 0
    });
    useEffect(() => {
        onChange("visibility", {id: attachment.id, isVisible: inView});
    }, [inView]);
    const mail = attachment.mail;
    const name = "eml__container-mail";
    const isHtml = mail.html || false;
    const className = classNames(name, {
        [`${name}--html`]: isHtml,
        [`${name}--text`]: !isHtml,
    });
    return <div id={attachment.id}>
        <h2 className="eml__attachment-title">{title}</h2>
        <table ref={ref}>
            <tbody>
            <tr>
                <td><b>{translate('eml_classifier.mail.from')}</b></td>
                <td>{displayEmail(mail.from)}</td>
            </tr>
            <tr>
                <td><b>{translate('eml_classifier.mail.to')}</b></td>
                <td>{DisplayEmails(mail.to)}</td>
            </tr>
            <tr>
                <td><b>{translate('eml_classifier.mail.cc')}</b></td>
                <td>{DisplayEmails(mail.cc)}</td>
            </tr>
            <tr>
                <td><b>{translate('eml_classifier.mail.bcc')}</b></td>
                <td>{DisplayEmails(mail.bcc)}</td>
            </tr>
            <tr>
                <td><b>{translate('eml_classifier.mail.subject')}</b></td>
                <td>{mail.subject}</td>
            </tr>
            <tr>
                <td colSpan="2">
                    <div className={className} dangerouslySetInnerHTML={{__html: mail.html || mail.text}}>
                    </div>
                </td>
            </tr>
            </tbody>
        </table>
    </div>;
};

const MailWithAttachments = ({styleImageContainer, attachment, onChange}) => {
    const {translate} = useProjectTranslation('toolkit');
    const level = attachment.level || 0;
    return <>
        {<div>
            <Mail attachment={attachment} title={`${formatTitle(level, "mail", translate('eml_classifier.attachments.title'))}`} onChange={onChange}/>
            <Attachments mail={attachment.mail} styleImageContainer={styleImageContainer}
                         onChange={onChange}/>
        </div>}
    </>
}

export default MailWithAttachments