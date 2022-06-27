/* eslint-disable */
/**
 * Custom interceptors for the project.
 *
 * This project has a section in its package.json:
 *    "pwa-studio": {
 *        "targets": {
 *            "intercept": "./local-intercept.js"
 *        }
 *    }
 *
 * This instructs Buildpack to invoke this file during the intercept phase,
 * as the very last intercept to run.
 *
 * A project can intercept targets from any of its dependencies. In a project
 * with many customizations, this function would tap those targets and add
 * or modify functionality from its dependencies.
 */

module.exports = targets => {
    const MainComponent = require('./core-overrides/components/Main/main.targetables.js');
    MainComponent(targets);

    const useMegaMenu = require('./core-overrides/talons/MegaMenu/useMegaMenu.targetables.js');
    useMegaMenu(targets);

    const AppComponent = require('./core-overrides/components/App/app.targetables.js');
    AppComponent(targets);

    const PasswordComponent = require('./core-overrides/components/Password/password.targetables.js');
    PasswordComponent(targets);

    const AuthModalComponent = require('./core-overrides/components/AuthModal/authModal.targetables.js');
    AuthModalComponent(targets);

    const CategoryIndex = require('./core-overrides/RootComponents/Category/index.targetables.js');
    CategoryIndex(targets);

    const FilterSidebarComponent = require('./core-overrides/components/FilterSidebar/filterSidebar.targetables.js');
    FilterSidebarComponent(targets);

    const FilterDefaultComponent = require('./core-overrides/components/FilterModal/FilterList/filterDefault.targetables');
    FilterDefaultComponent(targets);

    const CarouselComponent = require('./core-overrides/contentTypes/Products/Carousel/carousel.targetables');
    CarouselComponent(targets);

    const QuantityComponent = require('./core-overrides/components/CartPage/ProductListing/quantity.targetables');
    QuantityComponent(targets);

    const CheckoutPageComponent = require('./core-overrides/components/CheckoutPage/index.targetables');
    CheckoutPageComponent(targets);

    const RadioGroupComponent = require('./core-overrides/components/RadioGroup/radioGroup.targetables');
    RadioGroupComponent(targets);

    const RadioComponent = require('./core-overrides/components/RadioGroup/radio.targetables');
    RadioComponent(targets);

    const DialogComponent = require('./core-overrides/components/Dialog/dialog.targetables');
    DialogComponent(targets);

    const OrderConfirmationPageFragment = require('./core-overrides/talons/CheckoutPage/OrderConfirmationPage/orderConfirmationPageFragmentGQL.targetables');
    OrderConfirmationPageFragment(targets);

    const CountryComponent = require('./core-overrides/components/Country/country.targetables');
    CountryComponent(targets);

    const ProductComponent = require('./core-overrides/RootComponents/Product/product.targetables');
    ProductComponent(targets);

    const ProductGQL = require('./core-overrides/talons/RootComponents/Product/productGQL.targetables');
    ProductGQL(targets);

    targets.of('@magento/venia-ui').routes.tap(routes => {
        routes.push({
            exact: true,
            name: 'Compare Page',
            path: require.resolve('./src/components/ComparePage'),
            pattern: '/compare'
        });
        return routes;
    });
};
