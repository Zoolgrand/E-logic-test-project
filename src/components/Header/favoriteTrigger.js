import React from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './navTrigger.module.css';
import favIcon from '../../assets/Vector9.svg'

const FavoriteTrigger = props => {


    const classes = useStyle(defaultClasses, props.classes);
    return (
        <button
        >
            <img src={favIcon} alt='favorite'/>
        </button>
    );
};



export default FavoriteTrigger;
