const { Targetables } = require('@magento/pwa-buildpack');

module.exports = targets => {
    const targetables = Targetables.using(targets);

    const AuthModalComponent = targetables.reactComponent(
        '@magento/venia-ui/lib/components/AuthModal/authModal.js'
    );

    const rewriteSignInImportInstruction = {
        after: "SignIn from '",
        remove: 9,
        insert: 'src/components/SignIn'
    };

    const rewriteCreateAccountImportInstruction = {
        after: "CreateAccount from '",
        remove: 16,
        insert: 'src/components/CreateAccount'
    };
    
    AuthModalComponent.spliceSource(rewriteSignInImportInstruction);
    AuthModalComponent.spliceSource(rewriteCreateAccountImportInstruction);
};
