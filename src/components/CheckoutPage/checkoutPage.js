import React, { Fragment, useEffect, useState } from 'react';
import { shape, string } from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { AlertCircle as AlertCircleIcon } from 'react-feather';
import { Link } from 'react-router-dom';

import { useWindowSize, useToasts } from '@magento/peregrine';
import {
    CHECKOUT_STEP,
    useCheckoutPage
} from '../../talons/CheckoutPage/useCheckoutPage';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Button from '../Button';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import StockStatusMessage from '@magento/venia-ui/lib/components/StockStatusMessage';
import FormError from '@magento/venia-ui/lib/components/FormError';
import AddressBook from './AddressBook';
import GuestSignIn from './GuestSignIn';
import OrderSummary from './OrderSummary';
import PaymentInformation from './PaymentInformation';
import payments from './PaymentInformation/paymentMethodCollection';
import PriceAdjustments from './PriceAdjustments';
import ShippingMethod from './ShippingMethod';
import ShippingInformation from './ShippingInformation';
import OrderConfirmationPage from './OrderConfirmationPage';
import ItemsReview from './ItemsReview';
import GoogleReCaptcha from '@magento/venia-ui/lib/components/GoogleReCaptcha';

import defaultClasses from './checkoutPage.module.css';
import ScrollAnchor from '@magento/venia-ui/lib/components/ScrollAnchor/scrollAnchor';

const errorIcon = <Icon src={AlertCircleIcon} size={20} />;

