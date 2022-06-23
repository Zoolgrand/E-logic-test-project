const { Targetables } = require('@magento/pwa-buildpack');

module.exports = targets => {
    const targetables = Targetables.using(targets);

    const ProductComponent = targetables.reactComponent(
        '@magento/venia-ui/lib/RootComponents/Product/product.js'
    );

    const rewriteProductFullDetailImportInstruction = {
        after: "ProductFullDetail from '",
        remove: 50,
        insert: 'src/components/ProductFullDetail'
    };
    
    ProductComponent.spliceSource(rewriteProductFullDetailImportInstruction);
};