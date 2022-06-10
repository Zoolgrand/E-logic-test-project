import { gql } from '@apollo/client';
import { CheckoutPageFragment } from '@magento/peregrine/lib/talons/CheckoutPage/checkoutPageFragments.gql';

export const GET_CUSTOMER = gql`
    query GetCustomerAfterSignIn {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        customer {
            email
            firstname
            lastname
            is_subscribed
        }
    }
`;

export const SIGN_IN = gql`
    mutation SignIn($email: String!, $password: String!) {
        generateCustomerToken(email: $email, password: $password) {
            token
        }
    }
`;

export const CREATE_CART = gql`
    mutation CreateCartAfterSignIn {
        cartId: createEmptyCart
    }
`;

export const MERGE_CARTS = gql`
    mutation MergeCartsAfterSignIn(
        $sourceCartId: String!
        $destinationCartId: String!
    ) {
        mergeCarts(
            source_cart_id: $sourceCartId
            destination_cart_id: $destinationCartId
        ) {
            id
            # eslint-disable-next-line @graphql-eslint/require-id-when-available
            items {
                uid
            }
            ...CheckoutPageFragment
        }
    }
    ${CheckoutPageFragment}
`;

export const ASSIGN_COMPARE_LIST_TO_CUSTOMER = gql`
    mutation assignCompareListToCustomer ($uid: ID!) {
        assignCompareListToCustomer (uid: $uid) {
            result
            compare_list {
                uid
                item_count
                items {
                    uid
                    product {
                        uid
                        name
                    }
                }
            }
        }
    }
`;

export const CREATE_COMPARE_LIST = gql`
    mutation createCompareList ($input: CreateCompareListInput) {
        createCompareList(input: $input) {
            uid
            item_count
            items {
                uid
                product {
                    uid
                    name
                    sku
                }
            }
        }
    }
`;

export default {
    createCartMutation: CREATE_CART,
    getCustomerQuery: GET_CUSTOMER,
    mergeCartsMutation: MERGE_CARTS,
    signInMutation: SIGN_IN,
    assignCompareListToCustomerMutation: ASSIGN_COMPARE_LIST_TO_CUSTOMER,
    createCompareListMutation: CREATE_COMPARE_LIST
};
