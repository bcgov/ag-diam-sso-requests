// @ts-nocheck
import React, { useState } from 'react';

function getValue(inputType) {
  switch (inputType) {
    case 'checkbox':
      return 'checked';
    case 'file':
      return 'files';
    default:
      return 'value';
  }
}

const Wrapper = (Component, inputType: string = '') => {
  const valueKey = getValue(inputType);
  return (props) => {
    const { value, onChange, label, schema, options, required, disabled } = props;
    const { name = label, pattern, minLength, maxLength, id } = schema;
    const { enumOptions = [] } = options;
    const formProps = {
      onChange: (e) => {
        let value = e.target[valueKey];
        if (value === '') value = undefined;
        if (value === 'true') value = true;
        if (value === 'false') value = false;
        onChange(value);
      },
      label,
      name,
      maxLength,
      id,
      required,
      disabled,
      minLength,
      type: inputType,
      pattern,
      value: value || undefined,
      checked: typeof value === 'undefined' ? false : value,
    };
    if (inputType === 'file') {
      delete formProps.value;
    }

    if (inputType === 'checkbox') {
      formProps.value = true;
    }

    if (inputType === 'radio') {
      return (
        <div>
          {enumOptions.map((option) => (
            <Component
              key={option.value}
              {...formProps}
              label={option.label}
              value={option.value}
              checked={option.value === value}
              style={{ padding: '2px 0' }}
              size="small"
            />
          ))}
        </div>
      );
    }
    return (
      <Component {...formProps} fullWidth>
        {enumOptions &&
          enumOptions.map(({ value, label }) => {
            return (
              <option key={value} value={value}>
                {label}
              </option>
            );
          })}
      </Component>
    );
  };
};

export default Wrapper;
