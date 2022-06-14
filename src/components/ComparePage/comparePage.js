import React, { Fragment } from 'react';
import defaultClasses from './comparePage.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { FormattedMessage } from 'react-intl';
import { useComparePage } from '../../talons/ComparePage/useComparePage';

import { Link } from 'react-router-dom';
import AddToCartButton from '../Gallery/addToCartButton';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { X as CloseIcon } from 'react-feather';
import * as _ from 'lodash';
import RichContent from '@magento/venia-ui/lib/components/RichContent';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { useGallery } from '@magento/peregrine/lib/talons/Gallery/useGallery';
import Price from '@magento/venia-ui/lib/components/Price';

const ComparePage = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { storeConfig } = useGallery();
    const talonProps = useComparePage();
    const {
        compareAttribute,
        shouldRenderVisibilityToggle,
        handleRemoveItem
    } = talonProps;

    const attributes = shouldRenderVisibilityToggle
        ? _.cloneDeep(compareAttribute.attributes)
        : null;

    attributes?.map((attribute, index) => {
        attributes[index]['attributes'] = [];
    });
    const productUrlSuffix = storeConfig && storeConfig.product_url_suffix;

    const product = compareAttribute?.items?.map(item => {
        const productAttributes = item.attributes.map(attribute => {
            attributes?.map((code, index) => {
                if (code.code === attribute.code) {
                    attributes[index].attributes.push(attribute.value);
                }
            });
        });
        const productLink = resourceUrl(
            `/${item.product.url_key}${productUrlSuffix || ''}`
        );
        const imageLink = new URL(item.product.image.url).pathname;
        return (
            <div key={item.product.id} className={classes.productWrapper}>
                <div className={classes.remove}>
                    <button onClick={() => handleRemoveItem(item.product.id)}>
                        <Icon src={CloseIcon} />
                    </button>
                </div>
                <div className={classes.productDetails}>
                    <Link
                        className={classes.image}
                        title={item.product.name}
                        to={productLink}
                    >
                        <img alt={item.product.name} src={imageLink} />
                    </Link>
                    <Link
                        className={classes.name}
                        title={item.product.name}
                        to={productLink}
                    >
                        <span>{item.product.name}</span>
                    </Link>
                    <div className={classes.priceContainer}>
                        {item.product.review_count ? (
                            <div className={classes.reviewLinks}>
                                <Link
                                    className={classes.review}
                                    to={`/${
                                        item.product.url_key
                                    }${productUrlSuffix || ''}#reviews`}
                                >
                                    <FormattedMessage
                                        defaultMessage={'Reviews'}
                                        id={'global.reviews'}
                                    />
                                    {item.product.review_count}
                                </Link>
                            </div>
                        ) : null}
                        <div className={classes.lowPriceWrapper}>
                            <div className={classes.lowPrice}>
                                <FormattedMessage
                                    defaultMessage={'Price'}
                                    id={'global.priceLabel'}
                                />
                            </div>
                            <div className={classes.price}>
                                <Price
                                    currencyCode={
                                        item.product.price_range.maximum_price
                                            .regular_price.currency
                                    }
                                    value={
                                        item.product.price_range.maximum_price
                                            .regular_price.value
                                    }
                                />
                            </div>
                        </div>
                        <div className={classes.excludingTax}>
                            <div className={classes.excludingTaxLabel}>
                                <FormattedMessage
                                    defaultMessage={'Excluding tax:'}
                                    id={'galleryItem.excludingTax'}
                                />
                            </div>
                            <div className={classes.price}>
                                <Price
                                    currencyCode={
                                        item.product.price_range.maximum_price
                                            .regular_price.currency
                                    }
                                    value={
                                        item.product.price_range.maximum_price
                                            .regular_price.value
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    <div className={classes.addToCart}>
                        <AddToCartButton
                            item={item.product}
                            noIcon={true}
                            priority={'high'}
                        />
                    </div>
                </div>
                <div className={classes.productAttributes}>
                    {productAttributes}
                </div>
            </div>
        );
    });

    attributes?.unshift({ attributes: product.reverse() });
    const content = shouldRenderVisibilityToggle ? (
        <div className={classes.wrapper}>
            <div className={classes.printPage}>
                <button onClick={() => window.print()}>
                    <FormattedMessage
                        defaultMessage={'Print page'}
                        id={'comparePage.printPage'}
                    />
                </button>
            </div>
            <table className={classes.table}>
                <tbody>
                    {attributes?.map((item, index) => {
                        return (
                            <tr key={index}>
                                <td className={classes.td}>{item.label}</td>
                                {item.attributes.map((attr, key) => (
                                    <td key={key} className={classes.td}>
                                        {index === 0 ? (
                                            <Fragment>{attr}</Fragment>
                                        ) : (
                                            <RichContent html={attr} />
                                        )}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    ) : (
        <div className={classes.massageContainer}>
            <FormattedMessage
                defaultMessage={'Items in compare list not found'}
                id={'comparePage.noItems'}
            />
        </div>
    );

    return (
        <div className={classes.root}>
            <div className={classes.heading}>
                <FormattedMessage
                    defaultMessage={'Compare Page'}
                    id={'comparePage.compareProducts'}
                />
            </div>
            <div className={classes.container}>{content}</div>
        </div>
    );
};

export default ComparePage;
