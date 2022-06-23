import React from 'react';
import { bool, func, number, oneOfType, shape, string } from 'prop-types';

const Tile = props => {
    const {
        item: { label, value_index }
    } = props;

    return <option value={value_index}>{label}</option>;
};

export default Tile;

Tile.propTypes = {
    hasFocus: bool,
    isSelected: bool,
    item: shape({
        label: string.isRequired,
        value_index: oneOfType([number, string]).isRequired
    }).isRequired,
    onClick: func.isRequired
};

Tile.defaultProps = {
    hasFocus: false,
    isSelected: false
};
