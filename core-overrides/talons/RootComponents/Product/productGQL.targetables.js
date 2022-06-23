const { Targetables } = require('@magento/pwa-buildpack');

module.exports = targets => {
    const targetables = Targetables.using(targets);

    const ProductGQL = targetables.reactComponent(
        '@magento/peregrine/lib/talons/RootComponents/Product/product.gql.js'
    );

    const rewriteGLQImportInstruction = {
        after: "{ ProductDetailsFragment } from '",
        remove: 27,
        insert: 'src/custom_queries/productDetailFragment.gql.js'
    };

    ProductGQL.spliceSource(rewriteGLQImportInstruction);
};
