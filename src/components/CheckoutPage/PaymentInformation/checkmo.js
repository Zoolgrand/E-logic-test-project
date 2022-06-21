import React from 'react';
import { useCheckmo } from '../../../talons/CheckoutPage/PaymentInformation/useCheckmo';

const checkmo = props => {
    const {
        handlePlaceOrder,
        shippingAddressOnCart,
        setBillingAddress,
        isSelected
    } = props;

    useCheckmo({
        handlePlaceOrder,
        shippingAddressOnCart,
        setBillingAddress,
        isSelected
    });

    return <div />;
};
export default checkmo;
