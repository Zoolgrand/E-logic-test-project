import React, { Fragment, useEffect, useRef } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Form } from 'informed';
import { func, shape, string, arrayOf, number } from 'prop-types';
import { AlertCircle } from 'react-feather';
import { useGuestForm } from '@magento/peregrine/lib/talons/CheckoutPage/ShippingInformation/AddressForm/useGuestForm';
import { useToasts } from '@magento/peregrine';

import { useStyle } from '@magento/venia-ui/lib/classify';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import Button from '../../../Button';
import Country from '@magento/venia-ui/lib/components/Country';
import Field from '@magento/venia-ui/lib/components/Field';
import FormError from '@magento/venia-ui/lib/components/FormError';
import Region from '../../../Region';
import Postcode from '../../../Postcode';
import TextInput from '../../../TextInput';
import Icon from '@magento/venia-ui/lib/components/Icon';
import defaultClasses from './guestForm.module.css';

const AlertCircleIcon = <Icon src={AlertCircle} attrs={{ width: 20 }} />;

const GuestForm = props => {
    const {
        afterSubmit,
        classes: propClasses,
        onCancel,
        onSuccess,
        shippingData,
        toggleSignInContent,
        setGuestSignInUsername,
        activeSignInTab
    } = props;

    const talonProps = useGuestForm({
        afterSubmit,
        onCancel,
        onSuccess,
        shippingData,
        toggleSignInContent,
        setGuestSignInUsername
    });
    const {
        errors,
        handleCancel,
        handleSubmit,
        initialValues,
        isSaving,
        isUpdate,
        showSignInToast,
        handleToastAction,
        handleValidateEmail
    } = talonProps;

    const formApiRef = useRef();
    const getFormApi = api => {
        formApiRef.current = api;
    };

    const [, { addToast }] = useToasts();

    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, propClasses);

    const cancelButton = isUpdate ? (
        <Button disabled={isSaving} onClick={handleCancel} priority="low">
            <FormattedMessage
                id={'global.cancelButton'}
                defaultMessage={'Cancel'}
            />
        </Button>
    ) : null;

    const submitButtonText = isUpdate
        ? formatMessage({
              id: 'global.updateButton',
              defaultMessage: 'Update'
          })
        : formatMessage({
              id: 'guestForm.continueToNextStep',
              defaultMessage: 'Continue to Shipping Method'
          });
    const submitButtonProps = {
        disabled: isSaving,
        priority: isUpdate ? 'high' : 'normal',
        type: 'submit'
    };

    useEffect(() => {
        if (showSignInToast) {
            addToast({
                type: 'info',
                icon: AlertCircleIcon,
                message: formatMessage({
                    id: 'checkoutPage.suggestSignInMessage',
                    defaultMessage:
                        'The email you provided is associated with an existing Venia account. Would you like to sign into this account?'
                }),
                timeout: false,
                dismissable: true,
                hasDismissAction: true,
                dismissActionText: formatMessage({
                    id: 'checkoutPage.suggestSignInDeclineMessage',
                    defaultMessage: 'No, thanks'
                }),
                actionText: formatMessage({
                    id: 'checkoutPage.suggestSignInConfirmMessage',
                    defaultMessage: 'Yes, sign in'
                }),
                onAction: removeToast =>
                    handleToastAction(
                        removeToast,
                        formApiRef.current.getValue('email')
                    )
            });
        }
    }, [addToast, formatMessage, showSignInToast, handleToastAction]);

    return (
        <Fragment>
            <FormError errors={Array.from(errors.values())} />
            <Form
                className={classes.root}
                data-cy="GuestForm-root"
                initialValues={initialValues}
                onSubmit={handleSubmit}
                getApi={getFormApi}
            >
                <div className={classes.emailBlock}>
                    <div className={classes.country}>
                        <Country
                            validate={isRequired}
                            data-cy="GuestForm-country"
                        />
                    </div>

                    {!activeSignInTab && (
                        <div className={classes.email}>
                            <Field
                                id="email"
                                label={formatMessage({
                                    id: 'global.email',
                                    defaultMessage: 'Email'
                                })}
                            >
                                <TextInput
                                    autoComplete="off"
                                    field="email"
                                    id="email"
                                    data-cy="GuestForm-email"
                                    validate={isRequired}
                                    onBlur={() =>
                                        handleValidateEmail(
                                            formApiRef.current.getValue('email')
                                        )
                                    }
                                    onPaste={e => {
                                        const text = e.clipboardData.getData(
                                            'text/plain'
                                        );
                                        handleValidateEmail(text);
                                    }}
                                />
                            </Field>
                        </div>
                    )}
                </div>

                <div className={classes.nameBlock}>
                    <div className={classes.firstname}>
                        <Field
                            id="firstname"
                            label={formatMessage({
                                id: 'global.firstName',
                                defaultMessage: 'First Name'
                            })}
                        >
                            <TextInput
                                field="firstname"
                                id="firstname"
                                data-cy="GuestForm-firstName"
                                validate={isRequired}
                                placeholder={'Enter your name'}
                            />
                        </Field>
                    </div>
                    <div className={classes.lastname}>
                        <Field
                            id="lastname"
                            label={formatMessage({
                                id: 'global.lastName',
                                defaultMessage: 'Last Name'
                            })}
                        >
                            <TextInput
                                field="lastname"
                                id="lastname"
                                data-cy="GuestForm-lastName"
                                validate={isRequired}
                                placeholder={'Enter your Last Name'}
                            />
                        </Field>
                    </div>
                </div>

                <div className={classes.street0}>
                    <Field
                        id="street0"
                        label={formatMessage({
                            id: 'global.streetAddress',
                            defaultMessage: 'Address Line 1'
                        })}
                    >
                        <TextInput
                            field="street[0]"
                            id="street0"
                            data-cy="GuestForm-street0"
                            validate={isRequired}
                            placeholder={'Address Line 1'}
                        />
                    </Field>
                </div>
                <div className={classes.street1}>
                    <Field
                        id="street1"
                        label={formatMessage({
                            id: 'global.streetAddress2',
                            defaultMessage: 'Address Line 2 (Apt / Suite)'
                        })}
                    >
                        <TextInput
                            field="street[1]"
                            id="street1"
                            data-cy="GuestForm-street1"
                            placeholder={'Address Line 2 (Apt / Suite)'}
                        />
                    </Field>
                </div>

                <div className={classes.cityBlock}>
                    <div className={classes.city}>
                        <Field
                            id="city"
                            label={formatMessage({
                                id: 'global.city',
                                defaultMessage: 'City'
                            })}
                        >
                            <TextInput
                                field="city"
                                id="city"
                                data-cy="GuestForm-city"
                                validate={isRequired}
                                placeholder={'Enter City'}
                            />
                        </Field>
                    </div>

                    <div className={classes.region}>
                        <Region
                            validate={isRequired}
                            fieldInput={'region[region]'}
                            fieldSelect={'region[region_id]'}
                            optionValueKey={'id'}
                            data-cy="GuestForm-region"
                        />
                    </div>
                </div>

                <div className={classes.phoneBlock}>
                    <div className={classes.postcode}>
                        <Postcode
                            validate={isRequired}
                            data-cy="GuestForm-postcode"
                        />
                    </div>

                    <div className={classes.telephone}>
                        <Field
                            id="telephone"
                            label={formatMessage({
                                id: 'global.phoneNumber',
                                defaultMessage: 'Phone Number'
                            })}
                        >
                            <TextInput
                                field="telephone"
                                id="telephone"
                                data-cy="GuestForm-telephone"
                                validate={isRequired}
                                placeholder={'Enter your phone number'}
                            />
                        </Field>
                    </div>
                </div>

                <div className={classes.buttons}>
                    {cancelButton}
                    <Button
                        {...submitButtonProps}
                        classes={{
                            root_normalPriority: classes.submitBtn
                        }}
                        data-cy="GuestForm-submitButton"
                    >
                        {submitButtonText}
                    </Button>
                </div>
            </Form>
        </Fragment>
    );
};

export default GuestForm;

GuestForm.defaultProps = {
    shippingData: {
        country: {
            code: DEFAULT_COUNTRY_CODE
        },
        region: {
            code: ''
        }
    }
};

GuestForm.propTypes = {
    afterSubmit: func,
    classes: shape({
        root: string,
        field: string,
        email: string,
        firstname: string,
        lastname: string,
        country: string,
        street0: string,
        street1: string,
        city: string,
        region: string,
        postcode: string,
        telephone: string,
        buttons: string,
        submit: string,
        submit_update: string
    }),
    onCancel: func,
    onSuccess: func.isRequired,
    shippingData: shape({
        city: string,
        country: shape({
            code: string.isRequired
        }).isRequired,
        email: string,
        firstname: string,
        lastname: string,
        postcode: string,
        region: shape({
            region_id: number,
            region: string
        }).isRequired,
        street: arrayOf(string),
        telephone: string
    }),
    toggleSignInContent: func.isRequired,
    setGuestSignInUsername: func.isRequired
};
