import React, { Fragment, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import {
    Lock as LockIcon,
    AlertCircle as AlertCircleIcon
} from 'react-feather';
import { bool, shape, string } from 'prop-types';

import { useScrollLock, Price, useToasts } from '@magento/peregrine';
import { useMiniCart } from '../../talons/MiniCart/useMiniCart';
import { useStyle } from '@magento/venia-ui/lib/classify';

import Button from '../Button';
import Icon from '@magento/venia-ui/lib/components/Icon';

import ProductList from './ProductList';
import defaultClasses from './miniCart.module.css';
import operations from './miniCart.gql';
import bagIcon from '../../assets/Vector11.svg';
import closeIcon from '../../assets/closeIcon.svg';

const errorIcon = <Icon src={AlertCircleIcon} size={20} />;

/**
 * The MiniCart component shows a limited view of the user's cart.
 *
 * @param {Boolean} props.isOpen - Whether or not the MiniCart should be displayed.
 * @param {Function} props.setIsOpen - Function to toggle mini cart
 */
const MiniCart = React.forwardRef((props, ref) => {
    const { isOpen, setIsOpen } = props;

    // Prevent the page from scrolling in the background
    // when the MiniCart is open.
    useScrollLock(isOpen);

    const talonProps = useMiniCart({
        setIsOpen,
        operations
    });

    const {
        closeMiniCart,
        errorMessage,
        handleEditCart,
        handleProceedToCheckout,
        handleRemoveItem,
        loading,
        productList,
        subTotal,
        totalQuantity,
        configurableThumbnailSource,
        storeUrlSuffix
    } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);
    const rootClass = isOpen ? classes.root_open : classes.root;
    const contentsClass = isOpen ? classes.contents_open : classes.contents;

    const isCartEmpty = !(productList && productList.length);

    const [, { addToast }] = useToasts();

    useEffect(() => {
        if (errorMessage) {
            addToast({
                type: 'error',
                icon: errorIcon,
                message: errorMessage,
                dismissable: true,
                timeout: 7000
            });
        }
    }, [addToast, errorMessage]);

    const header = (
        <div className={classes.headerWrap}>
            <div className={classes.headerContent}>
                <img src={bagIcon} />
                <p className={classes.cartText}>Cart</p>
                {totalQuantity && (
                    <div className={classes.quantity}>{totalQuantity}</div>
                )}
            </div>
            <img
                onClick={() => {
                    setIsOpen(false);
                }}
                className={classes.closeBtn}
                src={closeIcon}
            />
        </div>
    );

    const contents = isCartEmpty ? (
        <div className={classes.emptyCart}>
            <div
                className={classes.emptyMessage}
                data-cy="MiniCart-emptyMessage"
            >
                <FormattedMessage
                    id={'miniCart.emptyMessage'}
                    defaultMessage={'There are no items in your cart.'}
                />
            </div>
        </div>
    ) : (
        <Fragment>
            {header}
            <div className={classes.body} data-cy="MiniCart-body">
                <ProductList
                    items={productList}
                    loading={loading}
                    handleRemoveItem={handleRemoveItem}
                    handleEditCart={handleEditCart}
                    closeMiniCart={closeMiniCart}
                    configurableThumbnailSource={configurableThumbnailSource}
                    storeUrlSuffix={storeUrlSuffix}
                />
            </div>
            <div className={classes.footer}>
                <div className={classes.subTotal}>
                    <span
                        className={classes.subtotalTitle}
                        data-cy="MiniCart-subtotalPriceLabel"
                    >
                        Subtotal
                    </span>
                    <span>
                        <Price
                            currencyCode={subTotal.currency}
                            value={subTotal.value}
                        />
                    </span>
                </div>

                <div className={classes.subTotal}>
                    <span
                        className={classes.subtotalTitle}
                        data-cy="MiniCart-subtotalPriceLabel"
                    >
                        Shipping
                    </span>
                    <span>$0</span>
                </div>

                <div className={classes.total}>
                    <span data-cy="MiniCart-subtotalPriceLabel">Total</span>
                    <span>
                        <Price
                            currencyCode={subTotal.currency}
                            value={subTotal.value}
                        />
                    </span>
                </div>
                <Button
                    onClick={handleProceedToCheckout}
                    priority="high"
                    className={classes.checkoutButton}
                    disabled={loading || isCartEmpty}
                    data-cy="Minicart-checkoutButton"
                >
                    <FormattedMessage
                        id={'miniCart.checkout'}
                        defaultMessage={'CHECKOUT'}
                    />
                </Button>
                <div className={classes.footerDescription}>
                    <p>
                        Through your help and our partnership with Tree Nation,
                        we now plant a tree for every book purchase.
                    </p>

                    <p>
                        We are offering free shipping on all orders to our EU
                        community.
                    </p>

                    <p>Free worldwide shipping from 60 EUR/USD order value.</p>

                    <p>
                        Due to current circumstances, shipments to non-European
                        countries are transported by ocean freight and delivery
                        may take longer than usual (from 4 to 8 weeks).
                    </p>

                    <p>
                        By ordering online the Terms and Conditions and Privacy
                        Policy are accepted.
                    </p>
                </div>
            </div>
        </Fragment>
    );

    return (
        <aside className={rootClass} data-cy="MiniCart-root">
            <div className={classes.miniCartWrap}>
                <div ref={ref} className={contentsClass}>
                    {contents}
                </div>
            </div>
        </aside>
    );
});

export default MiniCart;

MiniCart.propTypes = {
    classes: shape({
        root: string,
        root_open: string,
        contents: string,
        contents_open: string,
        header: string,
        body: string,
        footer: string,
        checkoutButton: string,
        editCartButton: string,
        emptyCart: string,
        emptyMessage: string,
        stockStatusMessageContainer: string
    }),
    isOpen: bool
};
