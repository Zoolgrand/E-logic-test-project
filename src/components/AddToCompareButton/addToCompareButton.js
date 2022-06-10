import React from 'react';
import CompareIcon from '../../assets/Vector8.svg';
import { useAddToCompareButton } from '../../talons/AddToCompareButton/useAddToCompareButton';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './addToCompareButton.module.css';

const AddToCompareButton = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const talonProps = useAddToCompareButton(props);
    const { isSelected, handleClick } = talonProps;
    const isSelectedClass = isSelected ? classes.compareButtonWrap : null;

    return (
        <div onClick={handleClick} className={isSelectedClass}>
            <button type="button">
                <img src={CompareIcon} />
            </button>
        </div>
    );
};
export default AddToCompareButton;
