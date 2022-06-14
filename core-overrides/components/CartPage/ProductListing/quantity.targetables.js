const { Targetables } = require('@magento/pwa-buildpack');

module.exports = targets => {
    const targetables = Targetables.using(targets);

    const QuantityComponent = targetables.reactComponent(
        '@magento/venia-ui/lib/components/CartPage/ProductListing/quantity.js'
    );

    const rewriteQuantityStepperImportInstruction = {
        after: "QuantityStepper from '",
        remove: 21,
        insert: 'src/components/QuantityStepper'
    };
    
    QuantityComponent.spliceSource(rewriteQuantityStepperImportInstruction);
};
