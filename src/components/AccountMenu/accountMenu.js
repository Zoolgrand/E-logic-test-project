import React from 'react';
import { shape, string } from 'prop-types';
import { useAccountMenu } from '../../talons/Header/useAccountMenu';

import { useStyle } from '@magento/venia-ui/lib/classify';
import CreateAccount from '../CreateAccount';
import SignIn from '../SignIn';
import AccountMenuItems from './accountMenuItems';
import ForgotPassword from '@magento/venia-ui/lib/components/ForgotPassword';
import defaultClasses from './accountMenu.module.css';

const AccountMenu = React.forwardRef((props, ref) => {
    const { accountMenuIsOpen, setAccountMenuIsOpen } = props;
    const talonProps = useAccountMenu({
        accountMenuIsOpen,
        setAccountMenuIsOpen
    });
    const {
        view,
        username,
        handleAccountCreation,
        handleSignOut,
        handleForgotPassword,
        handleCancel,
        handleCreateAccount,
        updateUsername,
        closeModalHandler
    } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);
    const rootClass = accountMenuIsOpen ? classes.root_open : classes.root;
    const contentsClass = accountMenuIsOpen
        ? classes.contents_open
        : classes.contents;

    const isAccountMenuViewClasses = accountMenuIsOpen
        ? classes.accountMenuOpen
        : classes.accountMenu;

    let dropdownContents = null;

    switch (view) {
        case 'ACCOUNT': {
            dropdownContents = <AccountMenuItems onSignOut={handleSignOut} />;

            break;
        }
        case 'FORGOT_PASSWORD': {
            dropdownContents = (
                <ForgotPassword
                    initialValues={{ email: username }}
                    onCancel={handleCancel}
                />
            );

            break;
        }
        case 'CREATE_ACCOUNT': {
            dropdownContents = (
                <CreateAccount
                    classes={{ root: classes.createAccount }}
                    initialValues={{ email: username }}
                    isCancelButtonHidden={false}
                    onSubmit={handleAccountCreation}
                    onCancel={handleCancel}
                    setAccountMenuIsOpen={setAccountMenuIsOpen}
                />
            );

            break;
        }
        case 'SIGNIN':
        default: {
            dropdownContents = (
                <SignIn
                    classes={{
                        modal_active: classes.loading
                    }}
                    setDefaultUsername={updateUsername}
                    showCreateAccount={handleCreateAccount}
                    showForgotPassword={handleForgotPassword}
                    setAccountMenuIsOpen={setAccountMenuIsOpen}
                />
            );

            break;
        }
    }

    return (
        <aside className={rootClass} data-cy="AccountMenu-root">
            {view !== 'ACCOUNT' ? (
                <div
                    ref={ref}
                    onClick={closeModalHandler}
                    className={contentsClass}
                >
                    {accountMenuIsOpen ? dropdownContents : null}
                </div>
            ) : (
                <div
                    ref={ref}
                    onClick={closeModalHandler}
                    className={isAccountMenuViewClasses}
                >
                    {accountMenuIsOpen ? dropdownContents : null}
                </div>
            )}
        </aside>
    );
});

export default AccountMenu;

AccountMenu.propTypes = {
    classes: shape({
        root: string,
        root_open: string,
        link: string,
        contents_open: string,
        contents: string
    })
};
