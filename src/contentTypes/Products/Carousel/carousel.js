import Slider from '../../Slider/slider';
import React from 'react';
import GalleryItem from '../../../components/Gallery/item';
import { useCarousel } from './useCarousel';
import SliderItem from '../../../components/Gallery/sliderItem';

const Carousel = props => {
    const { items, type } = props;
    const { storeConfig } = useCarousel();

    const galleryItems = items.map((item, index) => {
        const switchType = type => {
            switch (type) {
                case 'Add to cart':
                    return (
                        <img
                            key={index}
                            src={new URL(item.small_image.url).pathname}
                        />
                    );
                case 'Slider item':
                    return (
                        <SliderItem
                            key={index}
                            item={item}
                            storeConfig={storeConfig}
                        />
                    );
                case 'Product Image':
                    return <img key={index} src={new URL(item.url).pathname} />;

                default:
                    return (
                        <GalleryItem
                            key={index}
                            item={item}
                            storeConfig={storeConfig}
                        />
                    );
            }
        };
        return switchType(type);
    });

    return <Slider type={type}>{galleryItems}</Slider>;
};

export default Carousel;
