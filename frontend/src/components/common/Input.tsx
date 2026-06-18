import {
  Input as AntInput,
  type InputProps,
} from 'antd'
import type { ComponentProps } from 'react'

export function Input(props: InputProps) {
  return <AntInput {...props} />
}

type TextAreaProps = ComponentProps<typeof AntInput.TextArea>
type PasswordProps = ComponentProps<typeof AntInput.Password>

function TextArea(props: TextAreaProps) {
  return <AntInput.TextArea {...props} />
}

function Password(props: PasswordProps) {
  return <AntInput.Password {...props} />
}

Input.TextArea = TextArea
Input.Password = Password

export { TextArea, Password }
