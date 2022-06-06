import React from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './navTrigger.module.css';
import compareIcon from '../../assets/Vector8.svg';

const CompareTrigger = props => {
    const classes = useStyle(defaultClasses, props.classes);
    return (
        <button>
            <img src={compareIcon} alt="compare" />
        </button>
    );
};

export default CompareTrigger;
