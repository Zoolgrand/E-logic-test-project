import { gql } from '@apollo/client';

export const CREATE_COMPARE_LIST = gql`
    mutation createCompareList($input: CreateCompareListInput) {
        createCompareList(input: $input) {
            uid
            item_count
            items {
                product {
                    uid
                    name
                    sku
                }
                uid
            }
        }
    }
`;

export const GET_COMPARE_LIST = gql`
    query compareList($uid: ID!) {
        compareList(uid: $uid) {
            attributes {
                code
                label
            }
            item_count
            uid
            items {
                attributes {
                    code
                    value
                }
                product {
                    uid
                    id
                    image {
                        url
                    }
                    name
                    price_range {
                        maximum_price {
                            regular_price {
                                currency
                                value
                            }
                        }
                    }
                    review_count
                    sku
                    stock_status
                    type_id
                    url_key
                }
                uid
            }
        }
    }
`;

export const REMOVE_PRODUCTS_FROM_COMPARE_LIST = gql`
    mutation removeProductsFromCompareList(
        $input: RemoveProductsFromCompareListInput
    ) {
        removeProductsFromCompareList(input: $input) {
            uid
            items {
                product {
                    name
                    sku
                }
            }
        }
    }
`;

export const GET_CUSTOMER_COMPARE_LIST = gql`
    query GetCustomerWishlist {
        customer {
            id
            compare_list {
                attributes {
                    code
                    label
                }
                item_count
                items {
                    uid
                    attributes {
                        code
                        value
                    }
                    product {
                        id
                        uid
                        image {
                            url
                        }
                        name
                        price_range {
                            maximum_price {
                                regular_price {
                                    currency
                                    value
                                }
                            }
                        }
                        review_count
                        sku
                        stock_status
                        type_id
                        url_key
                    }
                }
                uid
            }
        }
    }
`;

export default {
    createCompareListMutation: CREATE_COMPARE_LIST,
    getCompareQuery: GET_COMPARE_LIST,
    getCustomerCompareQuery: GET_CUSTOMER_COMPARE_LIST,
    removeProductsFromCompareList: REMOVE_PRODUCTS_FROM_COMPARE_LIST
};
