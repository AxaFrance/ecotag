import PostalMime from 'postal-mime';
import React, {useEffect, useState} from "react";
import convertPdfToImagesAsync from "../Pdf/pdf";
import {LoaderModes, Loader, MultiSelect} from "@axa-fr/react-toolkit-all";
import Toolbar from "./Toolbar.container";
import cuid from "cuid";
import { useInView } from "react-intersection-observer";

const inViewThreshold=0.9;
const inViewThresholdDelay = 0;

async function parseMessageAsync(file, level=0) {
    const parser = new PostalMime();
    const email = await parser.parse(file);
    const messageFormatted = {types: []};
    
    messageFormatted.id = cuid();
    messageFormatted.level=level;
    messageFormatted.isVisibleScreen = false;
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
        messageFormatted.html = email.html;
    }
    if (email.text) {
        messageFormatted.text = email.text;
    }
    
    messageFormatted.attachments = [];
    if (email.attachments && email.attachments.length) {
        messageFormatted.attachments = email.attachments.reduce((results,attachment) => {
            if(email.html && attachment.contentId) {
                const key = `cid:${attachment.contentId.replace("<", "").replace(">", "")}`;
                if(messageFormatted.html.includes(key)) {
                    const url = URL.createObjectURL(new Blob([attachment.content], {type: attachment.mimeType}));
                    console.log("attachment.contentId " + attachment.contentId + " " + key);
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
    return messageFormatted;
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
            return <>{displayEmail(mail)}</>
        }
        return <>{displayEmail(mail)}, </>
    })}</>
}

function DisplayPdf({blob, id, onChange}){
    const [state, setState] = useState({
        files: [],
        loaderMode: LoaderModes.none,
    });
    useEffect(() => {
        setState({
            ...state,
            files: [],
            loaderMode: LoaderModes.get,
        });
        onChange("loading", {id, loaderMode: LoaderModes.get});
        convertPdfToImagesAsync()(blob).then(files => {
            setState({
                ...state,
                files: files,
                loaderMode: LoaderModes.none,
            });
            onChange("loading", {id, loaderMode: LoaderModes.none});
        });
    }, []);
    return (<Loader mode={state.loaderMode} text={"Your browser is extracting the pdf to png images"}>
            <div>
                {state.files.map((file, index) => <img key={index} src={file}  alt="pdf page" style={{"maxWidth": "100%"}} />)}
            </div>
    </Loader>);
}

