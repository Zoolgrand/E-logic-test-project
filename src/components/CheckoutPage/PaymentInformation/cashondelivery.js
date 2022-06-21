import React from 'react';
import { useCashondelivery } from '../../../talons/CheckoutPage/PaymentInformation/useCashondelivery';

const cashondelivery = props => {
    const {
        handlePlaceOrder,
        shippingAddressOnCart,
        setBillingAddress,
        isSelected
    } = props;

    useCashondelivery({
        handlePlaceOrder,
        shippingAddressOnCart,
        setBillingAddress,
        isSelected
    });

    return <div />;
};
export default cashondelivery;
