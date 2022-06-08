import React, { useCallback, useMemo } from 'react';
import { string, number, shape, func, arrayOf, oneOf } from 'prop-types';
import { Link } from 'react-router-dom';
import { gql } from '@apollo/client';

import Price from '@magento/venia-ui/lib/components/Price';
import { useItem } from '@magento/peregrine/lib/talons/MiniCart/useItem';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

import { useMutation } from '@apollo/client';
import { CartPageFragment } from '@magento/peregrine/lib/talons/CartPage/cartPageFragments.gql.js';
import { AvailableShippingMethodsCartFragment } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/ShippingMethods/shippingMethodsFragments.gql.js';

import Image from '@magento/venia-ui/lib/components/Image';
import { useStyle } from '@magento/venia-ui/lib/classify';
import configuredVariant from '@magento/peregrine/lib/util/configuredVariant';
import deleteIcon from '../../../assets/deleteIcon.svg';
import editIcon from '../../../assets/editIcon.svg';

import Quantity from '@magento/venia-ui/lib/components/CartPage/ProductListing/quantity';

import defaultClasses from './item.module.css';

const UPDATE_QUANTITY_MUTATION = gql`
    mutation updateItemQuantity(
        $cartId: String!
        $itemId: ID!
        $quantity: Float!
    ) {
        updateCartItems(
            input: {
                cart_id: $cartId
                cart_items: [{ cart_item_uid: $itemId, quantity: $quantity }]
            }
        ) {
            cart {
                id
                ...CartPageFragment
                ...AvailableShippingMethodsCartFragment
            }
        }
    }
    ${CartPageFragment}
    ${AvailableShippingMethodsCartFragment}
`;

const Item = props => {
    const {
        classes: propClasses,
        product,
        uid,
        quantity,
        configurable_options,
        handleRemoveItem,
        prices,
        closeMiniCart,
        configurableThumbnailSource,
        storeUrlSuffix,
        handleEditCart
    } = props;

    const classes = useStyle(defaultClasses, propClasses);
    const itemLink = useMemo(
        () => resourceUrl(`/${product.url_key}${storeUrlSuffix || ''}`),
        [product.url_key, storeUrlSuffix]
    );

    const { isDeleting, removeItem } = useItem({
        uid,
        handleRemoveItem
    });

    const rootClass = isDeleting ? classes.root_disabled : classes.root;
    const configured_variant = configuredVariant(configurable_options, product);

    const [{ cartId }] = useCartContext();

    const [updateItemQuantity] = useMutation(UPDATE_QUANTITY_MUTATION);

    const handleUpdateItemQuantity = useCallback(
        async quantity => {
            await updateItemQuantity({
                variables: {
                    cartId,
                    itemId: uid,
                    quantity
                }
            });
        },
        [cartId, uid, updateItemQuantity]
    );

    return (
        <div className={rootClass} data-cy="MiniCart-Item-root">
            <div className={classes.imageblock}>
                <Link
                    className={classes.thumbnailContainer}
                    to={itemLink}
                    onClick={closeMiniCart}
                    data-cy="item-thumbnailContainer"
                >
                    <Image
                        alt={product.name}
                        classes={{
                            root: classes.thumbnail
                        }}
                        width={85}
                        resource={
                            configurableThumbnailSource === 'itself' &&
                            configured_variant
                                ? configured_variant.thumbnail.url
                                : product.thumbnail.url
                        }
                        data-cy="Item-image"
                    />
                </Link>
            </div>

            <div className={classes.itemContent}>
                <div className={classes.productInfo}>
                    <Link
                        className={classes.name}
                        to={itemLink}
                        onClick={closeMiniCart}
                        data-cy="item-name"
                    >
                        {product.name}
                    </Link>
                    <span
                        data-cy="MiniCart-Item-price"
                        className={classes.price}
                    >
                        <Price
                            currencyCode={prices.price.currency}
                            value={prices.price.value * quantity}
                        />
                    </span>
                </div>

                <div className={classes.actionContent}>
                    <div>
                        <Quantity
                            itemId={uid}
                            initialValue={quantity}
                            onChange={handleUpdateItemQuantity}
                        />
                    </div>
                    <div className={classes.buttons}>
                        <button
                            onClick={handleEditCart}
                            type="button"
                            className={classes.deleteButton}
                            disabled={isDeleting}
                            data-cy="MiniCart-Item-deleteButton"
                        >
                            <img src={editIcon} />
                        </button>
                        <button
                            onClick={removeItem}
                            type="button"
                            className={classes.deleteButton}
                            disabled={isDeleting}
                            data-cy="MiniCart-Item-deleteButton"
                        >
                            <img src={deleteIcon} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Item;

Item.propTypes = {
    classes: shape({
        root: string,
        thumbnail: string,
        name: string,
        options: string,
        quantity: string,
        price: string,
        editButton: string,
        editIcon: string
    }),
    product: shape({
        name: string,
        thumbnail: shape({
            url: string
        })
    }),
    id: string,
    quantity: number,
    configurable_options: arrayOf(
        shape({
            id: number,
            option_label: string,
            value_id: number,
            value_label: string
        })
    ),
    handleRemoveItem: func,
    prices: shape({
        price: shape({
            value: number,
            currency: string
        })
    }),
    configured_variant: shape({
        thumbnail: shape({
            url: string
        })
    }),
    configurableThumbnailSource: oneOf(['parent', 'itself'])
};
