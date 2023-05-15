import {useEffect, useState} from "react";
import {Loader, LoaderModes} from "@axa-fr/react-toolkit-all";
import useProjectTranslation from "../../useProjectTranslation";

const loadFileAsync = async (file) => {
    return await file.text();
}

function TxtAttachment({blob, id, onChange}) {
    const {translate} = useProjectTranslation('toolkit');
    const [state, setState] = useState({
        text: "",
        loaderMode: LoaderModes.none,
    });
    useEffect(() => {
        let isMounted = true;
        setState({
            ...state,
            text: "",
            loaderMode: LoaderModes.get,
        });
        onChange("loading", {id, loaderMode: LoaderModes.get});
        loadFileAsync(blob).then(text => {
            if (isMounted) {
                setState({
                    ...state,
                    text: text,
                    loaderMode: LoaderModes.none,
                });
                onChange("loading", {id, loaderMode: LoaderModes.none});
            }
        });
        return () => {
            isMounted = false;
        };
    }, [id]);
    return (<Loader mode={state.loaderMode} text={translate('eml_classifier.attachments.txt_attachment.loading')}>
        <div>
            <p>{state.text}</p>
        </div>
    </Loader>);
}

export default TxtAttachment;