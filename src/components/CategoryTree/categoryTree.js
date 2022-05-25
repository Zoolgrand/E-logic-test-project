import React from 'react';
import { useCategoryTree } from '@magento/peregrine/lib/talons/CategoryTree';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Branch from './categoryBranch';
import Leaf from './categoryLeaf';
import defaultClasses from './categoryTree.module.css';

const Tree = props => {
    const { categoryId, updateCategories, onNavigate } = props;

    const talonProps = useCategoryTree({
        categoryId,
        updateCategories
    });

    const { data, menuItems} = talonProps;
    const classes = useStyle(defaultClasses, props.classes);
console.log(menuItems)
    const content = data
        ? menuItems.map(item => {
              if (item.include_in_menu === 0) {
                  return null;
              }
              if (item.children_count !== '0') {
                  return (
                      <Branch
                          key={item.uid}
                          children={item.children}
                          name={item.name}
                          isRoot= {true}
                          onNavigate={onNavigate}
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
                          isRoot= {true}
                      />
                  );
              }
          })
        : null;

    return (
        <div className={classes.root} data-cy="CategoryTree-root">
            {content}
        </div>
    );
};

export default Tree;

