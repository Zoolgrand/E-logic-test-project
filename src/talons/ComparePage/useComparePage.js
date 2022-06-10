import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import defaultOperations from './comparePage.gql';
import { BrowserPersistence } from '@magento/peregrine/lib/util';

const storage = new BrowserPersistence();

export const useComparePage = (props = {}) => {
    const operations = mergeOperations(defaultOperations, props.operations);
    const {
        getCompareQuery,
        removeProductsFromCompareList,
        getCustomerCompareQuery
    } = operations;

    const [{ isSignedIn }] = useUserContext();
    const storageCompareId = storage.getRawItem('compare_id');
    const compareIdParsed = JSON.parse(storageCompareId);
    const compareId = compareIdParsed?.value.replaceAll('"', '');
    const storageCustomerCompareId = storage.getRawItem('customer_compare_id');
    const customerCompareIdParsed = JSON.parse(storageCustomerCompareId);
    const customerCompareId = customerCompareIdParsed?.value.replaceAll(
        '"',
        ''
    );

    const uid = compareId || customerCompareId;
    const [productsId, setProductsId] = useState([]);

    const { data, error, loading } = useQuery(getCompareQuery, {
        fetchPolicy: 'network-only',
        nextFetchPolicy: 'network-only',
        variables: {
            uid: uid
        },
        skip: !compareId,
        
    });

    const {
        data: customerData,
        error: customerError,
        loading: customerLoading
    } = useQuery(getCustomerCompareQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !isSignedIn
    });

    const derivedCompareLists = useMemo(() => {
        if(data && data.compareList) {
          return data.compareList
        }
        if(customerData?.customer.compare_list?.uid) {
            storage.setItem('customer_compare_id', customerData.customer.compare_list.uid);
            // setProductsId(customerData.customer.compare_list.items.map(item => item.product.id));
            return customerData.customer.compare_list
        }
       return [];
    }, [customerData, data]);

    const errors = useMemo(() => {
        return new Map([['getCompareQuery', error]]);
    }, [error]);

    const [
        removeItem,
        {
            loading: removeItemLoading,
            called: removeItemCalled,
            error: removeItemError,
        }
    ] = useMutation(removeProductsFromCompareList);

    const handleRemoveItem = useCallback(
        async id => {
            try {
                await removeItem({
                    variables: {
                        input: {
                            uid: uid,
                            products: [id]
                        }
                    },
                    refetchQueries: [
                        compareId ?
                        {
                            query: getCompareQuery,
                            variables: { uid: uid}
                        } : {
                                query: getCustomerCompareQuery
                            }
                    ],
                    awaitRefetchQueries: true
                });

            } catch (e) {
                // Error is logged by apollo link - no need to double log.
            }
        },
        [compareId, getCompareQuery, getCustomerCompareQuery, removeItem, uid]
    );

    const handleClearCompareList = useCallback(async () => {
        try {
            await removeItem({
                variables: {
                    input: {
                        uid: uid,
                        products: productsId
                    }
                },
                refetchQueries: [
                    {
                        query: getCustomerCompareQuery
                    },
                    'compareList'
                ],
                awaitRefetchQueries: true,
            });
        } catch (e) {
            // Error is logged by apollo link - no need to double log.
        }
    }, [getCustomerCompareQuery, productsId, removeItem, uid]);

    const customerItems = customerData?.customer?.compare_list?.items || [];

    useEffect(() => {
        if (customerData?.customer.compare_list?.uid) {
            setProductsId(customerData?.customer?.compare_list?.items.map(item => item.product.id));
        }
    }, [customerData?.customer?.compare_list?.items, customerData?.customer.compare_list?.uid]);

    useEffect(() => {
        if (!isSignedIn) {
            storage.removeItem('customer_compare_id');
        }
    }, [isSignedIn]);

    return {
        errors,
        loading: loading || customerLoading || removeItemLoading,
        compareList: derivedCompareLists?.items,
        compareAttribute: derivedCompareLists,
        shouldRenderVisibilityToggle: derivedCompareLists?.item_count > 0,
        handleRemoveItem,
        handleClearCompareList,
        compareCount: derivedCompareLists?.item_count,
        getCompareQuery,
        getCustomerCompareQuery
    };
};
