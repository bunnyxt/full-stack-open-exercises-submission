import { useState } from 'react'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue('')
  }

  const obj = {
    type,
    value,
    onChange
  }
  Object.defineProperty(obj, 'reset', {
    value: reset,
    enumerable: false
  });

  return obj
}