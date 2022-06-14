import React from 'react';
import { bool, func, shape, string } from 'prop-types';
import { useGuestSignIn } from '@magento/peregrine/lib/talons/CheckoutPage/GuestSignIn/useGuestSignIn';

import { useStyle } from '@magento/venia-ui/lib/classify';
import CreateAccount from '../../CreateAccount';
import ForgotPassword from '@magento/venia-ui/lib/components/ForgotPassword';
import SignIn from '../../SignIn';
import defaultClasses from './guestSignIn.module.css';

const GuestSignIn = props => {
    const { isActive, toggleActiveContent, initialValues } = props;

    const talonProps = useGuestSignIn({ toggleActiveContent });
    const {
        toggleCreateAccountView,
        toggleForgotPasswordView,
        view
    } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);

    const rootClass = isActive ? classes.root : classes.root_hidden;

    let content;
    if (view === 'SIGNIN') {
        content = (
            <SignIn
                classes={{ modal_active: undefined, root: classes.signInRoot }}
                showCreateAccount={toggleCreateAccountView}
                showForgotPassword={toggleForgotPasswordView}
                initialValues={initialValues}
                isCheckoutSignIn={true}
            />
        );
    } else if (view === 'FORGOT_PASSWORD') {
        content = (
            <ForgotPassword
                classes={{ root: classes.forgotPasswordRoot }}
                onCancel={toggleForgotPasswordView}
            />
        );
    } else if (view === 'CREATE_ACCOUNT') {
        content = (
            <CreateAccount
                classes={{ root: classes.createAccountRoot }}
                isCancelButtonHidden={false}
                onCancel={toggleCreateAccountView}
                isCheckoutCreateAccount={true}
            />
        );
    }

    return (
        <div className={rootClass}>
            <div className={classes.contentContainer}>{content}</div>
        </div>
    );
};

export default GuestSignIn;

GuestSignIn.propTypes = {
    classes: shape({
        root: string,
        root_hidden: string,
        header: string,
        contentContainer: string,
        signInRoot: string,
        forgotPasswordRoot: string,
        createAccountRoot: string
    }),
    isActive: bool.isRequired,
    toggleActiveContent: func.isRequired,
    initialValues: shape({
        email: string.isRequired
    })
};
