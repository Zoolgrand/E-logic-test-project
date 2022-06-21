import React, { useEffect } from 'react';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { SET_CHECKMO_PAYMENT_METHOD_ON_CART } from '../../../custom_queries/paymentInformation.gql';
import { useMutation } from '@apollo/client';

const checkmo = props => {
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

    const [setCheckmoPaymentMethod] = useMutation(
        SET_CHECKMO_PAYMENT_METHOD_ON_CART,
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

        setCheckmoPaymentMethod({
            variables: {
                cartId
            }
        });
    }, [
        isSelected,
        shippingAddressOnCart,
        setBillingAddress,
        handlePlaceOrder,
        setCheckmoPaymentMethod
    ]);

    return <div />;
};
export default checkmo;
