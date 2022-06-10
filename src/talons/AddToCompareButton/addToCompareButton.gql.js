import { gql } from '@apollo/client';

export const CREATE_COMPARE_LIST = gql`
    mutation createCompareList($input: CreateCompareListInput) {
        createCompareList(input: $input) {
            uid
            item_count
            items {
                product {
                    id
                    uid
                }
                uid
            }
        }
    }
`;

export const ADD_TO_COMPARE = gql`
    mutation addProductsToCompareList($input: AddProductsToCompareListInput) {
        addProductsToCompareList(input: $input) {
            uid
            item_count
            items {
                uid
                product {
                    name
                    sku
                    uid
                }
            }
        }
    }
`;

export default {
    addProductToCompareMutation: ADD_TO_COMPARE,
    createCompareListMutation: CREATE_COMPARE_LIST
};
