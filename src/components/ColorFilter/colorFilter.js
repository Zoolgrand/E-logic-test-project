import React from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './colorFilter.module.css';
import ColorOption from './colorOption';

const ColorFilter = props => {
    const { filterApi, group, items, onApply, filterState } = props;
    const classes = useStyle(defaultClasses, props.classes);

    const colorFilterOptions = items
        ? items.map(item => (
              <ColorOption
                  key={item.title}
                  color={item.title}
                  filterApi={filterApi}
                  filterState={filterState}
                  group={group}
                  onApply={onApply}
                  item={item}
              />
          ))
        : null;

    return <div className={classes.colorFilters}>{colorFilterOptions}</div>;
};
export default ColorFilter;
