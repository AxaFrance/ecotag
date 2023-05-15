import PostalMime from 'postal-mime';
import React, {useEffect, useRef, useState} from "react";
import {Loader, LoaderModes} from "@axa-fr/react-toolkit-all";
import Toolbar from "./Toolbar.container";
import cuid from "cuid";
import sanitizeHtml from 'sanitize-html';
import {Mail} from "./MailWithAttachment";
import Attachments from "./Attachments";

import "./EmlClassifier.scss";
import MailSummary from "./MailSummary";
import Attachment from "./Attachment";
import {EmlMode} from "./EmlMode";
import useProjectTranslation from "../../useProjectTranslation";

const isEml = (blob) => {
    return blob.mimeType === "message/rfc822" || (blob.mimeType === "application/octet-stream" && blob.filename.toLocaleLowerCase().endsWith(".eml"))
}

async function parseMessageAsync(file, fallbackFileName, level = 0) {
    const parser = new PostalMime();
    const email = await parser.parse(file);
    if (!email || !email.from) {
        return null;
    }
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
        attachments = email.attachments.reduce((results, attachment) => {
            if (email.html && attachment.contentId) {
                const key = `cid:${attachment.contentId.replace("<", "").replace(">", "")}`;
                if (messageFormatted.html.includes(key)) {
                    const url = URL.createObjectURL(new Blob([attachment.content], {type: attachment.mimeType}));
                    messageFormatted.html = messageFormatted.html.replace(key, url);
                    return results;
                }
            }
            const blob = new Blob([attachment.content], {type: attachment.mimeType});
            const filename = attachment.filename || fallbackFileName;
            const mimeType = attachment.mimeType;
            results.push({
                blob,
                filename,
                mimeType,
                id: cuid(),
                level: level + 1
            });
            return results;
        }, []);
    }

    let finalAttachments = [];
    for (let i = 0; i < attachments.length; i++) {
        let attachment = attachments[i];
        if (isEml(attachment)) {
            const message = await parseMessageAsync(attachment.blob, fallbackFileName, attachment.level);
            const newAttachment = {...attachment, ...message};
            finalAttachments.push(newAttachment);
        } else {
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

const onFileChange = (state, setState, fallbackFileName) => async (e) => {
    if (e.target.files.length === 0) {
        return;
    }

    setState({...state, loaderMode: LoaderModes.get, mail: null, annotation: {label: null}});
    const file = e.target.files[0];
    const filename = e.currentTarget.value;
    const isEmlInput = {filename, mimeType: file.type};
    if (isEml(isEmlInput)) {
        const messageFormatted = await parseMessageAsync(file, fallbackFileName);
        setState({...state, loaderMode: LoaderModes.none, document: null, mail: messageFormatted});
    } else {
        const document = {
            blob: file,
            filename,
            mimeType: file.type,
            id: cuid(),
            level: 0
        }
        setState({...state, loaderMode: LoaderModes.none, document, mail: null});
    }
}

const initAsync = async (url, expectedOutput, filename, mode, fallbackFileName) => {
    const response = await fetch(url);
    const blob = await response.blob();
    let annotation;
    if (mode === EmlMode.classifier) {
        annotation = expectedOutput ? expectedOutput : {label: null};
    } else {
        annotation = expectedOutput ? expectedOutput.labels : {};
    }
    const isEmlInput = {filename, mimeType: blob.type};
    if (isEml(isEmlInput)) {
        const message = await parseMessageAsync(blob, fallbackFileName);
        return {mail: message, document: null, annotation};
    }

    const document = {
        blob,
        filename,
        mimeType: blob.type,
        id: cuid(),
        level: 0,
        isVisibleScreen: true,
    }
    return {mail: null, document: document, annotation};
}

const findAttachment = (attachment, id, level = 0) => {
    if (!attachment) {
        return null;
    }
    if (attachment.id === id) {
        return {attachment, parent: null, level};
    }
    if (!attachment.mail || !attachment.mail.attachments) {
        return null;
    }
    const attachments = attachment.mail.attachments;
    for (let i = 0; i < attachments.length; i++) {
        let a = findAttachment(attachments[i], id, level + 1);
        if (a) {
            return {attachment: a.attachment, parent: a.parent == null ? attachment : a.parent, level: level + 1};
        }
    }

    return null;
}

const updateAttachments = (attachments, id, dataToAdd) => {
    if (!attachments) {
        return null;
    }
    const newAttachments = [];
    for (let i = 0; i < attachments.length; i++) {
        const attachment = attachments[i];
        let newAttachment = {...attachment};
        if (attachment.id === id) {
            newAttachment = {...attachment, ...dataToAdd};
        }

        if (attachment.mail && attachment.mail.attachments) {
            newAttachment.mail = {
                ...attachment.mail,
                attachments: updateAttachments(attachment.mail.attachments, id, dataToAdd)
            };
        }
        newAttachments.push(newAttachment);
    }

    return newAttachments;
}

const EmlClassifier = ({url, labels, onSubmit, expectedOutput, filename, mode = EmlMode.classifier}) => {
    const {translate} = useProjectTranslation('toolkit');
    const fallbackFileName = translate('eml_classifier.fallback_file_name');
    if(!filename){
        filename = fallbackFileName;
    }
    const annotationDefaultValue = mode === EmlMode.classifier ? {label: null} : {};
    const [state, setState] = useState({
        fontSize: 60,
        loaderMode: LoaderModes.get,
        mail: null,
        document: null,
        annotation: annotationDefaultValue,
    });
    const containerRef = useRef(null);

    useEffect(() => {
        let isMounted = true;
        if (url) {
            setState({...state, loaderMode: LoaderModes.get, mail: null, document: null, annotation: {label: null}});
            initAsync(url, expectedOutput, filename, mode, fallbackFileName).then((data) => {
                if (isMounted) {
                    setState({...state, loaderMode: LoaderModes.none, ...data});
                    if (containerRef.current.scrollIntoView) {
                        containerRef.current.scrollIntoView({
                            block: 'start',
                            behavior: 'smooth',
                        });
                    }
                }
            });
        }
        return () => {
            isMounted = false;
        };
    }, [url, expectedOutput, labels, filename]);

    const styleImageContainer = {
        zoom: `${state.fontSize}%`
    };

    const onChange = (type, data) => {
        const id = data.id;
        switch (type) {
            case "visibility": {
                const attachment = findAttachment(state.mail, id);
                if (attachment) {
                    if (attachment.parent === null) {
                        const newMail = {...state.mail, isVisibleScreen: data.isVisible};
                        setState({...state, mail: newMail});
                        return;
                    }
                    const newAttachments = updateAttachments(state.mail.mail.attachments, id, {isVisibleScreen: data.isVisible});
                    const newMail = {...state.mail, mail: {...state.mail.mail, attachments: newAttachments}};
                    setState({...state, mail: newMail});
                }
            }
                break;
            case "loading":
                const attachment = findAttachment(state.mail, id);
                if (attachment) {
                    const newAttachments = updateAttachments(state.mail.attachments, id, {});
                    const newMail = {...state.mail, attachments: newAttachments};
                    setState({...state, mail: newMail});
                }
                break;
            default:
                return;
        }

    }

    const onSubmitWrapper = () => {
        if (mode === EmlMode.ocr) {
            const defaultLabel = {}
            labels.map(label => {
                const propertyName = label.name;
                defaultLabel[propertyName] = state.annotation[propertyName] ? state.annotation[propertyName] : '';
            });
            onSubmit(defaultLabel);
        } else {
            onSubmit(state.annotation.label);
        }
    }


    const mail = state.mail;
    const document = state.document;
    return <div id="main">
        {!url && <div>
            <h1>{translate('eml_classifier.title')}</h1>
            <form>
                <input type="file" onChange={onFileChange(state, setState, fallbackFileName)}/>
            </form>
        </div>}
        <div ref={containerRef}>
            <Loader mode={state.loaderMode} text={translate('eml_classifier.loading')}>
                {mail != null && <div id="email-container">
                    <div className="eml__container">
                        <div className="eml__container-principal">
                            <Mail attachment={mail} title={translate('eml_classifier.mail.title')} onChange={onChange}/>
                            <Attachments mail={mail.mail} styleImageContainer={styleImageContainer}
                                         onChange={onChange}/>
                        </div>
                        <div className="eml__container-summary">
                            <MailSummary attachment={mail} setState={setState} state={state} labels={labels}
                                         mode={mode}/>
                        </div>
                    </div>
                </div>}
                {document != null &&
                    <div id="email-container" ref={containerRef}>
                        <div className="eml__container">
                            <div className="eml__container-principal">
                                <Attachment attachment={document} styleImageContainer={styleImageContainer}
                                            onChange={onChange}/>
                            </div>
                            <div className="eml__container-summary">
                                <MailSummary attachment={document} setState={setState} state={state} labels={labels}
                                             title={filename} mainTitle={translate('eml_classifier.mail_summary.main_title_document')} mode={mode}/>
                            </div>
                        </div>
                    </div>}
            </Loader>
        </div>
        <Toolbar
            state={state}
            setState={setState}
            onSubmit={onSubmitWrapper}
            isSubmitDisabled={mode === EmlMode.classifier ? state.annotation.label === null : false}
        />
    </div>
}

export default EmlClassifier;
