import React from 'react';
import { FormattedMessage } from 'react-intl';

import ProductOptions from '@magento/venia-ui/lib/components/LegacyMiniCart/productOptions';
import Image from '@magento/venia-ui/lib/components/Image';
import { useStyle } from '@magento/venia-ui/lib/classify';
import configuredVariant from '@magento/peregrine/lib/util/configuredVariant';

import defaultClasses from './item.module.css';

const Item = props => {
    const {
        classes: propClasses,
        product,
        quantity,
        configurable_options,
        isHidden,
        configurableThumbnailSource
    } = props;

    const classes = useStyle(defaultClasses, propClasses);
    const className = isHidden ? classes.root_hidden : classes.root_visible;
    const configured_variant = configuredVariant(configurable_options, product);
    return (
        <div className={className}>
            <Image
                alt={product.name}
                classes={{ root: classes.thumbnail }}
                width={85}
                resource={
                    configurableThumbnailSource === 'itself' &&
                    configured_variant
                        ? configured_variant.thumbnail.url
                        : product.thumbnail.url
                }
            />
            <div className={classes.productInfo}>
                <span className={classes.name}>{product.name}</span>
                <ProductOptions
                    options={configurable_options}
                    classes={{
                        options: classes.options
                    }}
                />
                <span className={classes.quantity}>
                    <FormattedMessage
                        id={'checkoutPage.quantity'}
                        defaultMessage={'Qty : {quantity}'}
                        values={{ quantity }}
                    />
                </span>
            </div>

            {product?.price_range?.maximum_price && (
                <div className={classes.price}>
                    <p className={classes.finalPrice}>
                        $
                        {product.price_range.maximum_price.final_price.value *
                            quantity}
                        .00
                    </p>
                    {product.price_range.maximum_price.discount.percent_off >
                        0 && (
                        <p className={classes.initialPrice}>
                            $
                            {product.price_range.maximum_price.regular_price
                                .value * quantity}
                            .00
                        </p>
                    )}
                    {product.price_range.maximum_price.discount.percent_off >
                        0 && (
                        <p className={classes.discountPercentage}>
                            -
                            {Math.round(
                                product.price_range.maximum_price.discount
                                    .percent_off
                            )}
                            %
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Item;
