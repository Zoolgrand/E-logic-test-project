import React from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import compareIcon from '../../assets/Vector8.svg';
import { useHistory } from 'react-router-dom';
import defaultClasses from './compareTrigger.module.css';
import { useComparePage } from '../../talons/ComparePage/useComparePage';

const CompareTrigger = props => {
    const history = useHistory();
    const classes = useStyle(defaultClasses, props.classes);
    const compareTriggerClickHandler = () => {
        history.push('./compare');
    };

    const { compareCount } = useComparePage();

    const counterClasses =
        compareCount > 0 ? classes.counter : classes.counter_hidden;

    return (
        <div className={classes.compareContainer}>
            <button onClick={compareTriggerClickHandler}>
                <img src={compareIcon} alt="compare" />
            </button>

            <div className={counterClasses}>{compareCount}</div>
        </div>
    );
};

export default CompareTrigger;
