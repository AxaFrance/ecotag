import React, {useEffect} from "react";
import {useInView} from "react-intersection-observer";
import {formatTitle} from "./Attachment";
import Attachments from "./Attachments";


const displayEmail = (email) => {
    if(email.name){
        return `${email.address} (${email.name})`;
    }
    return email.address
}

const DisplayEmails = (emails) => {
    if(!emails){
        return null;
    }
    const length = emails.length;
    return <>{emails.map((mail, index) => {
        if(index === length-1){
            return displayEmail(mail)
        }
        return displayEmail(mail)+ ", "
    })}</>
}

export const Mail = ({attachment, title, styleTitle, onChange}) => {
    const { ref, inView } = useInView({
        threshold: 0
    });
    useEffect(() => {
        onChange("visibility", {id: attachment.id, isVisible: inView});
    }, [inView]);
    const mail = attachment.mail;
    const style = {
        "whiteSpace": mail.html ? "":"pre-line",
        "border": "2px solid grey",
        "padding": "4px",
        "wordBreak": "break-all",
    };
    return <div id={mail.id}>
        <h2 style={styleTitle} >{title}</h2>
        <table ref={ref}>
            <tbody>
            <tr>
                <td><b>From:</b></td>
                <td>{displayEmail(mail.from)}</td>
            </tr>
            <tr>
                <td><b>To:</b></td>
                <td>{DisplayEmails(mail.to)}</td>
            </tr>
            <tr>
                <td><b>Cc:</b></td>
                <td>{DisplayEmails(mail.cc)}</td>
            </tr>
            <tr>
                <td><b>Bcc:</b></td>
                <td>{DisplayEmails(mail.bcc)}</td>
            </tr>
            <tr>
                <td><b>Subject:</b></td>
                <td>{mail.subject}</td>
            </tr>
            <tr >
                <td colSpan="2">
                    <div style={style} dangerouslySetInnerHTML={{__html:mail.html || mail.text}}>
                    </div>
                </td>
            </tr>
            </tbody>
        </table>
    </div>;
};

const MailWithAttachments = ({styleTitle, styleImageContainer, attachment, onChange}) => {
    const level = attachment.level ||0;
    return <>
        {<div>
            <Mail attachment={attachment} styleTitle={styleTitle} id="Mail"
                  title={`${formatTitle(level, "mail attaché")}`} onChange={onChange}/>
            <Attachments mail={attachment.mail} styleImageContainer={styleImageContainer} styleTitle={styleTitle}
                             onChange={onChange}/>
        </div>}
    </>
}

export default MailWithAttachments