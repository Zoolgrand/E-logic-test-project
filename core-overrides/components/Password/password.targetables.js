const { Targetables } = require('@magento/pwa-buildpack');

module.exports = targets => {
    const targetables = Targetables.using(targets);

    const PasswordComponent = targetables.reactComponent(
        '@magento/venia-ui/lib/components/Password/password.js'
    );

    const rewriteTextInputImportInstruction = {
        after: "TextInput from '",
        remove: 12,
        insert: 'src/components/TextInput'
    };

    PasswordComponent.spliceSource(rewriteTextInputImportInstruction);

    PasswordComponent.setJSXProps('<TextInput/>', {
        placeholder: '"Enter your password"', 
    });

    PasswordComponent.removeJSXProps('<TextInput/>', [
        'after'
    ]);
};