const { Targetables } = require('@magento/pwa-buildpack');

module.exports = targets => {
    const targetables = Targetables.using(targets);

    const OrderConfirmationPageFragment = targetables.reactComponent(
        '@magento/peregrine/lib/talons/CheckoutPage/OrderConfirmationPage/orderConfirmationPageFragments.gql'
    );

    const rewriteGQLImportInstruction = {
        after: "{ ItemsReviewFragment } from '",
        remove: 39,
        insert: 'src/talons/CheckoutPage/ItemsReview/itemsReviewFragments.gql'
    };

    OrderConfirmationPageFragment.spliceSource(rewriteGQLImportInstruction);
};