const CheckoutPage = props => {
    const { classes: propClasses } = props;
    const { formatMessage } = useIntl();
    const talonProps = useCheckoutPage();

    const {
        /**
         * Enum, one of:
         * SHIPPING_ADDRESS, SHIPPING_METHOD, PAYMENT, REVIEW
         */
        activeContent,
        availablePaymentMethods,
        cartItems,
        checkoutStep,
        customer,
        error,
        guestSignInUsername,
        handlePlaceOrder,
        hasError,
        isCartEmpty,
        isGuestCheckout,
        isLoading,
        isUpdating,
        orderDetailsData,
        orderDetailsLoading,
        orderNumber,
        placeOrderLoading,
        placeOrderButtonClicked,
        setCheckoutStep,
        setGuestSignInUsername,
        setIsUpdating,
        setShippingInformationDone,
        scrollShippingInformationIntoView,
        setShippingMethodDone,
        scrollShippingMethodIntoView,
        setPaymentInformationDone,
        shippingInformationRef,
        shippingMethodRef,
        resetReviewOrderButtonClicked,
        handleReviewOrder,
        reviewOrderButtonClicked,
        recaptchaWidgetProps,
        toggleAddressBookContent,
        toggleSignInContent,
        handlePaymentSuccess,
        doneEditing,
        setDoneEditing
    } = talonProps;

    const [, { addToast }] = useToasts();
    const [activeSignInTab, setActiveSignInTab] = useState(true);

    useEffect(() => {
        if (hasError) {
            const message =
                error && error.message
                    ? error.message
                    : formatMessage({
                          id: 'checkoutPage.errorSubmit',
                          defaultMessage:
                              'Oops! An error occurred while submitting. Please try again.'
                      });
            addToast({
                type: 'error',
                icon: errorIcon,
                message,
                dismissable: true,
                timeout: 7000
            });

            if (process.env.NODE_ENV !== 'production') {
                console.error(error);
            }
        }
    }, [addToast, error, formatMessage, hasError]);

    const classes = useStyle(defaultClasses, propClasses);

    const windowSize = useWindowSize();
    const isMobile = windowSize.innerWidth <= 960;

    let checkoutContent;

    const heading = isGuestCheckout
        ? formatMessage({
              id: 'checkoutPage.guestCheckout',
              defaultMessage: 'Guest Checkout'
          })
        : formatMessage({
              id: 'checkoutPage.checkout',
              defaultMessage: 'Checkout'
          });

    if (orderNumber && orderDetailsData) {
        return (
            <OrderConfirmationPage
                data={orderDetailsData}
                orderNumber={orderNumber}
            />
        );
    } else if (isLoading) {
        return fullPageLoadingIndicator;
    } else if (isCartEmpty) {
        checkoutContent = (
            <div className={classes.empty_cart_container}>
                <div className={classes.heading_container}>
                    <h1
                        className={classes.heading}
                        data-cy="ChekoutPage-heading"
                    >
                        {heading}
                    </h1>
                </div>
                <h3>
                    <FormattedMessage
                        id={'checkoutPage.emptyMessage'}
                        defaultMessage={'There are no items in your cart.'}
                    />
                </h3>
            </div>
        );
    } else {
        const signInContainerVisible =
            isGuestCheckout && checkoutStep !== CHECKOUT_STEP.REVIEW;

        const signInContainerElement = signInContainerVisible ? (
            <GuestSignIn
                key={guestSignInUsername}
                isActive={true}
                toggleActiveContent={toggleSignInContent}
                initialValues={{ email: guestSignInUsername }}
            />
        ) : null;

        const shippingMethodSection =
            checkoutStep >= CHECKOUT_STEP.SHIPPING_METHOD ? (
                <ShippingMethod
                    pageIsUpdating={isUpdating}
                    onSave={setShippingMethodDone}
                    onSuccess={scrollShippingMethodIntoView}
                    setPageIsUpdating={setIsUpdating}
                />
            ) : (
                <h3 className={classes.shipping_method_heading}>
                    <FormattedMessage
                        id={'checkoutPage.shippingMethodStep'}
                        defaultMessage={'2. Shipping Method'}
                    />
                </h3>
            );

        const formErrors = [];
        const paymentMethods = Object.keys(payments);

        // If we have an implementation, or if this is a "zero" checkout,
        // we can allow checkout to proceed.
        const isPaymentAvailable = !!availablePaymentMethods.find(
            ({ code }) => code === 'free' || paymentMethods.includes(code)
        );

        if (!isPaymentAvailable) {
            formErrors.push(
                new Error(
                    formatMessage({
                        id: 'checkoutPage.noPaymentAvailable',
                        defaultMessage: 'Payment is currently unavailable.'
                    })
                )
            );
        }

        const paymentInformationSection =
            checkoutStep >= CHECKOUT_STEP.PAYMENT ? (
                <PaymentInformation
                    onSave={setPaymentInformationDone}
                    checkoutError={error}
                    resetShouldSubmit={resetReviewOrderButtonClicked}
                    setCheckoutStep={setCheckoutStep}
                    shouldSubmit={reviewOrderButtonClicked}
                    handlePlaceOrder={handlePlaceOrder}
                    placeOrderLoading={placeOrderLoading}
                    handlePaymentSuccess={handlePaymentSuccess}
                    doneEditing={doneEditing}
                    setDoneEditing={setDoneEditing}
                />
            ) : (
                <h3 className={classes.payment_information_heading}>
                    <FormattedMessage
                        id={'checkoutPage.paymentInformationStep'}
                        defaultMessage={'3. Payment Information'}
                    />
                </h3>
            );

        // const priceAdjustmentsSection =
        //     checkoutStep === CHECKOUT_STEP.PAYMENT ? (
        //         <div className={classes.price_adjustments_container}>
        //             <PriceAdjustments setPageIsUpdating={setIsUpdating} />
        //         </div>
        //     ) : null;

        const reviewOrderButton =
            checkoutStep === CHECKOUT_STEP.PAYMENT ? (
                <Button
                    onClick={handlePaymentSuccess}
                    priority="high"
                    className={classes.review_order_button}
                    data-cy="CheckoutPage-reviewOrderButton"
                    disabled={
                        reviewOrderButtonClicked ||
                        isUpdating ||
                        !isPaymentAvailable
                    }
                >
                    <FormattedMessage
                        id={'checkoutPage.reviewOrder'}
                        defaultMessage={'Review Your Order'}
                    />
                </Button>
            ) : null;

        const itemsReview = (
            <div className={classes.items_review_container}>
                <ItemsReview />
            </div>
        );

        const placeOrderButton =
            checkoutStep === CHECKOUT_STEP.REVIEW ? (
                <Button
                    onClick={handlePlaceOrder}
                    priority="high"
                    className={classes.place_order_button}
                    data-cy="CheckoutPage-placeOrderButton"
                    disabled={
                        isUpdating ||
                        placeOrderLoading ||
                        orderDetailsLoading ||
                        placeOrderButtonClicked
                    }
                >
                    <FormattedMessage
                        id={'checkoutPage.placeOrder'}
                        defaultMessage={'Place Order'}
                    />
                </Button>
            ) : null;

        // If we're on mobile we should only render price summary in/after review.
        const shouldRenderPriceSummary = !(
            isMobile && checkoutStep < CHECKOUT_STEP.REVIEW
        );

        const orderSummary = shouldRenderPriceSummary ? (
            <div
                className={
                    classes.summaryContainer +
                    (signInContainerVisible
                        ? ' ' + classes.signInContainerVisible
                        : '') +
                    (recaptchaWidgetProps.shouldRender
                        ? ' ' + classes.reCaptchaMargin
                        : '')
                }
            >
                {itemsReview}
                <OrderSummary isUpdating={isUpdating} />
            </div>
        ) : null;

        // let headerText;

        // if (isGuestCheckout) {
        //     headerText = formatMessage({
        //         id: 'checkoutPage.guestCheckout',
        //         defaultMessage: 'Guest Checkout'
        //     });
        // } else if (customer.default_shipping) {
        //     headerText = formatMessage({
        //         id: 'checkoutPage.reviewAndPlaceOrder',
        //         defaultMessage: 'Review and Place Order'
        //     });
        // } else {
        //     headerText = formatMessage(
        //         {
        //             id: 'checkoutPage.greeting',
        //             defaultMessage: 'Welcome {firstname}!'
        //         },
        //         { firstname: customer.firstname }
        //     );
        // }

        const checkoutContentClass =
            activeContent === 'checkout'
                ? classes.checkoutContent
                : classes.checkoutContent_hidden;

        checkoutContent = (
            <div className={checkoutContentClass}>
                <div className={classes.checkoutContentWrap}>
                    {checkoutStep === 1 && (
                        <div className={classes.tabs}>
                            <div
                                onClick={() => {
                                    setActiveSignInTab(true);
                                }}
                                className={classes.tab}
                            >
                                <p
                                    className={
                                        activeSignInTab
                                            ? classes.activeTab
                                            : classes.disabledTab
                                    }
                                >
                                    Sign in
                                </p>
                                <div
                                    className={
                                        activeSignInTab
                                            ? classes.divider
                                            : classes.divider_hidden
                                    }
                                />
                            </div>

                            <div
                                onClick={() => {
                                    setActiveSignInTab(false);
                                }}
                                className={classes.tab}
                            >
                                <p
                                    className={
                                        !activeSignInTab
                                            ? classes.activeTab
                                            : classes.disabledTab
                                    }
                                >
                                    Guest checkout
                                </p>
                                <div
                                    className={
                                        !activeSignInTab
                                            ? classes.divider
                                            : classes.divider_hidden
                                    }
                                />
                            </div>
                        </div>
                    )}
                    {activeSignInTab &&
                        checkoutStep === 1 &&
                        signInContainerElement}

                    <div className={classes.shipping_information_container}>
                        <ScrollAnchor ref={shippingInformationRef}>
                            <ShippingInformation
                                onSave={setShippingInformationDone}
                                onSuccess={scrollShippingInformationIntoView}
                                toggleActiveContent={toggleAddressBookContent}
                                toggleSignInContent={toggleSignInContent}
                                setGuestSignInUsername={setGuestSignInUsername}
                                activeSignInTab={activeSignInTab}
                            />
                        </ScrollAnchor>
                    </div>
                    <div className={classes.shipping_method_container}>
                        <ScrollAnchor ref={shippingMethodRef}>
                            {shippingMethodSection}
                        </ScrollAnchor>
                    </div>
                    <div className={classes.payment_information_container}>
                        {paymentInformationSection}
                        {reviewOrderButton}
                        {placeOrderButton}
                    </div>

                    <GoogleReCaptcha {...recaptchaWidgetProps} />
                </div>
                {orderSummary}
            </div>
        );
    }

    const addressBookElement = !isGuestCheckout ? (
        <AddressBook
            activeContent={activeContent}
            toggleActiveContent={toggleAddressBookContent}
            onSuccess={scrollShippingInformationIntoView}
        />
    ) : null;

    return (
        <div className={classes.root} data-cy="CheckoutPage-root">
            <StoreTitle>
                {formatMessage({
                    id: 'checkoutPage.titleCheckout',
                    defaultMessage: 'Checkout'
                })}
            </StoreTitle>
            {checkoutContent}
            {addressBookElement}
        </div>
    );
};

export default CheckoutPage;

CheckoutPage.propTypes = {
    classes: shape({
        root: string,
        checkoutContent: string,
        checkoutContent_hidden: string,
        heading_container: string,
        heading: string,
        cartLink: string,
        stepper_heading: string,
        shipping_method_heading: string,
        payment_information_heading: string,
        signInContainer: string,
        signInLabel: string,
        signInButton: string,
        empty_cart_container: string,
        shipping_information_container: string,
        shipping_method_container: string,
        payment_information_container: string,
        price_adjustments_container: string,
        items_review_container: string,
        summaryContainer: string,
        formErrors: string,
        review_order_button: string,
        place_order_button: string,
        signInContainerVisible: string,
        reCaptchaMargin: string
    })
};
