import React from 'react';
import AddToCartModal from '../AddToCartModal';
import { useToaster } from 'react-hot-toast';

const Notifications = () => {
    const { toasts, handlers } = useToaster();
    const { startPause, endPause } = handlers;

    return (
        <div onMouseEnter={startPause} onMouseLeave={endPause}>
            {toasts
                .filter(toast => toast.visible)
                .map(toast => (
                    <AddToCartModal
                        item={JSON.parse(toast.message.split('divider')[0])}
                        items={JSON.parse(toast.message.split('divider')[1])}
                    />
                ))}
        </div>
    );
};

export default React.memo(Notifications);
