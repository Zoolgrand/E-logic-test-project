import React, { useMemo, Fragment, Suspense } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { arrayOf, bool, number, shape, string } from 'prop-types';
import { Form } from 'informed';
import { Info } from 'react-feather';

import Price from '@magento/venia-ui/lib/components/Price';
import { useProductFullDetail } from '../../talons/ProductFullDetail/useProductFullDetail';
import { isProductConfigurable } from '@magento/peregrine/lib/util/isProductConfigurable';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Breadcrumbs from '../Breadcrumbs';
import Button from '../Button';
import Carousel from '@magento/venia-ui/lib/components/ProductImageCarousel';
import FormError from '@magento/venia-ui/lib/components/FormError';
import QuantityStepper from '../QuantityStepper';
import RichContent from '@magento/venia-ui/lib/components/RichContent/richContent';
import { ProductOptionsShimmer } from '@magento/venia-ui/lib/components/ProductOptions';
import CarouselCustom from '../../contentTypes/Products/Carousel';
import CustomAttributes from './CustomAttributes';
import defaultClasses from './productFullDetail.module.css';
import bannerImage from '../../assets/Banner.png';
import { useHistory } from 'react-router-dom';

const WishlistButton = React.lazy(() =>
    import('@magento/venia-ui/lib/components/Wishlist/AddToListButton')
);
const Options = React.lazy(() => import('../ProductOptions'));

// Correlate a GQL error message to a field. GQL could return a longer error
// string but it may contain contextual info such as product id. We can use
// parts of the string to check for which field to apply the error.
const ERROR_MESSAGE_TO_FIELD_MAPPING = {
    'The requested qty is not available': 'quantity',
    'Product that you are trying to add is not available.': 'quantity',
    "The product that was requested doesn't exist.": 'quantity'
};

// Field level error messages for rendering.
const ERROR_FIELD_TO_MESSAGE_MAPPING = {
    quantity: 'The requested quantity is not available.'
};

