import React from 'react';
import AddToCartModal from '../AddToCartModal';
import { useToaster } from 'react-hot-toast';

const Notifications = () => {
    const { toasts, handlers } = useToaster();
    const { startPause, endPause } = handlers;
    console.log(toasts);

    return (
        <div onMouseEnter={startPause} onMouseLeave={endPause}>
            {toasts
                .filter(toast => toast.visible)
                .map(toast => (
                    <AddToCartModal message={toast.message} />
                ))}
        </div>
    );
};

export default React.memo(Notifications);
