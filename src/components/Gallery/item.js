import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Info } from 'react-feather';
import { string, number, shape } from 'prop-types';
import { Link } from 'react-router-dom';
import Price from '@magento/venia-ui/lib/components/Price';
import { UNCONSTRAINED_SIZE_KEY } from '@magento/peregrine/lib/talons/Image/useImage';
import { useGalleryItem } from '../../talons/Gallery/useGalleryItem';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { useWindowSize } from '@magento/peregrine';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Image from '@magento/venia-ui/lib/components/Image';
import GalleryItemShimmer from './item.shimmer';
import defaultClasses from './item.module.css';
import WishlistGalleryButton from '@magento/venia-ui/lib/components/Wishlist/AddToListButton';
import AddToCartModal from '../AddToCartModal';

import AddToCartbutton from './addToCartButton';
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
        isSupportedProductType
    } = useGalleryItem(props);

    const { storeConfig, items } = props;

    const [isFocused, setIsFocused] = useState(false);

    const [isShowModal, setIsShowModal] = useState(false);

    const windowSize = useWindowSize();
    const isDesktop = windowSize.innerWidth >= 769;

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

    const compareButton = (
        <svg
            width="20"
            height="17"
            viewBox="0 0 20 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M16.556 1.34786H15.7391H14.9222H10.4782V-0.565186H9.52171V1.34786H5.07771H4.26084H3.44397L0.462014 8.79729L0.434753 8.87477V8.95655V9.43481C0.434753 11.0518 1.97236 12.7826 4.26084 12.7826C6.54932 12.7826 8.08693 11.0518 8.08693 9.43481V8.95655V8.87477L5.41536 2.30438H9.52171V15.6957H5.43975L4.26084 16.6522H15.7391L14.5602 15.6957H10.4782V2.30438H14.5846L11.9403 8.79729L11.913 8.87477V8.95655V9.43481C11.913 11.0518 13.4506 12.7826 15.7391 12.7826C18.0276 12.7826 19.5652 11.0518 19.5652 9.43481V8.95655V8.87477L16.556 1.34786ZM4.26084 11.8261C2.80645 11.8261 1.73084 10.894 1.45871 9.91307H7.06345C6.79084 10.894 5.71523 11.8261 4.26084 11.8261ZM7.10171 8.95655H1.41997L4.12071 2.30438H4.26084H4.40097L7.10171 8.95655ZM15.7391 11.8261C14.2847 11.8261 13.2091 10.894 12.937 9.91307H18.5417C18.2691 10.894 17.1935 11.8261 15.7391 11.8261ZM12.8982 8.95655L15.599 2.30438H15.7391H15.8792L18.58 8.95655H12.8982Z"
                fill="#4C4F57"
                stroke="#4C4F57"
                strokeWidth="0.6"
            />
        </svg>
    );

    const addButton = isSupportedProductType ? (
        <AddToCartbutton
            item={item}
            setIsShowModal={setIsShowModal}
            urlSuffix={productUrlSuffix}
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
                    {isDesktop ? (
                        isFocused && (
                            <div className={classes.wishListWrap}>
                                {wishlistButton}
                            </div>
                        )
                    ) : (
                        <div className={classes.wishListWrap}>
                            {wishlistButton}
                        </div>
                    )}
                    {isDesktop && isFocused && (
                        <div className={classes.compareButtonWrap}>
                            {compareButton}
                        </div>
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

                {isDesktop ? (
                    isFocused ? (
                        <div className={classes.actionsContainer}>
                            {' '}
                            {addButton}
                        </div>
                    ) : (
                        <div
                            data-cy="GalleryItem-price"
                            className={classes.price}
                        >
                            <Price
                                value={priceSource.value}
                                currencyCode={priceSource.currency}
                            />
                        </div>
                    )
                ) : (
                    <div>
                        <div
                            data-cy="GalleryItem-price"
                            className={classes.price}
                        >
                            <Price
                                value={priceSource.value}
                                currencyCode={priceSource.currency}
                            />
                        </div>
                        <div className={classes.btnBlock}>
                            {addButton}
                            <div className={classes.compareButtonWrap}>
                                {compareButton}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {isShowModal && (
                <AddToCartModal
                    setIsShowModal={setIsShowModal}
                    item={item}
                    items={items}
                />
            )}
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
