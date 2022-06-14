import React from 'react';
import { func, number, oneOfType, shape, string } from 'prop-types';
import { useRegion } from '@magento/peregrine/lib/talons/Region/useRegion';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Field from '@magento/venia-ui/lib/components/Field';
import Select from '@magento/venia-ui/lib/components/Select';
import TextInput from '../TextInput';
import defaultClasses from './region.module.css';
import { GET_REGIONS_QUERY } from './region.gql';

/**
 * Form component for Region that is seeded with backend data.
 *
 * @param {string} props.optionValueKey - Key to use for returned option values. In a future release, this will be removed and hard-coded to use "id" once GraphQL has resolved MC-30886.
 */
const Region = props => {
    const {
        classes: propClasses,
        countryCodeField,
        fieldInput,
        fieldSelect,
        label,
        translationId,
        optionValueKey,
        ...inputProps
    } = props;

    const talonProps = useRegion({
        countryCodeField,
        fieldInput,
        fieldSelect,
        optionValueKey,
        queries: { getRegionsQuery: GET_REGIONS_QUERY }
    });
    const { loading, regions } = talonProps;

    const classes = useStyle(defaultClasses, propClasses);
    const regionProps = {
        classes,
        disabled: loading,
        ...inputProps
    };

    const regionField =
        regions.length || loading ? (
            <Select
                {...regionProps}
                field={fieldSelect}
                id={classes.root}
                items={regions}
            />
        ) : (
            <TextInput {...regionProps} field={fieldInput} id={classes.root} />
        );

    return (
        <Field
            id={classes.root}
            label="Province"
            classes={{ root: classes.root }}
        >
            {regionField}
        </Field>
    );
};

export default Region;

Region.defaultProps = {
    countryCodeField: 'country',
    fieldInput: 'region',
    fieldSelect: 'region',
    label: 'State',
    translationId: 'region.label',
    optionValueKey: 'code'
};

Region.propTypes = {
    classes: shape({
        root: string
    }),
    countryCodeField: string,
    fieldInput: string,
    fieldSelect: string,
    label: string,
    translationId: string,
    optionValueKey: string,
    validate: func,
    initialValue: oneOfType([number, string])
};
