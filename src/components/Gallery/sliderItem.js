import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Info } from 'react-feather';
import { string, number, shape } from 'prop-types';
import { Link } from 'react-router-dom';
import Price from '@magento/venia-ui/lib/components/Price';
import { UNCONSTRAINED_SIZE_KEY } from '@magento/peregrine/lib/talons/Image/useImage';
import { useGalleryItem } from '../../talons/Gallery/useGalleryItem';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Image from '@magento/venia-ui/lib/components/Image';
import GalleryItemShimmer from './item.shimmer';
import defaultClasses from './sliderItem.module.css';
import WishlistGalleryButton from '@magento/venia-ui/lib/components/Wishlist/AddToListButton';

import AddToCartbutton from './addToCartButton';
import AddToCompareButton from '../AddToCompareButton/addToCompareButton';
// eslint-disable-next-line no-unused-vars

// The placeholder image is 4:5, so we should make sure to size our product
// images appropriately.
const IMAGE_WIDTH = 310;
const IMAGE_HEIGHT = 380;

// Gallery switches from two columns to three at 640px.
const IMAGE_WIDTHS = new Map()
    .set(640, IMAGE_WIDTH)
    .set(UNCONSTRAINED_SIZE_KEY, 840);

const GalleryItem = props => {
    const {
        handleLinkClick,
        item,
        wishlistButtonProps,
        isSupportedProductType,
        compareButtonProps
    } = useGalleryItem(props);
    const { storeConfig, items } = props;

    const [isFocused, setIsFocused] = useState(false);

    const getFocus = () => {
        setIsFocused(true);
    };
    const lostFocus = () => {
        setIsFocused(false);
    };

    const productUrlSuffix = storeConfig && storeConfig.product_url_suffix;

    const classes = useStyle(defaultClasses, props.classes);

    if (!item) {
        return <GalleryItemShimmer classes={classes} />;
    }

    // eslint-disable-next-line no-unused-vars
    const { name, price_range, small_image, url_key, rating_summary } = item;

    const { url: smallImageURL } = small_image;
    const productLink = resourceUrl(`/${url_key}${productUrlSuffix || ''}`);

    const wishlistButton = wishlistButtonProps ? (
        <WishlistGalleryButton {...wishlistButtonProps} />
    ) : null;

    const compareButton = <AddToCompareButton {...compareButtonProps} />;
    const addButton = isSupportedProductType ? (
        <AddToCartbutton
            item={item}
            items={items}
            urlSuffix={productUrlSuffix}
            sliderItem={true}
        />
    ) : (
        <div className={classes.unavailableContainer}>
            <Info />
            <p>
                <FormattedMessage
                    id={'galleryItem.unavailableProduct'}
                    defaultMessage={'Currently unavailable for purchase.'}
                />
            </p>
        </div>
    );

    // fallback to regular price when final price is unavailable
    const priceSource =
        price_range.maximum_price.final_price ||
        price_range.maximum_price.regular_price;

    // Hide the Rating component until it is updated with the new look and feel (PWA-2512).
    const ratingAverage = null;
    // const ratingAverage = rating_summary ? (
    //     <Rating rating={rating_summary} />
    // ) : null;

    return (
        <>
            <div
                data-cy="GalleryItem-root"
                className={classes.root}
                aria-live="polite"
                aria-busy="false"
                onMouseEnter={getFocus}
                onMouseLeave={lostFocus}
            >
                <div className={classes.imageWrap}>
                    <Link
                        onClick={handleLinkClick}
                        to={productLink}
                        className={classes.images}
                    >
                        <Image
                            alt={name}
                            classes={{
                                image: classes.image,
                                loaded: classes.imageLoaded,
                                notLoaded: classes.imageNotLoaded,
                                root: classes.imageContainer
                            }}
                            height={IMAGE_HEIGHT}
                            resource={smallImageURL}
                            widths={IMAGE_WIDTHS}
                        />
                        {ratingAverage}
                    </Link>
                    {price_range.maximum_price?.discount?.percent_off > 0 && (
                        <div className={classes.discount}>
                            -
                            {Math.round(
                                price_range.maximum_price?.discount?.percent_off
                            )}
                            % off
                        </div>
                    )}
                    {isFocused && (
                        <>
                            <div className={classes.wishListWrap}>
                                {wishlistButton}
                            </div>
                            <div className={classes.compareButtonWrap}>
                                {compareButton}
                            </div>
                        </>
                    )}
                </div>

                <Link
                    onClick={handleLinkClick}
                    to={productLink}
                    className={classes.name}
                    data-cy="GalleryItem-name"
                >
                    <span>{name}</span>
                </Link>

                {isFocused ? (
                    addButton
                ) : (
                    <>
                        <div
                            data-cy="GalleryItem-price"
                            className={classes.price}
                        >
                            <Price
                                value={priceSource.value}
                                currencyCode={priceSource.currency}
                            />
                            {price_range.maximum_price?.discount?.percent_off >
                                0 && (
                                <div className={classes.regularPrice}>
                                    $
                                    {
                                        price_range.maximum_price.regular_price
                                            .value
                                    }
                                    .00
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

GalleryItem.propTypes = {
    classes: shape({
        image: string,
        imageLoaded: string,
        imageNotLoaded: string,
        imageContainer: string,
        images: string,
        name: string,
        price: string,
        root: string
    }),
    item: shape({
        id: number.isRequired,
        uid: string.isRequired,
        name: string.isRequired,
        small_image: shape({
            url: string.isRequired
        }),
        stock_status: string.isRequired,
        __typename: string.isRequired,
        url_key: string.isRequired,
        sku: string.isRequired,
        price_range: shape({
            maximum_price: shape({
                final_price: shape({
                    value: number.isRequired,
                    currency: string.isRequired
                }),
                regular_price: shape({
                    value: number.isRequired,
                    currency: string.isRequired
                }).isRequired
            }).isRequired
        }).isRequired
    }),
    storeConfig: shape({
        magento_wishlist_general_is_enabled: string.isRequired,
        product_url_suffix: string
    })
};

export default GalleryItem;
