import i18next from "i18next";

export const NAME = 'NAME';

export let MSG_REQUIRED;

export let MSG_MIN_LENGTH;

export let MSG_MAX_LENGTH;

export let MSG_GROUP_NAME_ALREADY_EXIST;

function updateTranslations () {
    MSG_REQUIRED = i18next.t('constants.groups.new.MSG_REQUIRED', {ns: 'constants'});
    MSG_MIN_LENGTH = i18next.t('constants.groups.new.MSG_MIN_LENGTH', {ns: 'constants'});
    MSG_MAX_LENGTH = i18next.t('constants.groups.new.MSG_MAX_LENGTH', {ns: 'constants'});
    MSG_GROUP_NAME_ALREADY_EXIST = i18next.t('constants.groups.new.MSG_GROUP_NAME_ALREADY_EXIST', {ns: 'constants'});
}

if (i18next.isInitialized) {
    updateTranslations();
}

i18next.on('languageChanged', function(lng) {
    updateTranslations();
});
