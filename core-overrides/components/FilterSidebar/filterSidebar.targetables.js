const { Targetables } = require('@magento/pwa-buildpack');

module.exports = targets => {
    const targetables = Targetables.using(targets);

    const FilterSidebarComponent = targetables.reactComponent(
        '@magento/venia-ui/lib/components/FilterSidebar/filterSidebar.js'
    );

    const rewriteFilterBlockImportInstruction = {
        after: "FilterBlock from '",
        remove: 26,
        insert: 'src/components/FilterBlock'
    };

    FilterSidebarComponent.spliceSource(rewriteFilterBlockImportInstruction);
};
