const { Targetables } = require('@magento/pwa-buildpack');

module.exports = targets => {
    const targetables = Targetables.using(targets);

    const DialogComponent = targetables.reactComponent(
        '@magento/venia-ui/lib/components/Dialog/dialog.js'
    );

    DialogComponent.addImport(
        "localClasses from 'src/components/Dialog/dialogLocal.module.css'"
    );

    DialogComponent.insertAfterSource(
        'const classes = useStyle(defaultClasses, ',
        'localClasses, '
    );

    const rewriteButtonImportInstruction = {
        after: "Button from '",
        remove: 9,
        insert: 'src/components/Button'
    };

    DialogComponent.spliceSource(rewriteButtonImportInstruction);
};
