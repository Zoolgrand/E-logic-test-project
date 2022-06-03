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

    const imageLink = new URL(item.small_image.url).pathname;

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
            <div className={classes.color}>Color: Light aqua</div>
            <div className={classes.color}>Size: M</div>
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
                            Regular Rise 7/8 Leggins In Takara Shine
                        </div>
                        <div className={classes.itemName}>
                            ${item.price_range.maximum_price.final_price.value}
                        </div>
                        {itemColorBlock}
                        {wiewBagButton}
                    </div>
                </div>

                <div className={classes.title}>
                    CUSTOMERS LIKE YOU ALSO BOUGHT...
                </div>
                <div className={classes.carousel}>
                    <Carousel items={items} />
                </div>
            </div>
        </div>
    );
};

export default React.memo(AddToCartModal);
