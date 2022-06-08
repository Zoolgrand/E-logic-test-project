import React from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './navTrigger.module.css';
import compareIcon from '../../assets/Vector8.svg';
import { useHistory } from 'react-router-dom';

const CompareTrigger = props => {
    const history = useHistory();
    const classes = useStyle(defaultClasses, props.classes);
    const compareTriggerClickHandler = () => {
        history.push('./compare');
    };
    return (
        <button onClick={compareTriggerClickHandler}>
            <img src={compareIcon} alt="compare" />
        </button>
    );
};

export default CompareTrigger;
