import React, { useState } from 'react';

export const usePriceSlider = (props = {}) => {
    const { filterApi, onApply, group } = props;

    const { addItem } = filterApi;
    const [price, setPrice] = useState([15, 120]);

    const itemPriceRange = {
        title: `${price[0]}-${price[1]}`,
        value: `${price[0]}_${price[1]}`
    };

    const changeMinPriceHabdler = e => {
        if (e.target.value < 0) {
            return;
        }
        setPrice(prevState => [e.target.value, prevState[1]]);
    };

    const changeMaxPriceHandler = e => {
        setPrice(prevState => [prevState[0], e.target.value]);
    };

    const rangeChangeHandler = price => {
        setPrice(price);
    };

    const priceResetHandler = () => {
        setPrice([15, 120]);
    };

    const priceAplyHandler = () => {
        addItem({
            group,
            item: itemPriceRange
        });
        if (typeof onApply === 'function') {
            onApply(group, itemPriceRange);
        }
    };

    return {
        changeMinPriceHabdler,
        changeMaxPriceHandler,
        rangeChangeHandler,
        priceAplyHandler,
        priceResetHandler,
        price
    };
};