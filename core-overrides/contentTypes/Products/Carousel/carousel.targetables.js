const { Targetables } = require('@magento/pwa-buildpack');

module.exports = targets => {
    const targetables = Targetables.using(targets);

    const CarouselComponent = targetables.reactComponent(
        '@magento/pagebuilder/lib/ContentTypes/Products/Carousel/carousel.js'
    );

    const rewriteGalleryItemInstruction = {
        after: "GalleryItem from '",
        remove: 45,
        insert: 'src/components/Gallery/sliderItem'
    };

    CarouselComponent.spliceSource(rewriteGalleryItemInstruction);
};
