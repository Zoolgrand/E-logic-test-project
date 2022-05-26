import { useState, useCallback } from 'react';

/**
 * Returns props necessary to render a CategoryBranch component.
 *
 * @param {object} props
 * @param {object} props.category - category data
 * @param {string} props.category.id - category id
 * @param {boolean} props.category.include_in_menu - whether to show category
 * @param {function} props.setCategoryId - callback that updates categoryId
 * @return {{ exclude: boolean, handleClick: function }}
 */
export const useCategoryBranch = props => {
    const [isOpen, setIsOpen] = useState(false);

    const clickHandler = useCallback(() => {
        setIsOpen(prev => !prev);
    }, [isOpen, setIsOpen]);

    return { isOpen, setIsOpen, clickHandler };
};
