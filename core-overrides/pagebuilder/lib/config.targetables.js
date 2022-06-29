const { Targetables } = require('@magento/pwa-buildpack');

module.exports = targets => {
    const targetables = Targetables.using(targets);

    const ConfigComponent = targetables.reactComponent(
        '@magento/pagebuilder/lib/config.js'
    );
    const rewriteButtonItemImportInstruction = {
        after: "ButtonItem from '",
        remove: 25,
        insert: 'src/contentTypes/ButtonItem'
    };
    
    ConfigComponent.spliceSource(rewriteButtonItemImportInstruction);

};
