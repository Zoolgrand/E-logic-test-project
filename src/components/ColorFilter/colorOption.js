import React from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './colorOption.module.css';

const ColorOption = props => {
    const { color, filterApi, filterState, group, item, onApply } = props;
    const { addItem, removeGroup } = filterApi;
    const { title } = item;

    const classes = useStyle(defaultClasses, props.classes);
    const itemColor = color.split('_')[0];

    const filterStateArray = filterState ? [...filterState] : [];

    const isSelectedColor = filterStateArray[0]?.title === title;

    const changeColorFilterHandler = () => {
        removeGroup({ group });
        addItem({ group, item });
        onApply({ group, item });
    };

    const colorFilterOptionClass = isSelectedColor ? classes.root_active : classes.root;

    return (
        <div className={colorFilterOptionClass}>
            <div
                onClick={changeColorFilterHandler}
                className={classes.colorFilterOption}
                style={{ backgroundColor: itemColor }}
            />
        </div>
    );
};
export default ColorOption;