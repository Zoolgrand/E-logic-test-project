import React from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './navTrigger.module.css';
import favIcon from '../../assets/Vector9.svg';
import { useHistory } from 'react-router-dom';

const FavoriteTrigger = props => {
    const history = useHistory();

    const favoriteTriggerClickHandler = () => {
        history.push('/wishlist');
    };
    const classes = useStyle(defaultClasses, props.classes);
    return (
        <button onClick={favoriteTriggerClickHandler}>
            <img src={favIcon} alt="favorite" />
        </button>
    );
};

export default FavoriteTrigger;
