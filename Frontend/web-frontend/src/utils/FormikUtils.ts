import { MutableRefObject } from 'react';
import { FormikProps } from 'formik';

export function formikValidateOnMountFunc<T>(formikRef: MutableRefObject<FormikProps<T> | null>) {
	if (formikRef === null) {
		console.log('formikRef is null');
		return;
	}
	if (formikRef.current === null) {
		console.log('formikRef is null');
		return;
	}
	formikRef.current.validateForm().then(() => ({}));
}
