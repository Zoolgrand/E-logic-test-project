import React from 'react';
import { FormattedMessage } from 'react-intl';

import { useItemsReview } from '../../../talons/CheckoutPage/ItemsReview/useItemsReview';

import Item from './item';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { useHistory } from 'react-router-dom';
import editIcon from '../../../assets/editIcon.svg';

import defaultClasses from './itemsReview.module.css';

/**
 * Renders a list of items in an order.
 * @param {Object} props.data an optional static data object to render instead of making a query for data.
 */
const ItemsReview = props => {
    const { classes: propClasses, data } = props;

    const classes = useStyle(defaultClasses, propClasses);
    const history = useHistory();

    const editHandler = () => {
        history.push('/cart');
    };

    const talonProps = useItemsReview({
        data: props.data
    });

    const {
        items: itemsInCart,
        isLoading,
        configurableThumbnailSource
    } = talonProps;

    const itemsToMaping = data ? data?.cart.items : itemsInCart;

    const items = itemsToMaping.map(item => (
        <Item
            key={item.id}
            {...item}
            configurableThumbnailSource={configurableThumbnailSource}
        />
    ));

    if (isLoading) {
        return (
            <LoadingIndicator>
                <FormattedMessage
                    id={'checkoutPage.fetchingItemsInYourOrder'}
                    defaultMessage={'Fetching Items in your Order'}
                />
            </LoadingIndicator>
        );
    }

    return (
        <div
            className={classes.items_review_container}
            data-cy="ItemsReview-container"
        >
            <div className={classes.itemReviewHeading}>
                <p>Summary</p>
                {!data && (
                    <button onClick={editHandler}>
                        <span className={classes.editContainer}>
                            <img src={editIcon} alt="edit" />
                            <p>Edit</p>
                        </span>
                    </button>
                )}
            </div>
            <div className={classes.items_container}>
                {items}
                <div className={classes.divider} />
            </div>
        </div>
    );
};

export default ItemsReview;
