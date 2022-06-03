import React from 'react';
import AddToCartModal from '../AddToCartModal';
import { useToaster } from 'react-hot-toast';

const Notifications = () => {
    const { toasts } = useToaster();

    return (
        <div>
            {toasts
                .filter(toast => toast.visible)
                .map(toast => (
                    <AddToCartModal message={toast.message} />
                ))}
        </div>
    );
};

export default React.memo(Notifications);
