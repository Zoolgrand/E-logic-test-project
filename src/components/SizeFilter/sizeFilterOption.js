import React from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './sizeFilterOption.module.css';

const SizeFilterOption = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { item, filterApi, filterState, onApply, group } = props;
    const { title } = item;
    const { toggleItem } = filterApi;

    const filterStateArray = filterState ? [...filterState] : [];

    const isSelectedSize = filterStateArray.includes(item);

    const sizeFilterOptionClass = isSelectedSize
        ? classes.sizeFilterOption_active
        : classes.sizeFilterOption;

    const changeSizeFilterHandler = () => {
        toggleItem({ group, item });
        onApply({ group, item });
    };

    return (
        <div
            onClick={changeSizeFilterHandler}
            className={sizeFilterOptionClass}
        >
            {title}
        </div>
    );
};
export default SizeFilterOption;
