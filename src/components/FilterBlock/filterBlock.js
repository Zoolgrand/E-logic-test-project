import React from 'react';
import { arrayOf, shape, string, func, bool } from 'prop-types';
import { useIntl } from 'react-intl';
import { Form } from 'informed';

import { useFilterBlock } from '@magento/peregrine/lib/talons/FilterModal';
import setValidator from '@magento/peregrine/lib/validators/set';

import { useStyle } from '@magento/venia-ui/lib/classify';
import PriceSlider from '../PriceSlider';
import FilterList from '@magento/venia-ui/lib/components/FilterModal/FilterList';
import defaultClasses from './filterBlock.module.css';
import ColorFilter from '../ColorFilter/colorFilter';
import SizeFilter from '../SizeFilter/sizeFilter';

const FilterBlock = props => {
    const {
        filterApi,
        filterState,
        filterFrontendInput,
        group,
        items,
        name,
        onApply,
        initialOpen
    } = props;

    const { formatMessage } = useIntl();
    const talonProps = useFilterBlock({
        filterState,
        items,
        initialOpen
    });
    const { isExpanded } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);

    const itemAriaLabel = formatMessage(
        {
            id: 'filterModal.item.ariaLabel',
            defaultMessage: 'Filter products by "{itemName}"'
        },
        {
            itemName: name
        }
    );

    const switchGroup = group => {
        switch (group) {
            case 'price':
                return (
                    <PriceSlider
                        filterApi={filterApi}
                        filterState={filterState}
                        group={group}
                        onApply={onApply}
                    />
                );
            case 'color':
                return (
                    <ColorFilter
                        filterApi={filterApi}
                        filterState={filterState}
                        group={group}
                        onApply={onApply}
                        items={items}
                    />
                );
            case 'fashion_size':
                return (
                    <SizeFilter
                        filterApi={filterApi}
                        filterState={filterState}
                        group={group}
                        onApply={onApply}
                        items={items}
                    />
                );
            default:
                return (
                    <FilterList
                        filterApi={filterApi}
                        filterState={filterState}
                        name={name}
                        filterFrontendInput={filterFrontendInput}
                        group={group}
                        items={items}
                        onApply={onApply}
                    />
                );
        }
    };

    const list = isExpanded ? (
        <Form className={classes.list}>{switchGroup(group)}</Form>
    ) : null;

    return (
        <li
            className={classes.root}
            aria-label={itemAriaLabel}
            data-cy="FilterBlock-root"
        >
            <span className={classes.header}>
                <span className={classes.name}>{name}</span>
            </span>

            {list}
        </li>
    );
};

FilterBlock.defaultProps = {
    onApply: null,
    initialOpen: false
};

FilterBlock.propTypes = {
    classes: shape({
        header: string,
        list: string,
        name: string,
        root: string,
        trigger: string
    }),
    filterFrontendInput: string,
    filterApi: shape({}).isRequired,
    filterState: setValidator,
    group: string.isRequired,
    items: arrayOf(shape({})),
    name: string.isRequired,
    onApply: func,
    initialOpen: bool
};

export default FilterBlock;
