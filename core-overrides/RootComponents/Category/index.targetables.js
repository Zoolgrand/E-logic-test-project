const { Targetables } = require('@magento/pwa-buildpack');

module.exports = targets => {
    const targetables = Targetables.using(targets);

    const CategoryIndex = targetables.reactComponent(
        '@magento/venia-ui/lib/RootComponents/Category/index.js'
    );

    const rewriteExportInstruction = {
        after: "export { default } from '",
        remove: 10,
        insert: 'src/RootComponents/Category/category'
    };

    CategoryIndex.spliceSource(rewriteExportInstruction);
};
