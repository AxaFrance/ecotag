import PostalMime from 'postal-mime';
import React, {useEffect, useState} from "react";
import convertPdfToImagesAsync from "../Pdf/pdf";
import {LoaderModes, Loader} from "@axa-fr/react-toolkit-all";


const handleFile = (setState) => async (e) => {
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
    
    setState({ displayMail:true, ...messageFormatted});
}

const DisplayEmails = (emails) => {
    if(!emails){
        return null;
    }
    const length = emails.length;
    return <>{emails.map((mail, index) => {
        if(index === length-1){
            return <>{mail.address} ({mail.name})</>
        }
        return <>{mail.address} ({mail.name}), </>
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
        <form className="af-form ri__form-container" name="myform">
            <div className="ri__form-content">
                <div className="ri__form">
                    {state.files.map((file, index) => <img key={index} src={file}  alt="pdf page" style={{"max-width": "100%"}} />)}
                </div>
            </div>
        </form>
    </Loader>);
}

const EmlClassifier = () => {

    const [state, setState] = useState({displayMail:false});
    
    return <div id="main">
        <div>
            <h1>Front-end Email Parser Demo</h1>
            <form id="mimeform">
                <input type="file" id="mime" onChange={handleFile(setState)} />
            </form>
        </div>

        {state.displayMail ? <div id="email-container" >
            <table>
                <tbody>
                    <tr>
                        <td><b>From:</b></td>
                        <td>{state.from.address} ({state.from.name})</td>
                    </tr>
                    <tr>
                        <td><b>To:</b></td>
                        <td>{DisplayEmails(state.to)}</td>
                    </tr>
                    <tr>
                        <td><b>Cc:</b></td>
                        <td>{DisplayEmails(state.cc)}</td>
                    </tr>
                    <tr>
                        <td><b>Bcc:</b></td>
                        <td>{DisplayEmails(state.bcc)}</td>
                    </tr>
                    <tr>
                        <td><b>Subject:</b></td>
                        <td>{state.subject}</td>
                    </tr>
                    <tr >
                        <td colspan="2"> 
                            <div style={{"whiteSpace": state.html ? "":"pre-line"}} dangerouslySetInnerHTML={{__html:state.html || state.text}}>
                        </div></td>
                    </tr>
                </tbody>
            </table>
            <hr/>

            { state.attachments.map(attachment => {
                switch (attachment.mimeType){
                    case "image/jpeg":
                    case "image/png":
                    case "image/gif":
                    case "image/tiff":
                    case "image/webp":
                    case "image/svg+xml":
                        const url = URL.createObjectURL(attachment.blob);
                        return <>
                        <h2>{attachment.filename}</h2>
                            <img src={url} alt={attachment.filename} style={{"max-width": "100%"}} /> <hr/>
                        </>

                    case "application/pdf":
                        return <>
                            <h2>{attachment.filename}</h2>
                            <DisplayPdf blob={attachment.blob} />
                            <hr/>
                        </>
                        
                    default:
                        return null;
                }
            })
            }
           
        </div> : null}
    </div>
}

export default EmlClassifier;