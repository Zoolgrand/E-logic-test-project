import React, { Fragment, Suspense } from 'react';
import { shape, string } from 'prop-types';
import { Link, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import AccountTrigger from './accountTrigger';
import CartTrigger from './cartTrigger';
import NavTrigger from './navTrigger';
import SearchTrigger from './searchTrigger';
import OnlineIndicator from './onlineIndicator';
import { useHeader } from '@magento/peregrine/lib/talons/Header/useHeader';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './header.module.css';
import StoreSwitcher from './storeSwitcher';
import MegaMenu from '../MegaMenu';
import PageLoadingIndicator from '@magento/venia-ui/lib/components/PageLoadingIndicator';
import CompareTrigger from './compareTrigger';
import FavoriteTrigger from './favoriteTrigger';
import { useWindowSize } from '@magento/peregrine';
import Notifications from '../Notification/notification';

const SearchBar = React.lazy(() =>
    import('@magento/venia-ui/lib/components/SearchBar')
);

const Header = props => {
    const {
        handleSearchTriggerClick,
        hasBeenOffline,
        isOnline,
        isSearchOpen,
        searchRef,
        searchTriggerRef
    } = useHeader();

    const windowSize = useWindowSize();
    const isMobile = windowSize.innerWidth <= 768;

    const classes = useStyle(defaultClasses, props.classes);
    const rootClass = isSearchOpen ? classes.open : classes.closed;

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

    const triggerBlock = !isMobile ? (
        <div className={classes.secondaryActions}>
            <SearchTrigger
                onClick={handleSearchTriggerClick}
                ref={searchTriggerRef}
            />
            <CompareTrigger />
            <FavoriteTrigger />
            <CartTrigger />
            <AccountTrigger />
            <StoreSwitcher />
        </div>
    ) : (
        <CartTrigger />
    );

    return (
        <Fragment>
            <header className={rootClass} data-cy="Header-root">
                <div className={classes.toolbar}>
                    <div className={classes.primaryActions}>
                        <NavTrigger />
                    </div>
                    <OnlineIndicator
                        hasBeenOffline={hasBeenOffline}
                        isOnline={isOnline}
                    />
                    <Link
                        to={resourceUrl('/')}
                        className={classes.logoContainer}
                        data-cy="Header-logoContainer"
                    >
                        <div className={classes.headerLogo}>EloTemp</div>
                    </Link>

                    <MegaMenu />
                    {triggerBlock}
                </div>
                {searchBar}
                <Toaster />
                <Notifications />
                <PageLoadingIndicator absolute />
            </header>
        </Fragment>
    );
};

Header.propTypes = {
    classes: shape({
        closed: string,
        logo: string,
        open: string,
        primaryActions: string,
        secondaryActions: string,
        toolbar: string,
        switchers: string,
        switchersContainer: string
    })
};

export default Header;
