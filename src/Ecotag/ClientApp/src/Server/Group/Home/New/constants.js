import i18next from "i18next";

export const NAME = 'NAME';

export let MSG_REQUIRED;

export let MSG_MIN_LENGTH;

export let MSG_MAX_LENGTH;

export let MSG_GROUP_NAME_ALREADY_EXIST;

export let MSG_REGEX;

const updateTranslations = () => {
    const options = {ns: 'constants'};
    MSG_REQUIRED = i18next.t('groups.new.MSG_REQUIRED', options);
    MSG_MIN_LENGTH = i18next.t('groups.new.MSG_MIN_LENGTH', options);
    MSG_MAX_LENGTH = i18next.t('groups.new.MSG_MAX_LENGTH', options);
    MSG_GROUP_NAME_ALREADY_EXIST = i18next.t('groups.new.MSG_GROUP_NAME_ALREADY_EXIST', options);
    MSG_REGEX = i18next.t('groups.new.MSG_REGEX', options);
};

if (i18next.isInitialized) {
    updateTranslations();
}
