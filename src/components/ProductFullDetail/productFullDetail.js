import React, { useMemo, Fragment, Suspense, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { arrayOf, bool, number, shape, string } from 'prop-types';
import { Form } from 'informed';
import { Info } from 'react-feather';
import { useQuery, gql } from '@apollo/client';

import Price from '@magento/venia-ui/lib/components/Price';
import { useProductFullDetail } from '../../talons/ProductFullDetail/useProductFullDetail';
import { isProductConfigurable } from '@magento/peregrine/lib/util/isProductConfigurable';
import { useWindowSize } from '@magento/peregrine';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Breadcrumbs from '../Breadcrumbs';
import Button from '../Button';
import FormError from '@magento/venia-ui/lib/components/FormError';
import QuantityStepper from '../QuantityStepper';
import RichContent from '@magento/venia-ui/lib/components/RichContent/richContent';
import { ProductOptionsShimmer } from '@magento/venia-ui/lib/components/ProductOptions';
import CarouselCustom from '../../contentTypes/Products/Carousel';
import CustomAttributes from './CustomAttributes';
import defaultClasses from './productFullDetail.module.css';
// import bannerImage from '../../assets/Banner.png';
import Image from '@magento/venia-ui/lib/components/Image';
// import { useHistory } from 'react-router-dom';
import stockStatusIcon from '../../assets/stockStatus.svg';
import starActiveIcon from '../../assets/starActive.svg';
import starDisabledIcon from '../../assets/starDisabled.svg';
import plusIcon from '../../assets/plusIcon.svg';
import minusIcon from '../../assets/minusIcon.svg';

import AddToCompareButton from '../AddToCompareButton/addToCompareButton';

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

const GET_CONTACT_PAGE_CMS_BLOCKS = gql`
    query GetContactPageCmsBlocks($cmsBlockIdentifiers: [String]) {
        cmsBlocks(identifiers: $cmsBlockIdentifiers) {
            items {
                content
                identifier
            }
        }
    }
`;

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
        setActiveTab,
        rating,
        setRating
    } = talonProps;

    const windowSize = useWindowSize();
    const isMobile = windowSize.innerWidth <= 768;

    const starsBlockItems = [
        { value: 1 },
        { value: 2 },
        { value: 3 },
        { value: 4 },
        { value: 5 }
    ];

    const ratingBlock = starsBlockItems.map(item => (
        <button
            key={item.value}
            type="button"
            onClick={() => {
                setRating(item.value);
            }}
        >
            <img
                src={item.value <= rating ? starActiveIcon : starDisabledIcon}
            />
        </button>
    ));

    const { formatMessage } = useIntl();
    // const history = useHistory();

    // const bannerBtnClickHandler = () => {
    //     history.push('/shop-the-look');
    // };

    const compareButtonProps = {
        buttonText: '',
        item: {
            id: product.id,
            name: product.name
        }
    };

    const cmsBlockIdentifiers = ['productBanner'];

    const { data: cmsBlocksData } = useQuery(GET_CONTACT_PAGE_CMS_BLOCKS, {
        variables: {
            cmsBlockIdentifiers
        },
        fetchPolicy: 'cache-and-network'
    });

    const classes = useStyle(defaultClasses, props.classes);

    const shouldShowDiscount =
        product.price_range.maximum_price.discount.percent_off > 0;

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

    const stockStatus = !isOutOfStock ? (
        <div className={classes.stockStatus}>
            <img src={stockStatusIcon} />
            In stock
        </div>
    ) : (
        <div className={classes.stockStatus}>Out of stock</div>
    );

    const reviews = (
        <div className={classes.review}>
            <div className={classes.ratingBlock}>{ratingBlock}</div>
            <p>{product.review_count} Reviews</p>
            {!isMobile && <div className={classes.verticalDivider} />}
        </div>
    );

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
            classes={
                !isAddToCartDisabled
                    ? { root_highPriority: classes.addToCartButton }
                    : { root_highPriority: classes.addToCartButton_disabled }
            }
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
                    type={'Slider item'}
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
                    type={'Slider item'}
                />
            </div>
        ) : null;

    // const productBanner = (
    //     <div className={classes.productBanner}>
    //         <div className={classes.bannerInfo}>
    //             <p className={classes.bannerDiscount}>-30% OFF</p>
    //             <p className={classes.bannerTitle}>Big Weekly Sale</p>
    //             <p className={classes.bannerDescription}>
    //                 Start sale 06/12/2021
    //             </p>
    //             <Button
    //                 data-cy="ProductFullDetail-addToCartButton"
    //                 priority="high"
    //                 type="button"
    //                 onClick={bannerBtnClickHandler}
    //                 classes={{ root_highPriority: classes.bannerBtn }}
    //             >
    //                 Show More
    //             </Button>
    //         </div>
    //         <img src={bannerImage} />
    //     </div>
    // );

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
        <div className={classes.tabContent}>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
                cursus nisl sit amet mi accumsan placerat. Phasellus in augue
                pellentesque, porta ipsum nec, molestie augue. Ut gravida
                vulputate venenatis. Donec maximus pellentesque condimentum.
                Morbi eu nunc eget ante rutrum egestas. Sed posuere dui dictum
                nulla facilisis maximus. Donec vitae ipsum at tellus fermentum
                vehicula ut eget risus. Duis sed mauris arcu. Phasellus at mi ac
                arcu placerat tempus. Nunc suscipit ultricies risus, ac pretium
                ex tincidunt vel. Aenean vulputate felis non elit egestas
                vehicula. Ut sed nisi vel nisl porttitor porta.
            </p>
        </div>
    );

    const attachmentsContent = (
        <div className={classes.tabContent}>
            <p>
                Curabitur risus est, varius id sollicitudin ut, scelerisque ac
                erat. Donec tempus imperdiet sagittis. Nulla dolor neque,
                tincidunt non erat in, mattis varius nisi. Donec vestibulum,
                tellus vitae cursus feugiat, dolor sapien scelerisque arcu,
                vitae efficitur nibh lorem a lectus. Donec facilisis id neque
                vitae gravida. Vestibulum vitae turpis metus. Morbi imperdiet
                eleifend semper. Proin bibendum pharetra leo, vitae mollis erat
                laoreet rhoncus. Phasellus aliquet pharetra tortor vel congue.
                Duis rutrum neque eget magna pharetra auctor. Duis mattis tortor
                at rhoncus porta. Pellentesque ultrices bibendum ligula in
                viverra. Nam finibus aliquet blandit.
            </p>
        </div>
    );

    const [activeMobileTabs, setActiveMobileTabs] = useState({
        description: false,
        tech: false,
        attributes: false,
        attachments: false
    });
    const tabsObj = [
        {
            name: 'description',
            text: 'Long description',
            isOpen: activeMobileTabs.description,
            content: descriptionContent
        },
        {
            name: 'tech',
            text: 'Technical info',
            isOpen: activeMobileTabs.tech,
            content: techContent
        },
        {
            name: 'attributes',
            text: 'Attributes',
            isOpen: activeMobileTabs.attributes,
            content: attributesContent
        },
        {
            name: 'attachments',
            text: 'Attachments',
            isOpen: activeMobileTabs.attachments,
            content: attachmentsContent
        }
    ];

    const tabs = (
        <>
            <div className={classes.tabs}>
                {tabsObj.map(item => (
                    <p
                        key={item.name}
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
            <div className={classes.border} />
        </>
    );

    const mobileTabs = (
        <>
            <div className={classes.mobileTabs}>
                {tabsObj.map(item => (
                    <div key={item.name}>
                        <div
                            className={classes.mobileTab}
                            onClick={() => {
                                setActiveMobileTabs(prev => ({
                                    ...prev,
                                    [item.name]: !item.isOpen
                                }));
                            }}
                        >
                            {item.text}
                            <img src={item.isOpen ? minusIcon : plusIcon} />
                        </div>
                        {item.isOpen && <div>{item.content}</div>}
                    </div>
                ))}
            </div>
        </>
    );

    const activeTabContent = {
        description: descriptionContent,
        tech: techContent,
        attributes: attributesContent,
        attachments: attachmentsContent
    };

    const images = mediaGalleryEntries.map(item => (
        <Image
            key={item.uid}
            resource={item.file}
            alt={product.name}
            width={390}
        />
    ));

    const mobileImages = product ? (
        <CarouselCustom items={product.media_gallery} type={'Product Image'} />
    ) : null;

    return (
        <Fragment>
            {!isMobile && breadcrumbs}
            <div className={classes.productConfig}>
                <Form
                    className={classes.root}
                    data-cy="ProductFullDetail-root"
                    onSubmit={handleAddToCart}
                >
                    <section className={classes.imageCarousel}>
                        {isMobile ? mobileImages : images}
                    </section>

                    <div className={classes.productTopSection}>
                        <section className={classes.title}>
                            {!isMobile && (
                                <>
                                    <h1
                                        className={classes.productName}
                                        data-cy="ProductFullDetail-productName"
                                    >
                                        {productDetails.name}
                                    </h1>
                                    <div className={classes.statusBlock}>
                                        {reviews}
                                        {stockStatus}
                                    </div>
                                </>
                            )}

                            {isMobile && (
                                <>
                                    <div className={classes.statusBlock}>
                                        {reviews}
                                        {stockStatus}
                                    </div>
                                    <h1
                                        className={classes.productName}
                                        data-cy="ProductFullDetail-productName"
                                    >
                                        {productDetails.name}
                                    </h1>
                                </>
                            )}

                            <div className={classes.price}>
                                <p
                                    data-cy="ProductFullDetail-productPrice"
                                    className={classes.productPrice}
                                >
                                    <Price
                                        currencyCode={
                                            productDetails.price.currency
                                        }
                                        value={productDetails.price.value}
                                    />
                                </p>
                                {shouldShowDiscount && (
                                    <div className={classes.regularPrise}>
                                        $
                                        {
                                            product.price_range.maximum_price
                                                .regular_price.value
                                        }
                                        .00
                                    </div>
                                )}
                                {shouldShowDiscount && (
                                    <div className={classes.discount}>
                                        -
                                        {Math.round(
                                            product.price_range.maximum_price
                                                .discount.percent_off
                                        )}
                                        %
                                    </div>
                                )}
                            </div>
                            {isMobile && (
                                <div className={classes.sku}>
                                    Sku: {product.sku}
                                </div>
                            )}

                            <div className={classes.shortDescription}>
                                {shortDescription}
                            </div>
                        </section>
                        <FormError
                            classes={{
                                root: classes.formErrors
                            }}
                            errors={errors.get('form') || []}
                        />
                        <section className={classes.options}>{options}</section>

                        <section className={classes.actions}>
                            <div className={classes.topActionCOntainer}>
                                <QuantityStepper
                                    classes={{ root: classes.quantityRoot }}
                                    min={1}
                                    message={errors.get('quantity')}
                                />
                                <div className={classes.triggerBtns}>
                                    <div className={classes.compareWrap}>
                                        <AddToCompareButton
                                            {...compareButtonProps}
                                            classes={{
                                                compareButtonWrap:
                                                    classes.compareBtn
                                            }}
                                        />
                                    </div>

                                    <Suspense fallback={null}>
                                        <WishlistButton
                                            {...wishlistButtonProps}
                                        />
                                    </Suspense>
                                </div>
                            </div>

                            {cartActionContent}
                        </section>

                        {pageBuilderAttributes}
                    </div>
                </Form>
            </div>
            {!isMobile ? (
                <>
                    {tabs}
                    {activeTabContent[activeTab]}
                </>
            ) : (
                <>{mobileTabs}</>
            )}
            {/* {productBanner} */}

            {cmsBlocksData && (
                <div className={classes.banner}>
                    <RichContent
                        html={cmsBlocksData.cmsBlocks.items[0].content}
                    />
                </div>
            )}
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
