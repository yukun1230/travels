import React from 'react'
import {
  Controller,
  ControllerProps,
  FieldValues,
  UseControllerProps,
  GlobalError,
  FieldPath
} from 'react-hook-form'

import { TextStyle, View, Text, ViewStyle } from 'react-native'

type FormItemProps<T extends FieldValues, TName extends FieldPath<T>> = {
  label?: string
  required?: boolean
  errors?: GlobalError
  style?: ViewStyle
  labelStyle?: TextStyle
  border?: boolean
} & ControllerProps<T, TName> &
  UseControllerProps<T, TName>

const FormItem = <T extends FieldValues, TName extends FieldPath<T>>(
  props: FormItemProps<T, TName>
) => {
  const {
    name,
    control,
    rules,
    label,
    required,
    errors,
    style = {},
    labelStyle = {},
    border = true,
    render
  } = props

  return (
    <View key={name} style={style}>
      {label && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: "space-between",
            marginTop: 5
          }}
        >
          <Text
            style={{
              fontSize: 20,
              marginBottom: 5,
              fontWeight: '700',
              ...labelStyle
            }}
          >
            {label}
          </Text>
          {rules && errors && errors?.message && (
            <View style={{ flexDirection: 'row', display: 'flex' }} >
              <Text
                style={{
                  color: 'red'
                }}
              >
                {errors?.message}
              </Text>
            </View>
          )}
        </View>
      )}
      <View
        style={{
          height: 40,
          borderWidth: 1,
          ...(!errors
            ? {
              borderColor: border ? '#B3BAC1' : 'transparent'
            }
            : {
              borderColor: border ? '#D52D0B' : 'transparent'
            })
        }}
      >
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={render}
        />
      </View>
    </View>
  )
}

export default FormItem
