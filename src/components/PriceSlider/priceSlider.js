import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import React from 'react';
import defaultClasses from './priceSlider.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';

import { usePriceSlider } from '../../talons/PriceSlider/usePriceSlider';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

const PriceSlider = props => {
    const classes = useStyle(defaultClasses, props.classes);

    const { filterApi, group, onApply } = props;

    const talonProps = usePriceSlider({
        filterApi,
        onApply,
        group
    });

    const {
        changeMinPriceHabdler,
        changeMaxPriceHandler,
        rangeChangeHandler,
        priceAplyHandler,
        price
    } = talonProps;

    return (
        <div className={classes.priceSlider}>
            <div className={classes.priceControll}>
                <div className={classes.priceInput}>
                    <span className={classes.inputSpan}>
                        <input
                            type="number"
                            onChange={changeMinPriceHabdler}
                            value={price[0]}
                        />
                    </span>
                    <span className={classes.inputSpan}>
                        <input
                            type="number"
                            onChange={changeMaxPriceHandler}
                            value={price[1]}
                        />
                    </span>
                </div>
            </div>

            <div className={classes.priceRangeContainer}>
                <Range
                    min={0}
                    max={200}
                    defaultValue={price}
                    value={price}
                    onChange={rangeChangeHandler}
                    onAfterChange={priceAplyHandler}
                    handleStyle={{
                        height: '15px',
                        width: '15px',
                        backgroundColor: '#393D46',
                        marginTop: '-6px',
                        border: '2px solid white'
                    }}
                    railStyle={{
                        backgroundColor: '#E5E8EF',
                        height: '3px'
                    }}
                    trackStyle={[{ backgroundColor: '#393D46', height: '3px' }]}
                />
            </div>
        </div>
    );
};
export default PriceSlider;
