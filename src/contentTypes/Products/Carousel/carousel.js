import Slider from '../../Slider/slider';
import React from 'react';
import GalleryItem from '../../../components/Gallery/item';
import { useCarousel } from './useCarousel';

const Carousel = props => {
    const { items } = props;

    const { storeConfig } = useCarousel();

    const galleryItems = items.map((item, index) => {
        return (
            // <GalleryItem key={index} item={item} storeConfig={storeConfig} />
            <img key={index} src={new URL(item.small_image.url).pathname} />
        );
    });

    return <Slider>{galleryItems}</Slider>;
};

export default Carousel;
