import React from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './addToCartModal.module.css';
import { useHistory } from 'react-router-dom';

import closeModalIcon from '../../assets/closeIcon.svg';
import Button from '../Button';
import Carousel from '../../contentTypes/Products/Carousel';
import toast from 'react-hot-toast';

const AddToCartModal = props => {
    const { message } = props;

    const item = JSON.parse(message.split('divider')[0]);
    const items = JSON.parse(message.split('divider')[1]);

    const history = useHistory();

    const classes = useStyle(defaultClasses, props.classes);

    const imageLink = new URL(item.small_image.url || item.small_image)
        .pathname;

    const clickHandler = () => {
        history.push('/cart');
        toast.dismiss();
    };

    const closeModalHandler = e => {
        if (e.currentTarget === e.target) {
            toast.dismiss();
        }
    };

    const itemColorBlock = (
        <div className={classes.itemColorBlock}>
            {item.color && (
                <div className={classes.color}>Color: {item.color}</div>
            )}
            {item.size && (
                <div className={classes.color}>Size: {item.size}</div>
            )}
        </div>
    );

    const wiewBagButton = (
        <Button
            priority={'high'}
            classes={{
                root_highPriority: classes.checkoutButton
            }}
            onPress={clickHandler}
            data-cy="FilterModalOpenButton-button"
            type="button"
            aria-live="polite"
            aria-busy="false"
        >
            WIEW BAG & CHECKOUT
        </Button>
    );

    const itemDescription =
        item.short_description &&
        item.short_description.replace('<p>', '').replace('</p>', '');

    return (
        <div className={classes.root} onClick={closeModalHandler}>
            <div className={classes.content}>
                <img
                    className={classes.closeBtn}
                    onClick={closeModalHandler}
                    src={closeModalIcon}
                />
                <div className={classes.title}>Just added to your bag...</div>

                <div className={classes.item}>
                    <img className={classes.itemImage} src={imageLink} />
                    <div className={classes.itemInfo}>
                        <div className={classes.itemName}>{item.name}</div>
                        <div className={classes.description}>
                            {itemDescription ||
                                "This product don't have description"}
                        </div>
                        <div className={classes.itemName}>
                            $
                            {
                                item?.price_range?.maximum_price?.final_price
                                    ?.value
                            }
                            {item.price_range.maximum_price.discount
                                .percent_off > 0 && (
                                <div className={classes.regularPrice}>
                                    $
                                    {
                                        item.price_range.maximum_price
                                            .regular_price.value
                                    }
                                </div>
                            )}
                        </div>
                        {itemColorBlock}
                        {wiewBagButton}
                    </div>
                </div>

                <div className={classes.title}>
                    CUSTOMERS LIKE YOU ALSO BOUGHT...
                </div>
                <div className={classes.carousel}>
                    {items.length > 0 ? (
                        <Carousel type="Add to cart" items={items} />
                    ) : (
                        "This product don't have related products"
                    )}
                </div>
            </div>
        </div>
    );
};

export default React.memo(AddToCartModal);
