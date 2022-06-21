const { Targetables } = require('@magento/pwa-buildpack');

module.exports = targets => {
    const targetables = Targetables.using(targets);

    const CountryComponent = targetables.reactComponent(
        '@magento/venia-ui/lib/components/Country/country.js'
    );

    const rewriteSelectImportInstruction = {
        after: "Select from '",
        remove: 9,
        insert: 'src/components/Select'
    };

  
    CountryComponent.spliceSource(rewriteSelectImportInstruction);
};
