import React from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './comparePage.module.css';

const ComparePage = props => {
    const classes = useStyle(defaultClasses, props.classes);

    return <div>COMPARE PAGE</div>;
};
export default ComparePage;