const Mail = ({mail, title, styleTitle, onChange}) => {
    const { ref, inView } = useInView({
        threshold: 0,
        delay : inViewThresholdDelay
    });
    useEffect(() => {
        if(onChange) {
            onChange("visibility", {id: mail.id, isVisible: inView});
        }
    }, [inView]);
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

const downloadAsync = (blob, filename) => async event => {
    event.preventDefault();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
};


const DownloadAttachment = ({blob, filename, ref})=> {
    return <a  ref={ref}  target="_blank" href="#" onClick={downloadAsync(blob, filename)}>{filename}</a>
}

const formatTitle =(level, filename) => {
    if(!level){
        return filename;
    }
    let levelString= "";
    for(let i=0; i<level;i++){
        levelString += ">"
    }
    return `${levelString} Pièce jointe: ${filename}`;
}

const Attachment = ({attachment, styleTitle, styleImageContainer, onChange }) => {
    const { ref, inView } = useInView({
        inViewThreshold: inViewThreshold,
        delay : inViewThresholdDelay
    });
    useEffect(() => {
        onChange("visibility", {id: attachment.id, isVisible: inView});
    }, [inView]);
    const id = attachment.id;
    const level = attachment.level || 0;
    switch (attachment.mimeType) {
        case "message/rfc822":
            return <div key={id} id={id}>
                <h2 ref={ref} style={styleTitle} id={attachment.filename}>{formatTitle(level, attachment.filename)}</h2>
                <MailAttachment attachment={attachment} styleTitle={styleTitle}
                                styleImageContainer={styleImageContainer} onChange={onChange}/>
            </div>
        case "image/jpeg":
        case "image/png":
        case "image/gif":
        case "image/webp":
        case "image/svg+xml":
            const url = URL.createObjectURL(attachment.blob);
            return <div key={id} id={id}>
                <h2 style={styleTitle} id={attachment.filename}>{formatTitle(level, attachment.filename)}</h2>
                <div ref={ref}  style={styleImageContainer}>
                    <img src={url} alt={attachment.filename} style={{"maxWidth": "100%"}}/>
                    <hr/>
                </div>
            </div>
        case "application/pdf":
            return <div key={id} id={id}>
                <h2 style={styleTitle} id={attachment.filename}>{formatTitle(level, attachment.filename)}</h2>
                <div ref={ref} style={styleImageContainer}>
                    <DisplayPdf blob={attachment.blob} id={id} onChange={onChange}/>
                </div>
            </div>
        case "application/octet-stream":
            const filenameLowerCase = attachment.filename.toLocaleLowerCase();
            if (filenameLowerCase.endsWith(".pdf")) {
                return <div key={id} id={id}>
                    <h2 style={styleTitle}>{formatTitle(level, attachment.filename)}</h2>
                    <div ref={ref}  style={styleImageContainer}>
                        <DisplayPdf blob={attachment.blob} onChange={onChange}/>
                    </div>
                </div>
            }
            if (filenameLowerCase.endsWith(".eml")) {
                return <div key={id} id={id}>
                    <h2 style={styleTitle} >{formatTitle(level, attachment.filename)}</h2>
                    <MailAttachment  ref={ref} attachment={attachment} styleTitle={styleTitle}
                                    styleImageContainer={styleImageContainer} onChange={onChange}/>
                </div>
            }
            console.log(attachment.mimeType + " " + attachment.filename);
            return <div key={id} id={id}>
                <h2 style={styleTitle} >{formatTitle(level, attachment.filename + " " + attachment.mimeType)}</h2>
                <DownloadAttachment ref={ref} filename={attachment.filename} blob={attachment.blob} />
            </div>
        default:
            console.log(attachment.mimeType + " " + attachment.filename);
            return <div key={id} id={id}>
                <h2 style={styleTitle} >{formatTitle(level, attachment.filename + " " + attachment.mimeType)}</h2>
                <DownloadAttachment ref={ref} filename={attachment.filename} blob={attachment.blob} />
            </div>
    }
}

const MailAttachments = ({mail, styleTitle, styleImageContainer, onChange}) => {
    return <div>
        {mail.attachments.map((attachment) => {
            return <Attachment key={attachment.id} attachment={attachment} styleTitle={styleTitle} styleImageContainer={styleImageContainer} onChange={onChange}  />;
        })}
    </div>
}

const MailAttachment = ({styleTitle, styleImageContainer, attachment, onChange}) => {
    const [mail, setMail] = useState(null);
    const [loaderMode, setLoaderMode] = useState(LoaderModes.get);
        useEffect(async () => {
            const blob = attachment.blob;
            if (attachment.blob && !mail) {
                const message = await parseMessageAsync(blob, attachment.level);
                setMail(message);
                onChange("loading", {id: attachment.id, loaderMode: LoaderModes.get});
                setLoaderMode(LoaderModes.none);
            }
            if(blob && mail && mail.attachments.length > 0){
                onChange("attachments", {id: attachment.id, attachments: mail.attachments});
            }
        }, [mail]);
        const level = attachment.level ||0;
        return <Loader mode={loaderMode} text={"Your browser is extracting the mail"}>
            {mail != null && <div>
                <Mail mail={mail} styleTitle={styleTitle} id="Mail" title={`${formatTitle(level, "mail attaché")}`} onChange={onChange} />
                <MailAttachments mail={mail} styleImageContainer={styleImageContainer} styleTitle={styleTitle} onChange={onChange} />
            </div>}
        </Loader>
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

const SideAttachements = ({attachments, level=0}) =>{
    if(!attachments){
        return null;
    }
    return <ul>
        {attachments.map((attachment) => {
            return <li style={{backgroundColor:attachment.isVisibleScreen ? "#82b1ff6e": ""} } key={`side_attachment_${attachment.id}`}>
                <span><a href={`${window.location.toString().replace(location.hash,"")}#${attachment.id}`}>{attachment.filename}{attachment.loaderMode === LoaderModes.get ? " (chargement)":""}</a></span>
                <SideAttachements attachments={attachment.attachments} level={level+1} />
            </li>
        })}
    </ul>
}

const findAttachment =(attachment, id, level=0) =>{
    if(!attachment){
        return null;
    }
    if(attachment.id === id){
        return { attachment, parent: null, level };
    }
    if(!attachment.attachments){
        return null;
    }
    const attachments = attachment.attachments;
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
        
        if(attachment.attachments){
            newAttachment.attachments = updateAttachments(attachment.attachments, id, dataToAdd);
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
    
    const styleSummary = {
        "border": "2px solid grey",
        "padding": "4px",
        "width":"260px",
        "position": "sticky",
        "wordBreak": "break-all",
        "top": "0"
    };

    const styleContainer = {
        "display": "flex",
        "flexDirection": "row",
        marginBottom: "64px",
    };

    const styleImageContainer= {
        zoom: `${state.fontSize}%`
    };

    const styleTitle = {
        "position": "sticky",
        "zIndex": 2,
        with: "100%",
        "top": "0",
        "color": "white",
        "backgroundColor": "grey"
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
                    const newAttachments = updateAttachments(state.mail.attachments, id,{isVisibleScreen: data.isVisible});
                    const newMail = {...state.mail, attachments: newAttachments};
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
            case "attachments": {
                const attachment = findAttachment(state.mail, id);
                if (attachment && attachment.level > 0) {
                    const newAttachments = updateAttachments(state.mail.attachments, id,{attachments: data.attachments, LoaderMode: LoaderModes.none});
                    console.log(type);
                    //console.log(data);
                    //console.log(attachment)
                    console.log(newAttachments);
                    const newMail = {...state.mail, attachments: newAttachments};
                    setState({...state, mail: newMail});
                }
            }
                break;
            default:
                return;
        }
        
    }

    let options = [
        { value: 'fun', label: 'For fun' },
        { value: 'work', label: 'For work' },
        { value: 'drink', label: 'For drink' },
        { value: 'sleep', label: 'For sleep' },
        { value: 'swim', label: 'For swim' },
    ];
    
    if(labels){
        options = labels.map((label) => {
            return {
                "value": label.name,
                "label": label.name
            };
        });
    }
    
    const onChangeClassification = (event) => {
        const label = event.value;
        setState({...state, annotation : {label}});
    }
    
    const onSubmitWrapper= () => {
        onSubmit(state.annotation.label);
    }
    
    const mail = state.mail;
    return <div id="main">
        {!url && <div>
            <h1>Front-end Email Parser Demo</h1>
            <form id="mimeform">
                <input type="file" id="mime" onChange={onFileChange(state, setState)} />
            </form>
        </div>}u
        <Loader mode={state.loaderMode} text={"Your browser is extracting the eml"}>
            {mail != null && <div id="email-container">
                <div style={styleContainer} >
                    <div>
                    <div id="email-summary" style={styleSummary} >
                    <h3>Mail</h3>
                     <ul style={{backgroundColor:mail.isVisibleScreen ? "#82b1ff6e": ""} }>
                         <li>
                             <span><a href={`${window.location.toString().replace(location.hash,"")}#${mail.id}`}>Mail principale</a></span>
                             <MultiSelect
                                 name={"MailAnnotation"}
                                 onChange={onChangeClassification}
                                 value={state.annotation.label}
                                 options={options}
                             />
                         </li>
                     </ul>
                        {mail.attachments.length >0 ? <><h4>Pièces jointes</h4>
                            <SideAttachements attachments={mail.attachments} />
                        </>: null}
                 </div>
                </div>
                    <div>
                        <Mail mail={mail} styleTitle={styleTitle} title="Mail principale" onChange={onChange} />
                        <MailAttachments mail={mail} styleImageContainer={styleImageContainer} styleTitle={styleTitle} onChange={onChange} />
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