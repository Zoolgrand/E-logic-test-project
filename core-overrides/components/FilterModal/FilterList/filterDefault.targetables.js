const { Targetables } = require('@magento/pwa-buildpack');

module.exports = targets => {
    const targetables = Targetables.using(targets);

    const FilterDefaultComponent = targetables.reactComponent(
        '@magento/venia-ui/lib/components/FilterModal/FilterList/filterDefault.js'
    );

    const rewriteCheckboxImportInstruction = {
        after: "Checkbox from '",
        remove: 14,
        insert: 'src/components/Checkbox'
    };

    FilterDefaultComponent.spliceSource(rewriteCheckboxImportInstruction);
};
