module.exports = {
	extends: ['stylelint-config-standard-scss', 'stylelint-config-recommended'],
	rules: {
		'selector-class-pattern': /^(.*[a-z][a-z0-9]*)(-[a-z0-9]+)*$/,
		'at-rule-no-unknown': null,
		'scss/at-rule-no-unknown': true,
		'function-no-unknown': null,
		'no-invalid-position-at-import-rule': null,
		'media-query-no-invalid': null,
	},
};
