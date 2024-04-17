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
  isSubmitSuccessful?: boolean
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
    isSubmitSuccessful,
    style = {},
    labelStyle = {},
    border = true,
    render
  } = props



  return (
    <View key={name} style={style} >
      {/* 错误消息 */}
      <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
        <Text>  </Text>
        {rules && errors && errors?.message && (
          <View style={{ flexDirection: 'row', display: 'flex' }} >
            <Text style={{ color: 'red', display: 'flex' }}>
              {errors?.message}   {/* 错误消息 */}
            </Text>
          </View>
        )}
      </View>
      {/* 实际内容 */}
      <View style={style} >
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={render}  //渲染内容从这里传进来
        />
      </View>
    </View>
  )
}

export default FormItem
