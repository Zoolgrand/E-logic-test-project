import React from 'react';
import SlickSlider from 'react-slick';
import GalleryItem from '../../../components/Gallery/item';
import { useCarousel } from './useCarousel';

const Carousel = props => {
    const { items } = props;

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        initialSlide: 0,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              infinite: true,
              dots: false
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
              initialSlide: 2
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
      };

    const { storeConfig } = useCarousel();

    const galleryItems = items.map((item, index) => {
        return (
            <GalleryItem key={index} item={item} storeConfig={storeConfig} />
        );
    });

    return <SlickSlider {...settings}>{galleryItems}</SlickSlider>;
};

export default Carousel;
