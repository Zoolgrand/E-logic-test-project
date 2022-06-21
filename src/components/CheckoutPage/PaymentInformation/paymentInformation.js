import React, { Suspense, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Form } from 'informed';
import { shape, func, string, bool, instanceOf } from 'prop-types';

import { usePaymentInformation } from '../../../talons/CheckoutPage/PaymentInformation/usePaymentInformation';
import CheckoutError from '@magento/peregrine/lib/talons/CheckoutPage/CheckoutError';

import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './paymentInformation.module.css';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

const PaymentMethods = React.lazy(() => import('./paymentMethods'));
const EditModal = React.lazy(() => import('./editModal'));
const Summary = React.lazy(() => import('./summary'));

const PaymentInformation = props => {
    const {
        classes: propClasses,
        onSave,
        resetShouldSubmit,
        setCheckoutStep,
        shouldSubmit,
        checkoutError,
        handlePlaceOrder,
        placeOrderLoading,
        doneEditing,
        setDoneEditing
    } = props;

    const classes = useStyle(defaultClasses, propClasses);

    const [isShowCard, setIsShowCard] = useState(false);
    const [billingFormOpen, setBillingFormOpen] = useState(false);
    const rootClass = !isShowCard
        ? classes.root
        : !billingFormOpen
        ? classes.billingFormOpen
        : classes.root_card_open;

    const talonProps = usePaymentInformation({
        onSave,
        checkoutError,
        resetShouldSubmit,
        setCheckoutStep,
        shouldSubmit,
        setDoneEditing
    });

    const {
        handlePaymentError,

        isLoading,
        showEditModal,
        setBillingAddress,
        shippingAddressOnCart,
        isEditModalActive,
        hideEditModal
    } = talonProps;

    if (isLoading) {
        return (
            <LoadingIndicator classes={{ root: classes.loading }}>
                <FormattedMessage
                    id={'checkoutPage.loadingPaymentInformation'}
                    defaultMessage={'Fetching Payment Information'}
                />
            </LoadingIndicator>
        );
    }

    const paymentInformation = doneEditing ? (
        <Summary onEdit={showEditModal} />
    ) : (
        <Form>
            <PaymentMethods
                onPaymentError={handlePaymentError}
                resetShouldSubmit={resetShouldSubmit}
                shouldSubmit={shouldSubmit}
                handlePlaceOrder={handlePlaceOrder}
                placeOrderLoading={placeOrderLoading}
                setIsShowCard={setIsShowCard}
                setBillingFormOpen={setBillingFormOpen}
                setBillingAddress={setBillingAddress}
                shippingAddressOnCart={shippingAddressOnCart}
            />
        </Form>
    );

    const editModal = doneEditing ? (
        <Suspense fallback={null}>
            <EditModal onClose={hideEditModal} isOpen={isEditModalActive} />
        </Suspense>
    ) : null;

    return (
        <div className={rootClass} data-cy="PaymentInformation-root">
            <div className={classes.payment_info_container}>
                {!doneEditing && (
                    <h5 className={classes.title}>
                        Select your payment method
                    </h5>
                )}
                <Suspense fallback={null}>{paymentInformation}</Suspense>
            </div>
            {editModal}
        </div>
    );
};

export default PaymentInformation;

PaymentInformation.propTypes = {
    classes: shape({
        container: string,
        payment_info_container: string,
        review_order_button: string
    }),
    onSave: func.isRequired,
    checkoutError: instanceOf(CheckoutError),
    resetShouldSubmit: func.isRequired,
    shouldSubmit: bool
};
