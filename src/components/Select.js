import React from 'react';
import { View } from 'react-native';
import SelectBox from 'react-native-multi-selectbox';

const Select = (props) => {
  const {
    searchPlaceholder,
    placeholder,
    options,
    onChange,
    value,
  } = props;

  return (
    <View style={{ margin: 30 }}>
      <SelectBox
        label={searchPlaceholder}
        inputPlaceholder={placeholder}
        listEmptyText="Nada encontrado"
        options={options}
        value={value}
        onChange={onChange}
        hideInputFilter={false}
        inputFilterStyle={{ fontSize: 15 }}
      />
    </View>
  );
}

export default Select
