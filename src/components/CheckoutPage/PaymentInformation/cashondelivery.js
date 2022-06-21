import React, { useEffect } from 'react';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { SET_CASHONDELIVERY_PAYMENT_METHOD_ON_CART } from '../../../custom_queries/paymentInformation.gql';
import { useMutation } from '@apollo/client';

const cashondelivery = props => {
    const [{ cartId }] = useCartContext();

    const {
        handlePlaceOrder,
        shippingAddressOnCart,
        setBillingAddress,
        isSelected
    } = props;
    const {
        firstname,
        lastname,
        street,
        city,
        region,
        postcode,
        country,
        telephone
    } = shippingAddressOnCart;
    const regionCode = region.code;
    const countryCode = country.code;

    const [setCashondeliveryPaymentMethod] = useMutation(
        SET_CASHONDELIVERY_PAYMENT_METHOD_ON_CART,
        { onCompleted: () => {} }
    );

    useEffect(() => {
        setBillingAddress({
            variables: {
                cartId,
                firstname,
                lastname,
                street,
                city,
                regionCode,
                postcode,
                countryCode,
                telephone
            }
        });

        setCashondeliveryPaymentMethod({
            variables: {
                cartId
            }
        });
    }, [
        isSelected,
        shippingAddressOnCart,
        setBillingAddress,
        handlePlaceOrder,
        setCashondeliveryPaymentMethod
    ]);

    return <div />;
};
export default cashondelivery;
