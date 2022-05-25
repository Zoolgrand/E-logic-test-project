import React from 'react';
import arrowDown from '../../assets/arrowDown.svg';
import arrowUp from '../../assets/arrowUp.svg';

import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './categoryBranch.module.css';
import Leaf from './categoryLeaf';
import { useCategoryBranch } from '@magento/peregrine/lib/talons/CategoryTree';

const Branch = props => {
    const { name, children, isRoot, onNavigate } = props;
    const classes = useStyle(defaultClasses, props.classes);

    const { clickHandler, isOpen, setIsOpen } = useCategoryBranch();

    const isRootBranch = !!isRoot;

    const branchClasses =
        isRoot && isOpen
            ? classes.open_root
            : isRootBranch
            ? classes.rootBranch
            : classes.text;

    const content = children.map(item => {
        if (item.children_count !== '0') {
            return (
                <Branch
                    key={item.uid}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    children={item.children}
                    name={item.name}
                />
            );
        }
        if (item.children_count === '0') {
            return (
                <Leaf
                    key={item.uid}
                    url_path={item.url_path}
                    url_suffix={item.url_suffix}
                    name={item.name}
                    onNavigate={onNavigate}
                />
            );
        }
    });

    const showArrows =
        isRootBranch &&
        (isOpen ? <img src={arrowUp} /> : <img src={arrowDown} />);

    return (
        <div>
            <li className={classes.root}>
                <button
                    className={classes.target}
                    data-cy="CategoryTree-Branch-target"
                    type="button"
                    onClick={clickHandler}
                >
                    <span className={branchClasses}>{name}</span>
                </button>
                {showArrows}
            </li>
            {isOpen && content}
        </div>
    );
};

export default Branch;