const ProductFullDetail = props => {
    const { product } = props;

    const talonProps = useProductFullDetail({ product });

    const {
        breadcrumbCategoryId,
        errorMessage,
        handleAddToCart,
        handleSelectionChange,
        isOutOfStock,
        isAddToCartDisabled,
        isSupportedProductType,
        mediaGalleryEntries,
        productDetails,
        customAttributes,
        wishlistButtonProps,
        activeTab,
        setActiveTab
    } = talonProps;

    const { formatMessage } = useIntl();
    const history = useHistory();

    const bannerBtnClickHandler = () => {
        history.push('/shop-the-look');
    };

    const classes = useStyle(defaultClasses, props.classes);

    const options = isProductConfigurable(product) ? (
        <Suspense fallback={<ProductOptionsShimmer />}>
            <Options
                onSelectionChange={handleSelectionChange}
                options={product.configurable_options}
            />
        </Suspense>
    ) : null;

    const breadcrumbs = breadcrumbCategoryId ? (
        <Breadcrumbs
            categoryId={breadcrumbCategoryId}
            currentProduct={productDetails.name}
        />
    ) : null;

    // Fill a map with field/section -> error.
    const errors = new Map();
    if (errorMessage) {
        Object.keys(ERROR_MESSAGE_TO_FIELD_MAPPING).forEach(key => {
            if (errorMessage.includes(key)) {
                const target = ERROR_MESSAGE_TO_FIELD_MAPPING[key];
                const message = ERROR_FIELD_TO_MESSAGE_MAPPING[target];
                errors.set(target, message);
            }
        });

        // Handle cases where a user token is invalid or expired. Preferably
        // this would be handled elsewhere with an error code and not a string.
        if (errorMessage.includes('The current user cannot')) {
            errors.set('form', [
                new Error(
                    formatMessage({
                        id: 'productFullDetail.errorToken',
                        defaultMessage:
                            'There was a problem with your cart. Please sign in again and try adding the item once more.'
                    })
                )
            ]);
        }

        // Handle cases where a cart wasn't created properly.
        if (
            errorMessage.includes('Variable "$cartId" got invalid value null')
        ) {
            errors.set('form', [
                new Error(
                    formatMessage({
                        id: 'productFullDetail.errorCart',
                        defaultMessage:
                            'There was a problem with your cart. Please refresh the page and try adding the item once more.'
                    })
                )
            ]);
        }

        // An unknown error should still present a readable message.
        if (!errors.size) {
            errors.set('form', [
                new Error(
                    formatMessage({
                        id: 'productFullDetail.errorUnknown',
                        defaultMessage:
                            'Could not add item to cart. Please check required options and try again.'
                    })
                )
            ]);
        }
    }

    const customAttributesDetails = useMemo(() => {
        const list = [];
        const pagebuilder = [];
        const skuAttribute = {
            attribute_metadata: {
                uid: 'attribute_sku',
                used_in_components: ['PRODUCT_DETAILS_PAGE'],
                ui_input: {
                    ui_input_type: 'TEXT'
                },
                label: formatMessage({
                    id: 'global.sku',
                    defaultMessage: 'SKU'
                })
            },
            entered_attribute_value: {
                value: productDetails.sku
            }
        };
        if (Array.isArray(customAttributes)) {
            customAttributes.forEach(customAttribute => {
                if (
                    customAttribute.attribute_metadata.ui_input
                        .ui_input_type === 'PAGEBUILDER'
                ) {
                    pagebuilder.push(customAttribute);
                } else {
                    list.push(customAttribute);
                }
            });
        }
        list.unshift(skuAttribute);
        return {
            list: list,
            pagebuilder: pagebuilder
        };
    }, [customAttributes, productDetails.sku, formatMessage]);

    const cartCallToActionText = !isOutOfStock ? (
        <FormattedMessage
            id="productFullDetail.addItemToCart"
            defaultMessage="Add to Cart"
        />
    ) : (
        <FormattedMessage
            id="productFullDetail.itemOutOfStock"
            defaultMessage="Out of Stock"
        />
    );

    const cartActionContent = isSupportedProductType ? (
        <Button
            data-cy="ProductFullDetail-addToCartButton"
            disabled={isAddToCartDisabled}
            priority="high"
            type="submit"
        >
            {cartCallToActionText}
        </Button>
    ) : (
        <div className={classes.unavailableContainer}>
            <Info />
            <p>
                <FormattedMessage
                    id={'productFullDetail.unavailableProduct'}
                    defaultMessage={
                        'This product is currently unavailable for purchase.'
                    }
                />
            </p>
        </div>
    );

    const shortDescription = productDetails.shortDescription ? (
        <RichContent html={productDetails.shortDescription.html} />
    ) : null;

    const pageBuilderAttributes = customAttributesDetails.pagebuilder.length ? (
        <section className={classes.detailsPageBuilder}>
            <CustomAttributes
                classes={{ list: classes.detailsPageBuilderList }}
                customAttributes={customAttributesDetails.pagebuilder}
                showLabels={false}
            />
        </section>
    ) : null;

    const relatedProductsCarousel =
        product.related_products.length > 0 ? (
            <div className={classes.productsCarousel}>
                <h2 className={classes.sliderTitle}>Related products slider</h2>
                <p className={classes.sliderDecription}>
                    Browse the huge variety of our products
                </p>
                <CarouselCustom
                    items={product.related_products}
                    isSliderItem={true}
                />
            </div>
        ) : null;

    const upsaleProductsCarousel =
        product.upsell_products.length > 0 ? (
            <div className={classes.productsCarousel}>
                <h2 className={classes.sliderTitle}>Upsell products slider</h2>
                <p className={classes.sliderDecription}>
                    Browse the huge variety of our products
                </p>
                <CarouselCustom
                    items={product.upsell_products}
                    isSliderItem={true}
                />
            </div>
        ) : null;

    const productBanner = (
        <div className={classes.productBanner}>
            <div className={classes.bannerInfo}>
                <p className={classes.bannerDiscount}>-30% OFF</p>
                <p className={classes.bannerTitle}>Big Weekly Sale</p>
                <p className={classes.bannerDescription}>
                    Start sale 06/12/2021
                </p>
                <Button
                    data-cy="ProductFullDetail-addToCartButton"
                    priority="high"
                    type="button"
                    onClick={bannerBtnClickHandler}
                    classes={{ root_highPriority: classes.bannerBtn }}
                >
                    Show More
                </Button>
            </div>
            <img src={bannerImage} />
        </div>
    );

    const tabsObj = [
        {
            name: 'description',
            text: 'Long description'
        },
        {
            name: 'tech',
            text: 'Technical info'
        },
        {
            name: 'attributes',
            text: 'Attributes'
        },
        {
            name: 'attachments',
            text: 'Attachments'
        }
    ];

    const tabs = (
        <div className={classes.tabs}>
            {tabsObj.map(item => (
                <p
                    onClick={() => setActiveTab(item.name)}
                    className={
                        activeTab === item.name
                            ? classes.tab_active
                            : classes.tab
                    }
                >
                    {item.text}
                </p>
            ))}
        </div>
    );

    const descriptionContent = (
        <div className={classes.tabContent}>
            <section className={classes.description}>
                <span
                    data-cy="ProductFullDetail-descriptionTitle"
                    className={classes.descriptionTitle}
                >
                    <FormattedMessage
                        id={'productFullDetail.description'}
                        defaultMessage={'Description'}
                    />
                </span>
                <RichContent html={productDetails.description} />
            </section>
        </div>
    );

    const techContent = (
        <div className={classes.tabContent}>
            <section className={classes.details}>
                <span
                    data-cy="ProductFullDetail-detailsTitle"
                    className={classes.detailsTitle}
                >
                    <FormattedMessage
                        id={'productFullDetail.details'}
                        defaultMessage={'Details'}
                    />
                </span>
                <CustomAttributes
                    customAttributes={customAttributesDetails.list}
                />
            </section>
        </div>
    );

    const attributesContent = (
        <div className={classes.tabContent}>attributes</div>
    );

    const attachmentsContent = (
        <div className={classes.tabContent}>attachments</div>
    );

    const activeTabContent = {
        description: descriptionContent,
        tech: techContent,
        attributes: attributesContent,
        attachments: attachmentsContent
    };

    return (
        <Fragment>
            {breadcrumbs}
            <Form
                className={classes.root}
                data-cy="ProductFullDetail-root"
                onSubmit={handleAddToCart}
            >
                <section className={classes.imageCarousel}>
                    <Carousel images={mediaGalleryEntries} />
                </section>
                <section className={classes.title}>
                    <h1
                        className={classes.productName}
                        data-cy="ProductFullDetail-productName"
                    >
                        {productDetails.name}
                    </h1>
                    <p
                        data-cy="ProductFullDetail-productPrice"
                        className={classes.productPrice}
                    >
                        <Price
                            currencyCode={productDetails.price.currency}
                            value={productDetails.price.value}
                        />
                    </p>
                    {shortDescription}
                </section>
                <FormError
                    classes={{
                        root: classes.formErrors
                    }}
                    errors={errors.get('form') || []}
                />
                <section className={classes.options}>{options}</section>
                <section className={classes.quantity}>
                    <span
                        data-cy="ProductFullDetail-quantityTitle"
                        className={classes.quantityTitle}
                    >
                        <FormattedMessage
                            id={'global.quantity'}
                            defaultMessage={'Quantity'}
                        />
                    </span>
                    <QuantityStepper
                        classes={{ root: classes.quantityRoot }}
                        min={1}
                        message={errors.get('quantity')}
                    />
                </section>
                <section className={classes.actions}>
                    {cartActionContent}
                    <Suspense fallback={null}>
                        <WishlistButton {...wishlistButtonProps} />
                    </Suspense>
                </section>
                {pageBuilderAttributes}
            </Form>
            {tabs}
            {activeTabContent[activeTab]}
            {productBanner}
            {relatedProductsCarousel}
            {upsaleProductsCarousel}
        </Fragment>
    );
};

ProductFullDetail.propTypes = {
    classes: shape({
        cartActions: string,
        description: string,
        descriptionTitle: string,
        details: string,
        detailsPageBuilder: string,
        detailsPageBuilderList: string,
        detailsTitle: string,
        imageCarousel: string,
        options: string,
        productName: string,
        productPrice: string,
        quantity: string,
        quantityTitle: string,
        quantityRoot: string,
        root: string,
        title: string,
        unavailableContainer: string
    }),
    product: shape({
        __typename: string,
        id: number,
        stock_status: string,
        sku: string.isRequired,
        price: shape({
            regularPrice: shape({
                amount: shape({
                    currency: string.isRequired,
                    value: number.isRequired
                })
            }).isRequired
        }).isRequired,
        media_gallery_entries: arrayOf(
            shape({
                uid: string,
                label: string,
                position: number,
                disabled: bool,
                file: string.isRequired
            })
        ),
        description: string,
        short_description: shape({
            html: string,
            __typename: string
        })
    }).isRequired
};

export default ProductFullDetail;
