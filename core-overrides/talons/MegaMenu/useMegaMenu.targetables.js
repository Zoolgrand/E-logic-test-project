const { Targetables } = require('@magento/pwa-buildpack');

module.exports = targets => {
    const targetables = Targetables.using(targets);

    const useMegaMenu = targetables.reactComponent(
        '@magento/peregrine/lib/talons/MegaMenu/useMegaMenu.js'
    );

    const rewriteGQLImportInstruction = {
        after: "DEFAULT_OPERATIONS from '",
        remove: 14,
        insert: 'src/custom_queries/megaMenu.gql.js'
    };

    useMegaMenu.spliceSource(rewriteGQLImportInstruction);
};
