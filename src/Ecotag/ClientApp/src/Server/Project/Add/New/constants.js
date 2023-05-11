import i18next from "i18next";

export const NAME = 'NAME';
export const DATASET = 'DATASET';
export const TYPE = 'TYPE';
export const NUMBER_CROSS_ANNOTATION = 'NUMBER_CROSS_ANNOTATION';
export const LABELS = 'LABELS';
export const GROUP = 'GROUP';

export let MSG_REQUIRED;
export let MSG_MAX_LABELS_LENGTH;
export let MSG_MIN_LENGTH;
export let MSG_MAX_LENGTH;
export let MSG_TEXT_REGEX;
export let MSG_PROJECT_NAME_ALREADY_EXIST;
export let MSG_DUPLICATE_LABEL_NAME;
export let MSG_RULE_NUMBER;

export let TYPE_CROPPING;
export let TYPE_IMAGE_CLASSIFIER;
export let TYPE_OCR;
export let TYPE_NAMED_ENTITY;
export let TYPE_ROTATION;
export let TYPE_EML_CLASSIFIER;
export let TYPE_DOCUMENT_CLASSIFIER;
export let TYPE_DOCUMENT_OCR;

export let LABEL_NUMBER;

const updateTranslations = () => {
    const options = {ns: 'constants'};
    MSG_REQUIRED = i18next.t('projects.new.MSG_REQUIRED', options);
    MSG_MIN_LENGTH = i18next.t('projects.new.MSG_MIN_LENGTH', options);
    MSG_MAX_LENGTH = i18next.t('projects.new.MSG_MAX_LENGTH', options);
    MSG_MAX_LABELS_LENGTH = i18next.t('projects.new.MSG_MAX_LABELS_LENGTH', options);
    MSG_TEXT_REGEX = i18next.t('projects.new.MSG_TEXT_REGEX', options);
    MSG_PROJECT_NAME_ALREADY_EXIST = i18next.t('projects.new.MSG_PROJECT_NAME_ALREADY_EXIST', options);
    MSG_DUPLICATE_LABEL_NAME = i18next.t('projects.new.MSG_DUPLICATE_LABEL_NAME', options);
    MSG_RULE_NUMBER = i18next.t('projects.new.MSG_RULE_NUMBER', options);
    TYPE_CROPPING = i18next.t('projects.new.types.cropping', options);
    TYPE_IMAGE_CLASSIFIER = i18next.t('projects.new.types.image_classifier', options);
    TYPE_OCR = i18next.t('projects.new.types.ocr', options);
    TYPE_NAMED_ENTITY = i18next.t('projects.new.types.named_entity', options);
    TYPE_ROTATION = i18next.t('projects.new.types.rotation', options);
    TYPE_EML_CLASSIFIER = i18next.t('projects.new.types.eml_classifier', options);
    TYPE_DOCUMENT_CLASSIFIER = i18next.t('projects.new.types.document_classifier', options);
    TYPE_DOCUMENT_OCR = i18next.t('projects.new.types.document_ocr', options);
    LABEL_NUMBER = i18next.t('projects.new.LABEL_NUMBER', options);
};

if (i18next.isInitialized) {
    updateTranslations();
}
