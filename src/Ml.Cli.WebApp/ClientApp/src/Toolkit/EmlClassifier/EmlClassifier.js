import PostalMime from 'postal-mime';
import React, {useEffect, useState} from "react";
import {Loader, LoaderModes} from "@axa-fr/react-toolkit-all";
import Toolbar from "./Toolbar.container";
import cuid from "cuid";
import sanitizeHtml from 'sanitize-html';
import {Mail} from "./MailWithAttachment";
import Attachments from "./Attachments";

import "./EmlClassifier.scss";
import MailSummary from "./MailSummary";

async function parseMessageAsync(file, level=0) {
    const parser = new PostalMime();
    const email = await parser.parse(file);
   
    const messageFormatted = {types: []};
    
    messageFormatted.from = email.from;
    messageFormatted.to = email.to;
    messageFormatted.cc = email.cc;
    messageFormatted.bcc = email.bcc;
    messageFormatted.subject = email.subject
    if (email.date) {
        let dateOptions = {
            year: 'numeric', month: 'numeric', day: 'numeric',
            hour: 'numeric', minute: 'numeric', second: 'numeric',
            hour12: false
        };
        messageFormatted.date = new Intl.DateTimeFormat('default', dateOptions).format(new Date(email.date));
    } else {
        messageFormatted.date = null;
    }
    if (email.html) {
            messageFormatted.html = sanitizeHtml(email.html);
    }
    if (email.text) {
        messageFormatted.text = email.text;
    }
    
    let attachments = [];
    if (email.attachments && email.attachments.length) {
        attachments = email.attachments.reduce((results,attachment) => {
            if(email.html && attachment.contentId) {
                const key = `cid:${attachment.contentId.replace("<", "").replace(">", "")}`;
                if(messageFormatted.html.includes(key)) {
                    const url = URL.createObjectURL(new Blob([attachment.content], {type: attachment.mimeType}));
                    messageFormatted.html = messageFormatted.html.replace(key, url);
                    return results;
                }
            }
            const blob = new Blob([attachment.content], {type: attachment.mimeType});
            const filename = attachment.filename || 'attachment';
            const mimeType = attachment.mimeType;
             results.push( {
                blob,
                filename,
                mimeType,
                 id : cuid(),
                 level:level+1
            });
            return results;
        }, []);
    }
    
    let finalAttachments = [];
    for(let i=0;i<attachments.length; i++) {
        let attachment = attachments[i];
        if (attachment.mimeType === "message/rfc822" || (attachment.mimeType === "application/octet-stream" && attachment.filename.toLocaleLowerCase().endsWith(".eml"))) {
            const message = await parseMessageAsync(attachment.blob, attachment.level);
            const newAttachment = {...attachment,...message};
            finalAttachments.push(newAttachment);
        } else{
            finalAttachments.push(attachment);
        }
    }
    messageFormatted.attachments = finalAttachments;
    return {
        id: cuid(),
        level,
        isVisibleScreen: false,
        mail: messageFormatted
    };
}

const onFileChange = (state, setState) => async (e) => {
    if(e.target.files.length === 0){
        return;
    }
    setState({ ...state, loaderMode:LoaderModes.get, mail: null, annotation :{classification:null}});
    const file = e.target.files[0];
    const messageFormatted = await parseMessageAsync(file);
    setState({...state, loaderMode:LoaderModes.none, mail: messageFormatted });
}

const initAsync = async (url, setState, state, expectedOutput) => {
    if(!url){
        return;
    }
    setState({...state, loaderMode : LoaderModes.get, mail:null, annotation :{label:null}});
    const response = await fetch(url);
    const blob = await response.blob();
    const message = await parseMessageAsync(blob);
    
    let annotation = expectedOutput ? expectedOutput : {label:null};
    setState({...state, loaderMode : LoaderModes.none, mail:message, annotation});
}



const findAttachment =(attachment, id, level=0) =>{
    if(!attachment){
        return null;
    }
    if(attachment.id === id){
        return { attachment, parent: null, level };
    }
    if(!attachment.mail || !attachment.mail.attachments){
        return null;
    }
    const attachments = attachment.mail.attachments;
    for (let i=0; i< attachments.length ; i++){
        let a = findAttachment(attachments[i], id, level+1);
        if(a){
            return { attachment: a.attachment, parent: a.parent == null ? attachment: a.parent, level: level+1 };
        }
    }
    
    return null;
}

const updateAttachments =(attachments, id, dataToAdd) =>{
    if(!attachments){
        return null;
    }
    const newAttachments = [];
    for (let i=0; i< attachments.length ; i++){
        const attachment = attachments[i];
        let newAttachment = {...attachment};
        if(attachment.id === id){
            newAttachment = {...attachment, ...dataToAdd};
        }
            
        if(attachment.mail && attachment.mail.attachments){
            newAttachment.mail = { ...attachment.mail, attachments : updateAttachments(attachment.mail.attachments, id, dataToAdd)};
        }
        newAttachments.push(newAttachment);
    }

    return newAttachments;
}


const EmlClassifier = ({url, labels, onSubmit, expectedOutput}) => {
    const [state, setState] = useState({
        fontSize:60,
        loaderMode: LoaderModes.get,
        mail:null,
        annotation: {label: null},
    });

    useEffect(async () => {
        if (url) {
            await initAsync(url, setState, state, expectedOutput);
        }
    }, [url, expectedOutput, labels]);

    const styleImageContainer= {
        zoom: `${state.fontSize}%`
    };
    
    const onChange = (type, data) =>{
        const id = data.id;
        switch (type){
            case "visibility": {
                const attachment = findAttachment(state.mail, id);
                if (attachment) {
                    if(attachment.parent === null){
                        const newMail = {...state.mail, isVisibleScreen: data.isVisible};   
                        setState({...state, mail: newMail});
                        return;
                    }
                    const newAttachments = updateAttachments(state.mail.mail.attachments, id,{isVisibleScreen: data.isVisible});
                    const newMail = {...state.mail, mail:{...state.mail.mail, attachments: newAttachments} };
                    console.log(newAttachments);
                    setState({...state, mail: newMail});
                }
            }   
                break;
            case "loading":
                const attachment = findAttachment(state.mail, id);
                if (attachment) {
                    const newAttachments = updateAttachments(state.mail.attachments, id,{});
                    const newMail = {...state.mail, attachments: newAttachments};
                    setState({...state, mail: newMail});
                }
                break;
            default:
                return;
        }
        
    }
    
    const onSubmitWrapper= () => {
        onSubmit(state.annotation.label);
    }
    
    const mail = state.mail;
    return <div id="main">
        {!url && <div>
            <h1>Front-end Email Parser Demo</h1>
            <form>
                <input type="file" onChange={onFileChange(state, setState)} />
            </form>
        </div>}
        <Loader mode={state.loaderMode} text={"Your browser is extracting the eml"}>
            {mail != null && <div id="email-container">
                <div className="eml__container" >
                    <div>
                        <MailSummary attachment={mail} setState={setState} state={state} labels={labels} />
                    </div>
                    <div>
                        <Mail attachment={mail} title="Mail principale" onChange={onChange} />
                        <Attachments mail={mail.mail} styleImageContainer={styleImageContainer} onChange={onChange} />
                    </div>
                </div>
            </div>}
        </Loader>
        <Toolbar
            state={state}
            setState={setState}
            onSubmit={onSubmitWrapper}
        />
    </div>
}

export default EmlClassifier;