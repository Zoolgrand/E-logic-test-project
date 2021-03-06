import React from 'react';

import { Link } from 'react-router-dom';

import resourceUrl from '@magento/peregrine/lib/util/makeUrl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './categoryLeaf.module.css';

const Leaf = props => {
    const { url_suffix, url_path, onNavigate, isRoot, name } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const destination = resourceUrl(`/${url_path}${url_suffix || ''}`);

    const leafTextClasses = isRoot ? classes.leafText : classes.leafTextChild;
    const isSaleLeaf = name === 'Sale' ? classes.sale : '';
    const leafClasses = `${leafTextClasses} ${isSaleLeaf}`;

    return (
        <li className={classes.root}>
            <Link
                className={classes.target}
                data-cy="CategoryTree-Leaf-target"
                to={destination}
                onClick={onNavigate}
            >
                <span className={leafClasses}>{props.name}</span>
            </Link>
        </li>
    );
};

export default Leaf;
