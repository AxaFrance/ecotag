import i18next from "i18next";

export const NAME = 'name';
export const CLASSIFICATION = 'classification';
export const TYPE = 'type';
export const GROUP = 'groupId';
export const DATASETS_IMPORT = 'datasetsImport';
export const IMPORTED_DATASET_NAME = 'importedDatasetName';

export let MSG_REQUIRED;
export let MSG_DATASET_NAME_ALREADY_EXIST;
export let MSG_DATASET_NAME_FORMAT;
export let MSG_MIN_LENGTH;
export let MSG_MAX_LENGTH;

const updateTranslations = () => {
    const options = {ns: 'constants'};
    MSG_REQUIRED = i18next.t('datasets.new.MSG_REQUIRED', options);
    MSG_MIN_LENGTH = i18next.t('datasets.new.MSG_MIN_LENGTH', options);
    MSG_MAX_LENGTH = i18next.t('datasets.new.MSG_MAX_LENGTH', options);
    MSG_DATASET_NAME_ALREADY_EXIST = i18next.t('datasets.new.MSG_DATASET_NAME_ALREADY_EXIST', options);
    MSG_DATASET_NAME_FORMAT = i18next.t('datasets.new.MSG_DATASET_NAME_FORMAT', options);
};

if (i18next.isInitialized) {
    updateTranslations();
}
