import React, { Fragment, Suspense } from 'react';
import { useIntl } from 'react-intl';
import { bool, func, shape, string } from 'prop-types';
import burgerMenuIcon from '../../assets/burgerMenu.svg';
import { useStyle } from '@magento/venia-ui/lib/classify';
import AccountChip from '../AccountChip';
import Trigger from '@magento/venia-ui/lib/components/Trigger';
import defaultClasses from './navHeader.module.css';
import { useNavigationHeader } from '@magento/peregrine/lib/talons/Navigation/useNavigationHeader';
import SearchTrigger from '../Header/searchTrigger';
import FavoriteTrigger from '../Header/favoriteTrigger';
import CartTrigger from '../Header/cartTrigger';
import { useHeader } from '@magento/peregrine/lib/talons/Header/useHeader';
import { Route } from 'react-router-dom';

const SearchBar = React.lazy(() => import('../SearchBar'));

const NavHeader = props => {
    const { isTopLevel, onBack, view } = props;
    const { formatMessage } = useIntl();

    const talonProps = useNavigationHeader({
        isTopLevel,
        onBack,
        view
    });

    const { handleBack } = talonProps;

    const {
        handleSearchTriggerClick,
        searchTriggerRef,
        isSearchOpen,
        searchRef
    } = useHeader();

    const classes = useStyle(defaultClasses, props.classes);
    const titles = {
        CREATE_ACCOUNT: formatMessage({
            id: 'navHeader.createAccountText',
            defaultMessage: 'Create Account'
        }),
        FORGOT_PASSWORD: formatMessage({
            id: 'navHeader.forgotPasswordText',
            defaultMessage: 'Forgot Password'
        }),
        MY_ACCOUNT: formatMessage({
            id: 'navHeader.myAccountText',
            defaultMessage: 'My Account'
        }),
        SIGN_IN: formatMessage({
            id: 'navHeader.signInText',
            defaultMessage: 'Sign In'
        }),
        MENU: formatMessage({
            id: 'navHeader.mainMenuText',
            defaultMessage: 'Main Menu'
        })
    };

    let titleElement;
    if (['MY_ACCOUNT', 'SIGN_IN'].includes(view)) {
        titleElement = (
            <AccountChip
                fallbackText={formatMessage({
                    id: 'navHeader.accountText',
                    defaultMessage: 'Account'
                })}
            />
        );
    } else {
        const title = titles[view] || titles.MENU;
        titleElement = <span>{title}</span>;
    }
    const searchBarFallback = (
        <div className={classes.searchFallback} ref={searchRef}>
            <div className={classes.input}>
                <div className={classes.loader}>
                    <div className={classes.loaderBefore} />
                    <div className={classes.loaderAfter} />
                </div>
            </div>
        </div>
    );
    const searchBar = isSearchOpen ? (
        <Suspense fallback={searchBarFallback}>
            <Route>
                <SearchBar isOpen={isSearchOpen} ref={searchRef} />
            </Route>
        </Suspense>
    ) : null;

    return (
        <Fragment>
            <Trigger key="backButton" action={handleBack}>
                <img src={burgerMenuIcon} alt="burgerMenu" />
            </Trigger>
            <SearchTrigger
                onClick={handleSearchTriggerClick}
                ref={searchTriggerRef}
            />
            <span key="title" className={classes.title}>
                EloTemp
            </span>
            <FavoriteTrigger />
            <CartTrigger />
            {searchBar}
        </Fragment>
    );
};

export default NavHeader;

NavHeader.propTypes = {
    classes: shape({
        title: string
    }),
    isTopLevel: bool,
    onBack: func.isRequired,
    view: string.isRequired
};
