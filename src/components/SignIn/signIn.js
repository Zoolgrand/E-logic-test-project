import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { func, shape, string } from 'prop-types';
import { Form } from 'informed';
import { useSignIn } from '../../talons/SignIn/useSignIn';
import { useWindowSize } from '@magento/peregrine';

import { useStyle } from '@magento/venia-ui/lib/classify';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import Button from '../Button/button';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '../TextInput';
import defaultClasses from './signIn.module.css';
import { GET_CART_DETAILS_QUERY } from './signIn.gql';
import LinkButton from '@magento/venia-ui/lib/components/LinkButton';
import Password from '@magento/venia-ui/lib/components/Password';
import Checkbox from '../Checkbox';
import FormError from '@magento/venia-ui/lib/components/FormError/formError';
import GoogleRecaptcha from '@magento/venia-ui/lib/components/GoogleReCaptcha';
import closeIcon from '../../assets/closeIcon.svg';

const SignIn = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const {
        setDefaultUsername,
        showCreateAccount,
        showForgotPassword,
        initialValues,
        setAccountMenuIsOpen,
        isCheckoutSignIn
    } = props;

    const { formatMessage } = useIntl();
    const talonProps = useSignIn({
        getCartDetailsQuery: GET_CART_DETAILS_QUERY,
        setDefaultUsername,
        showCreateAccount,
        showForgotPassword
    });

    const {
        errors,
        handleCreateAccount,
        handleForgotPassword,
        handleSubmit,
        isBusy,
        setFormApi,
        recaptchaWidgetProps
    } = talonProps;

    const windowSize = useWindowSize();
    const isDesktop = windowSize.innerWidth >= 769;

    const forgotPasswordClasses = {
        root: classes.forgotPasswordButton
    };

    const defaultSignIn = (
        <div data-cy="SignIn-root" className={classes.root}>
            <div className={classes.titleContainer}>
                <span data-cy="SignIn-title" className={classes.title}>
                    <FormattedMessage
                        id={'signIn.titleText'}
                        defaultMessage={'Login Your Account'}
                    />
                </span>
                {isDesktop && (
                    <button
                        type="button"
                        onClick={() => {
                            setAccountMenuIsOpen(false);
                        }}
                    >
                        <img src={closeIcon} alt="X" />
                    </button>
                )}
            </div>
            <FormError errors={Array.from(errors.values())} />
            <Form
                getApi={setFormApi}
                className={classes.form}
                onSubmit={handleSubmit}
                data-cy="SignIn-form"
                initialValues={initialValues && initialValues}
            >
                <Field
                    label={formatMessage({
                        id: 'signIn.emailAddressText',
                        defaultMessage: 'Email'
                    })}
                >
                    <TextInput
                        data-cy="SignIn-email"
                        autoComplete="email"
                        field="email"
                        validate={isRequired}
                        data-cy="email"
                        placeholder="Enter your email"
                    />
                </Field>
                <Password
                    data-cy="SignIn-password"
                    fieldName="password"
                    label={formatMessage({
                        id: 'signIn.passwordText',
                        defaultMessage: 'Password'
                    })}
                    validate={isRequired}
                    autoComplete="current-password"
                    isToggleButtonHidden={false}
                    data-cy="password"
                />

                <div className={classes.forgotPasswordButtonContainer}>
                    <Checkbox
                        field="rememberMe"
                        id="rememberMe"
                        label={formatMessage({
                            id: 'signin.rememberMe',
                            defaultMessage: 'Remember me'
                        })}
                    />

                    <LinkButton
                        classes={forgotPasswordClasses}
                        type="button"
                        onClick={handleForgotPassword}
                        data-cy="SignIn-forgotPasswordButton"
                    >
                        <FormattedMessage
                            id={'signIn.forgotPasswordText'}
                            defaultMessage={'Forgot Password?'}
                        />
                    </LinkButton>
                </div>

                <GoogleRecaptcha {...recaptchaWidgetProps} />

                <div className={classes.buttonsContainer}>
                    <Button
                        priority="high"
                        type="submit"
                        data-cy="SignInButton-root_highPriority"
                        disabled={isBusy}
                    >
                        <FormattedMessage
                            id={'signIn.signInText'}
                            defaultMessage={'SIGN IN'}
                        />
                    </Button>
                    <Button
                        priority="normal"
                        type="button"
                        onClick={handleCreateAccount}
                        data-cy="CreateAccount-initiateButton"
                    >
                        <FormattedMessage
                            id={'signIn.createAccountText'}
                            defaultMessage={'Create an Account'}
                        />
                    </Button>
                </div>
            </Form>
        </div>
    );

    const checkoutSignIn = (
        <div data-cy="SignIn-root" className={classes.guestRoot}>
            <FormError errors={Array.from(errors.values())} />
            <Form
                getApi={setFormApi}
                className={classes.form}
                onSubmit={handleSubmit}
                data-cy="SignIn-form"
                initialValues={initialValues && initialValues}
            >
                <div>
                    <div className={classes.guestSignInInputs}>
                        <div>
                            <div className={classes.guestSignInEmail}>
                                <p className={classes.emailTitle}>Email</p>
                            </div>
                            <TextInput
                                data-cy="SignIn-email"
                                autoComplete="email"
                                field="email"
                                validate={isRequired}
                                data-cy="email"
                                placeholder="Enter your email"
                            />
                        </div>

                        <Password
                            data-cy="SignIn-password"
                            fieldName="password"
                            label={formatMessage({
                                id: 'signIn.passwordText',
                                defaultMessage: 'Password'
                            })}
                            validate={isRequired}
                            autoComplete="current-password"
                            isToggleButtonHidden={false}
                            data-cy="password"
                        />
                    </div>
                </div>

                <div className={classes.guestForgotPasswordButtonContainer}>
                    <Checkbox
                        field="rememberMe"
                        id="rememberMe"
                        label={formatMessage({
                            id: 'signin.rememberMe',
                            defaultMessage: 'Remember me'
                        })}
                    />

                    <LinkButton
                        classes={forgotPasswordClasses}
                        type="button"
                        onClick={handleForgotPassword}
                        data-cy="SignIn-forgotPasswordButton"
                    >
                        <FormattedMessage
                            id={'signIn.forgotPasswordText'}
                            defaultMessage={'Forgot Password?'}
                        />
                    </LinkButton>
                </div>

                <GoogleRecaptcha {...recaptchaWidgetProps} />

                <div className={classes.buttonsContainer}>
                    <Button
                        priority="high"
                        type="submit"
                        data-cy="SignInButton-root_highPriority"
                        disabled={isBusy}
                        classes={{
                            root_highPriority: classes.signInBtn
                        }}
                    >
                        <FormattedMessage
                            id={'signIn.signInText'}
                            defaultMessage={'SIGN IN'}
                        />
                    </Button>
                    <Button
                        priority="normal"
                        type="button"
                        onClick={handleCreateAccount}
                        classes={{
                            root_normalPriority: classes.createAccBnt
                        }}
                        data-cy="CreateAccount-initiateButton"
                    >
                        <FormattedMessage
                            id={'signIn.createAccountText'}
                            defaultMessage={'Create an Account'}
                        />
                    </Button>
                </div>
            </Form>
        </div>
    );
    const signInToRender = isCheckoutSignIn ? checkoutSignIn : defaultSignIn;
    return <>{signInToRender}</>;
};

export default SignIn;
SignIn.propTypes = {
    classes: shape({
        buttonsContainer: string,
        form: string,
        forgotPasswordButton: string,
        forgotPasswordButtonContainer: string,
        root: string,
        title: string
    }),
    setDefaultUsername: func,
    showCreateAccount: func,
    showForgotPassword: func,
    initialValues: shape({
        email: string.isRequired
    })
};
SignIn.defaultProps = {
    setDefaultUsername: () => {},
    showCreateAccount: () => {},
    showForgotPassword: () => {}
};
