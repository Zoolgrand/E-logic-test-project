import React from 'react';
import { FormattedMessage } from 'react-intl';
import PriceSummary from '@magento/venia-ui/lib/components/CartPage/PriceSummary';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './orderSummary.module.css';

const OrderSummary = props => {
    const classes = useStyle(defaultClasses, props.classes);
    return (
        <div data-cy="OrderSummary-root" className={classes.root}>
            <h1 className={classes.title}>
                <FormattedMessage
                    id={'checkoutPage.orderSummary'}
                    defaultMessage={'Order Summary'}
                />
            </h1>
            <PriceSummary
                classes={{
                    totalLabel: classes.totalLabel,
                    totalPrice: classes.totalLabel,
                    lineItemLabel: classes.lineItemLabel,
                    lineItems: classes.lineItems
                }}
                isUpdating={props.isUpdating}
            />
        </div>
    );
};

export default OrderSummary;
