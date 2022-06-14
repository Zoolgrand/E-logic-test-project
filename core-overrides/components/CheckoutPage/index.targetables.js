const { Targetables } = require('@magento/pwa-buildpack');

module.exports = targets => {
    const targetables = Targetables.using(targets);

    const CheckoutPageComponent = targetables.reactComponent(
        '@magento/venia-ui/lib/components/CheckoutPage/index.js'
    );

    const rewriteCheckoutPageImportInstruction = {
        after: "export { default } from '",
        remove: 14,
        insert: 'src/components/CheckoutPage/checkoutPage'
    };
    
    CheckoutPageComponent.spliceSource(rewriteCheckoutPageImportInstruction);
};
