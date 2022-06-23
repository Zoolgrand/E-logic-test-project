import React, { useMemo } from 'react';
import { arrayOf, func, object, shape, string } from 'prop-types';
import Tile from './tile';

import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './tileList.module.css';
import dropdownArrow from '../../assets/dropdownArrow.svg';

const TileList = props => {
    const { getItemKey, selectedValue = {}, items, onSelectionChange } = props;

    const classes = useStyle(defaultClasses, props.classes);

    const tiles = useMemo(
        () =>
            items.map(item => {
                const isSelected = item.label === selectedValue.label;

                return (
                    <Tile
                        key={getItemKey(item)}
                        isSelected={isSelected}
                        item={item}
                    />
                );
            }),
        [getItemKey, selectedValue.label, items, onSelectionChange]
    );
    const selectOnChange = e => {
        onSelectionChange(+e.target.value);
    };
    return (
        <div className={classes.selectWrap}>
            <select
                defaultValue={'Default'}
                onChange={selectOnChange}
                className={classes.root}
            >
                <option disabled value="Default">
                    Choose an Option
                </option>
                {tiles}
            </select>
            <img src={dropdownArrow} />
        </div>
    );
};

TileList.propTypes = {
    classes: shape({
        root: string
    }),
    getItemKey: func,
    selectedValue: object,
    items: arrayOf(object),
    onSelectionChange: func
};

TileList.displayName = 'TileList';

export default TileList;
