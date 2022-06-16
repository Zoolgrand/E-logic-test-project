const { Targetables } = require('@magento/pwa-buildpack');

module.exports = targets => {
    const targetables = Targetables.using(targets);

    const RadioComponent = targetables.reactComponent(
        '@magento/venia-ui/lib/components/RadioGroup/radio.js'
    );

    RadioComponent.addImport(
        "localClasses from 'src/components/RadioGroup/radioLocal.module.css'"
    );

    RadioComponent.insertAfterSource(
        'const classes = useStyle(defaultClasses, ',
        'localClasses, '
    );
};