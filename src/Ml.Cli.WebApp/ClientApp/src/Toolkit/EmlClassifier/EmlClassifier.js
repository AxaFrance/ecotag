import PostalMime from 'postal-mime';
import React, {useEffect, useState} from "react";
import convertPdfToImagesAsync from "../Pdf/pdf";
import {LoaderModes, Loader, MultiSelect} from "@axa-fr/react-toolkit-all";
import Toolbar from "./Toolbar.container";


const handleFile = (setState) => async (e) => {

    setState({ loaderMode:LoaderModes.get});
    const file = e.target.files[0];

    
    const parser = new PostalMime();
    const email = await parser.parse(file);

    const messageFormatted = {types: []};
    messageFormatted.from = email.from;
    messageFormatted.to = email.to;
    messageFormatted.cc = email.cc;
    messageFormatted.bcc = email.bcc;
    messageFormatted.subject = email.subject
    if(email.date) {
        let dateOptions = {
            year: 'numeric', month: 'numeric', day: 'numeric',
            hour: 'numeric', minute: 'numeric', second: 'numeric',
            hour12: false
        };
        messageFormatted.date = new Intl.DateTimeFormat('default', dateOptions).format(new Date(email.date));
    } else {
        messageFormatted.date = null;
    }

    if(email.html) {
        messageFormatted.html = email.html;
    }
    if(email.text) {
        messageFormatted.text = email.text;
    }

    messageFormatted.attachments= [];
    if(email.attachments && email.attachments.length){

        messageFormatted.attachments = email.attachments.map((attachment) =>{
            const blob = new Blob([attachment.content], {type: attachment.mimeType});
            const filename = attachment.filename || 'attachment';
            const mimeType = attachment.mimeType;
            return {
                blob,
                filename,
                mimeType
            }
        })
    }
    
    setState({ loaderMode:LoaderModes.none, ...messageFormatted});
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

function DisplayPdf({blob}){

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
        convertPdfToImagesAsync()(blob).then(files => {
            setState({
                ...state,
                files: files,
                loaderMode: LoaderModes.none,
            });
        });
    }, []);
    
    return (<Loader mode={state.loaderMode} text={"Your browser is extracting the pdf to png images"}>
            <div>
                {state.files.map((file, index) => <img key={index} src={file}  alt="pdf page" style={{"maxWidth": "100%"}} />)}
            </div>
    </Loader>);
}



const EmlClassifier = () => {
    const [mail, setMail] = useState({loaderMode: LoaderModes.get});
    const [state, setState] = useState({fontSize:100});
    const style = {
        "whiteSpace": mail.html ? "":"pre-line",
        "border": "2px solid grey",
        "padding": "4px",
        "word-break": "break-all",
    };
    
    const styleSummary = {
        "border": "2px solid grey",
        "padding": "4px",
        "width":"260px",
        "position": "sticky",
        "word-break": "break-all",
       // "zIndex": 20,
        "top": "0",
       // "backgroundColor": "yellow"
    };

    const styleContainer = {
        "display": "flex",
        "flexDirection": "row",
        marginBottom: "64px",
       
    };

    const styleImageContainer={
        zoom: `${state.fontSize}%`
    }

    const styleTitle = {
        "position": "sticky",
        "zIndex": 2,
        with: "100%",
        "top": "0",
        "color": "white",
        "backgroundColor": "grey"
    };

    const styleAnnotation= {
        float: "right",
        "position": "sticky",
        "zIndex": 2,
        "top": "0",
        "right": "0",
        width: "260px",
        "backgroundColor": "grey",
        padding: "4px"
    };

    const options = [
        { value: 'fun', label: 'For fun', clearableValue: false },
        { value: 'work', label: 'For work' },
        { value: 'drink', label: 'For drink' },
        { value: 'sleep', label: 'For sleep' },
        { value: 'swim', label: 'For swim' },
    ];
    
    
    
    return <div id="main">
        <div>
            <h1>Front-end Email Parser Demo</h1>
            <form id="mimeform">
                <input type="file" id="mime" onChange={handleFile(setMail)} />
            </form>
        </div>


        
        {mail.loaderMode === LoaderModes.none ? <div id="email-container">
            
            
            <div style={styleContainer} >
                <div>
                <div id="email-summary" style={styleSummary} >
                <h3>Mail</h3>
                 <ul>
                     <li>
                         <span><a href="#Mail">Contenu du mail</a></span>
                         
                     </li>
                    
                 </ul>
                    {mail.attachments.length >0 ? <><h4>Pièces jointes</h4>
                    <ul>
                        {mail.attachments.map(attachment => {
                            return <li>
                                <span><a href={`#${attachment.filename}`}>{attachment.filename}</a></span>
                            </li>
                        })}
                    </ul></>: null}

                    <h3>Annotation</h3>
                    <MultiSelect
                        name={"sss"}
                        onChange={()=>{}}
                        options={options}
                    />
                                </div>
            </div>
                <div>
                    <h2 style={styleTitle} id="Mail">Contenu du mail</h2>
                    <table>
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
                                </div></td>
                            </tr>
                        </tbody>
                    </table>
        <div>
                    {mail.attachments.map(attachment => {
                        switch (attachment.mimeType){
                            case "image/jpeg":
                            case "image/png":
                            case "image/gif":
                            case "image/webp":
                            case "image/svg+xml":
                                const url = URL.createObjectURL(attachment.blob);
                                return <>
                                <h2 style={styleTitle} id={attachment.filename}>Pièce jointe: {attachment.filename}</h2>
                                <div style={styleImageContainer}>
                                    <img src={url} alt={attachment.filename} style={{"maxWidth": "100%"}} /> <hr/>
                                </div>
                                </>
                            case "image/tiff":
                                return <><h2 style={styleTitle} id={attachment.filename}>Pièce jointe: {attachment.filename}</h2>
                                    <div style={styleImageContainer}>
                                        <DisplayTiff blob={attachment.blob} />
                                    </div></>
                            case "application/pdf":
                                return <><h2 style={styleTitle} id={attachment.filename}>Pièce jointe: {attachment.filename}</h2>
                                <div style={styleImageContainer}>
                                    <DisplayPdf blob={attachment.blob} />
                                </div></>
                            case "application/octet-stream":
                                if(attachment.filename.toLocaleLowerCase().endsWith(".pdf")){
                                   return <><h2 style={styleTitle} id={attachment.filename}>Pièce jointe: {attachment.filename}</h2>
                                    <div style={styleImageContainer}>
                                        
                                        <DisplayPdf blob={attachment.blob} />
                                    </div>
                                   </>
                                }
                                console.log( + " " + attachment.filename);
                                const urlAttachement1 = URL.createObjectURL(attachment.blob);
                                return <>
                                    <h2 style={styleTitle} id={attachment.filename}>Pièce jointe: {attachment.filename} {attachment.mimeType}</h2>
                                    <a target="_blank" href={urlAttachement1} >{attachment.filename}</a>
                                    <hr />
                                </>
                                return null;
                            default:
                                console.log( + " " + attachment.filename);
                                const urlAttachement = URL.createObjectURL(attachment.blob);
                                return <>
                                    <h2 style={styleTitle} id={attachment.filename}>Pièce jointe: {attachment.filename} {attachment.mimeType}</h2>
                                    <a target="_blank" href={urlAttachement} >{attachment.filename}</a>
                                    <hr />
                                </>
                        }
                    })
                    }
        </div>
                </div>
            </div>

        </div> : null}

        <Toolbar
            state={state}
            setState={setState}
            onSubmit={() => {}}
        />
    </div>
}

export default EmlClassifier;