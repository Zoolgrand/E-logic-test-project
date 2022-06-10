import { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useMutation } from '@apollo/client';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import defaultOperations from './addToCompareButton.gql';
import { useHistory } from 'react-router-dom';
import { BrowserPersistence } from '@magento/peregrine/lib/util';
import { useComparePage } from '../ComparePage/useComparePage';

const storage = new BrowserPersistence();

export const useAddToCompareButton = props => {
    const { afterAdd, beforeAdd, item } = props;
    const history = useHistory();
    const {
        compareList,
        getCustomerCompareQuery,
        getCompareQuery
    } = useComparePage();
    const operations = mergeOperations(defaultOperations, props.operations);
    const {
        addProductToCompareMutation,
        createCompareListMutation
    } = operations;
    const storageCompareId = storage.getRawItem('compare_id');
    const compareIdParsed = JSON.parse(storageCompareId);
    const compareId = compareIdParsed?.value.replaceAll('"', '');
    const storageCustomerCompareId = storage.getRawItem('customer_compare_id');
    const customerCompareIdParsed = JSON.parse(storageCustomerCompareId);
    const customerCompareId = customerCompareIdParsed?.value.replaceAll(
        '"',
        ''
    );

    const [
        addProductToCompare,
        {
            data: addProductData,
            error: errorAddingProduct,
            loading: isAddingProduct
        }
    ] = useMutation(addProductToCompareMutation);

    const [
        createCompareList,
        {
            data: createCompareListResult,
            error: errorCreateCompareList,
            loading: isCreatingCompareList
        }
    ] = useMutation(createCompareListMutation);

    const { formatMessage } = useIntl();
    const [{ isSignedIn }] = useUserContext();

    const handleClick = useCallback(async () => {
        if (!compareId && !customerCompareId) {
            try {
                await createCompareList({
                    variables: {
                        input: {
                            products: []
                        }
                    }
                }).then(result => {
                    const uid = result.data.createCompareList.uid;
                    !isSignedIn
                        ? storage.setItem('compare_id', uid)
                        : storage.setItem('customer_compare_id', uid);
                    addProductToCompare({
                        variables: {
                            input: {
                                uid: uid,
                                products: [item.id]
                            }
                        },
                        refetchQueries: [
                            !isSignedIn
                                ? {
                                      query: getCompareQuery,
                                      variables: {
                                          uid: uid
                                      }
                                  }
                                : {
                                      query: getCustomerCompareQuery
                                  }
                        ],
                        awaitRefetchQueries: true
                    });
                });
            } catch (error) {
                console.error(error);
            }
        } else {
            try {
                if (beforeAdd) {
                    await beforeAdd();
                }

                await addProductToCompare({
                    variables: {
                        input: {
                            uid: customerCompareId || compareId,
                            products: [item.id]
                        }
                    },
                    refetchQueries: [
                        !isSignedIn
                            ? {
                                  query: getCompareQuery,
                                  variables: {
                                      uid: customerCompareId || compareId
                                  }
                              }
                            : {
                                  query: getCustomerCompareQuery
                              }
                    ],
                    awaitRefetchQueries: true
                });
                if (afterAdd) {
                    afterAdd();
                }
            } catch (error) {
                console.error(error);
            }
        }
    }, [
        addProductToCompare,
        afterAdd,
        beforeAdd,
        compareId,
        createCompareList,
        customerCompareId,
        getCompareQuery,
        getCustomerCompareQuery,
        isSignedIn,
        item.id
    ]);

    const compareProducts = compareList?.map(item => item.product.id);

    const isSelected = useMemo(() => {
        if (item.id) {
            return compareProducts?.includes(item.id);
        }
        return null;
    }, [compareProducts, item.id]);

    const buttonProps = useMemo(
        () => ({
            'aria-label': formatMessage({
                id: 'wishlistButton.addText',
                defaultMessage: 'Add to Favorites'
            }),
            onClick: isSelected
                ? () => history.push('/catalog/compare')
                : handleClick,
            type: 'button'
        }),
        [formatMessage, handleClick, history, isSelected]
    );

    return {
        buttonProps,
        buttonText: props.buttonText,
        handleClick,
        isSelected,
        loading: isAddingProduct || isCreatingCompareList
    };
};
