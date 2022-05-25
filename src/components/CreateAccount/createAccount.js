import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Form } from 'informed';
import { func, shape, string, bool } from 'prop-types';
import { useCreateAccount } from '@magento/peregrine/lib/talons/CreateAccount/useCreateAccount';

import { useStyle } from '@magento/venia-ui/lib/classify';
import combine from '@magento/venia-ui/lib/util/combineValidators';
import {
    hasLengthAtLeast,
    isRequired,
    validatePassword
} from '@magento/venia-ui/lib/util/formValidators';
import Button from '../Button';
import Checkbox from '@magento/venia-ui/lib/components/Checkbox';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '../TextInput';
import defaultClasses from './createAccount.module.css';
import FormError from '@magento/venia-ui/lib/components/FormError';
import Password from '@magento/venia-ui/lib/components/Password';
import GoogleRecaptcha from '@magento/venia-ui/lib/components/GoogleReCaptcha';
import closeIcon from '../../assets/closeIcon.svg';

const CreateAccount = props => {
    const { setAccountMenuIsOpen } = props;

    const talonProps = useCreateAccount({
        initialValues: props.initialValues,
        onSubmit: props.onSubmit,
        onCancel: props.onCancel
    });

    const {
        errors,
        handleCancel,
        handleSubmit,
        isDisabled,
        initialValues,
        recaptchaWidgetProps
    } = talonProps;

    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, props.classes);

    const cancelButton = props.isCancelButtonHidden ? null : (
        <button
            type="button"
            className={classes.cancelbtn}
            onClick={handleCancel}
        >
            <FormattedMessage
                id={'createAccount.cancelText'}
                defaultMessage={'Already Have an Account'}
            />
        </button>
    );

    const submitButton = (
        <Button
            className={classes.submitButton}
            disabled={isDisabled}
            type="submit"
            priority="high"
            data-cy="CreateAccount-submitButton"
        >
            <FormattedMessage
                id={'createAccount.createAccountText'}
                defaultMessage={'Create an Account'}
            />
        </Button>
    );

    return (
        <div className={classes.formWrap}>
            <Form
                data-cy="CreateAccount-form"
                className={classes.root}
                initialValues={initialValues}
                onSubmit={handleSubmit}
            >
                <div className={classes.titleContainer}>
                    <h2 data-cy="CreateAccount-title" className={classes.title}>
                        <FormattedMessage
                            id={'createAccount.createAccountText'}
                            defaultMessage={'Create a New Account'}
                        />
                    </h2>
                    <button
                        type="button"
                        onClick={() => {
                            setAccountMenuIsOpen(false);
                        }}
                    >
                        <img src={closeIcon} alt="X" />
                    </button>
                </div>
                <FormError errors={Array.from(errors.values())} />
                <Field
                    label={formatMessage({
                        id: 'createAccount.firstNameText',
                        defaultMessage: 'First Name'
                    })}
                >
                    <TextInput
                        field="customer.firstname"
                        autoComplete="given-name"
                        validate={isRequired}
                        validateOnBlur
                        mask={value => value && value.trim()}
                        maskOnBlur={true}
                        data-cy="customer-firstname"
                        placeholder="Enter your first name "
                    />
                </Field>
                <Field
                    label={formatMessage({
                        id: 'createAccount.lastNameText',
                        defaultMessage: 'Last Name'
                    })}
                >
                    <TextInput
                        field="customer.lastname"
                        autoComplete="family-name"
                        validate={isRequired}
                        validateOnBlur
                        mask={value => value && value.trim()}
                        maskOnBlur={true}
                        data-cy="customer-lastname"
                        placeholder="Enter your last name"
                    />
                </Field>
                <Field
                    label={formatMessage({
                        id: 'createAccount.emailText',
                        defaultMessage: 'Email'
                    })}
                >
                    <TextInput
                        field="customer.email"
                        autoComplete="email"
                        validate={isRequired}
                        validateOnBlur
                        mask={value => value && value.trim()}
                        maskOnBlur={true}
                        data-cy="customer-email"
                        placeholder="Enter your email"
                    />
                </Field>
                <Password
                    autoComplete="new-password"
                    fieldName="password"
                    isToggleButtonHidden={false}
                    label={formatMessage({
                        id: 'createAccount.passwordText',
                        defaultMessage: 'Password'
                    })}
                    validate={combine([
                        isRequired,
                        [hasLengthAtLeast, 8],
                        validatePassword
                    ])}
                    validateOnBlur
                    mask={value => value && value.trim()}
                    maskOnBlur={true}
                    data-cy="password"
                />
                <div className={classes.subscribe}>
                    <Checkbox
                        field="subscribe"
                        id="subscribe"
                        label={formatMessage({
                            id: 'createAccount.subscribeText',
                            defaultMessage: 'Sign Up for Newsletter'
                        })}
                    />
                </div>
                <GoogleRecaptcha {...recaptchaWidgetProps} />
                <div className={classes.actions}>
                    {submitButton}
                    {cancelButton}
                </div>
            </Form>
        </div>
    );
};

CreateAccount.propTypes = {
    classes: shape({
        actions: string,
        lead: string,
        root: string,
        subscribe: string
    }),
    initialValues: shape({
        email: string,
        firstName: string,
        lastName: string
    }),
    isCancelButtonHidden: bool,
    onSubmit: func,
    onCancel: func
};

CreateAccount.defaultProps = {
    onCancel: () => {},
    isCancelButtonHidden: true
};

export default CreateAccount;
