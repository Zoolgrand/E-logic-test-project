const { Targetables } = require('@magento/pwa-buildpack');

module.exports = targets => {
    const targetables = Targetables.using(targets);

    const AppComponent = targetables.reactComponent(
        '@magento/venia-ui/lib/components/App/app.js'
    );

    const rewriteNavigationImportInstruction = {
        after: "Navigation from '",
        remove: 13,
        insert: 'src/components/Navigation'
    };

   
    AppComponent.spliceSource(rewriteNavigationImportInstruction);
};
