import React from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './sizeFilter.module.css';
import SizeFilterOption from './sizeFilterOption';

const SizeFilter = props => {
    const { filterApi, filterState, group, onApply, items } = props;
    const classes = useStyle(defaultClasses, props.classes);
    console.log(props);

    const syzeFilterOttions = items
        ? items.map(item => (
              <SizeFilterOption
                  filterApi={filterApi}
                  filterState={filterState}
                  group={group}
                  onApply={onApply}
                  item={item}
              />
          ))
        : null;

    return <div className={classes.sizeFilter}>{syzeFilterOttions}</div>;
};
export default SizeFilter;
