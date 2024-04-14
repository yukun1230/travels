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
        {/* 错误消息 */}
        <View
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'center',
            // marginTop: 5
          }}
        >
          <Text> </Text>
          {rules && errors && errors?.message && (
            <View style={{ flexDirection: 'row', display: 'flex' }} >
              <Text
                style={{
                  color: 'red',
                  display:'flex'
                }}
              >
                {errors?.message}
              </Text>
            </View>
          )}
        </View>
      <View
        style={style}
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
