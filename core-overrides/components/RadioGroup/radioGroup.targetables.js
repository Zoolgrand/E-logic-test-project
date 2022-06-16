const { Targetables } = require('@magento/pwa-buildpack');

module.exports = targets => {
    const targetables = Targetables.using(targets);

    const RadioGroupComponent = targetables.reactComponent(
        '@magento/venia-ui/lib/components/RadioGroup/radioGroup.js'
    );

    RadioGroupComponent.addImport(
        "localClasses from 'src/components/RadioGroup/radioGroupLocal.module.css'"
    );

    RadioGroupComponent.insertAfterSource(
        'const classes = useStyle(defaultClasses, ',
        'localClasses, '
    );
};