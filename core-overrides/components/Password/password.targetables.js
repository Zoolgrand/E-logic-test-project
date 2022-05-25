const { Targetables } = require('@magento/pwa-buildpack');

module.exports = targets => {
    const targetables = Targetables.using(targets);

    const PasswordComponent = targetables.reactComponent(
        '@magento/venia-ui/lib/components/Password/password.js'
    );

    PasswordComponent.setJSXProps('<TextInput/>', {
        placeholder: '"Enter your password"', 
    });

    PasswordComponent.removeJSXProps('<TextInput/>', [
        'after'
    ]);
};