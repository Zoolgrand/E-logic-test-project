const { Targetables } = require('@magento/pwa-buildpack');

module.exports = targets => {
    const targetables = Targetables.using(targets);

    const MainComponent = targetables.reactComponent(
        '@magento/venia-ui/lib/components/Main/main.js'
    );

    const rewriteFooterImportInstruction = {
        after: "Footer from '",
        remove: 9,
        insert: 'src/components/Footer'
    };

    const rewriteHeaderImportInstruction = {
        after: "Header from '",
        remove: 9,
        insert: 'src/components/Header'
    };
    
    MainComponent.spliceSource(rewriteHeaderImportInstruction);
    MainComponent.spliceSource(rewriteFooterImportInstruction);
};
