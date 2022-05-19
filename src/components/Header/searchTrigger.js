import React from 'react';
import { shape, string } from 'prop-types';
import SearchIcon from '../../assets/Vector10.svg';
import { useIntl } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './searchTrigger.module.css';
import { useSearchTrigger } from '@magento/peregrine/lib/talons/Header/useSearchTrigger';

const SearchTrigger = React.forwardRef((props, ref) => {
    const { active, onClick } = props;

    const talonProps = useSearchTrigger({
        onClick
    });
    const { handleClick } = talonProps;
    const { formatMessage } = useIntl();

    const classes = useStyle(defaultClasses, props.classes);

    const searchClass = active ? classes.open : classes.root;

    const searchText = formatMessage({
        id: 'searchTrigger.search',
        defaultMessage: 'Search'
    });

    return (
        <button
            className={searchClass}
            data-cy="SearchTrigger-button"
            aria-label={searchText}
            onClick={handleClick}
            ref={ref}
        >
            <img src={SearchIcon} alt="search" />
        </button>
    );
});

SearchTrigger.propTypes = {
    classes: shape({
        root: string,
        open: string
    })
};

export default SearchTrigger;
