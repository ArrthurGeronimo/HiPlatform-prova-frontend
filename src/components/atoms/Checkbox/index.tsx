import { Box, CheckboxProps } from '@chakra-ui/react'

interface CheckboxCustomProps extends CheckboxProps {
  indeterminate: boolean
}

export default function Checkbox({
  onChange,
  checked,
  indeterminate,
}: CheckboxCustomProps) {
  return (
    <Box
      as="input"
      type="checkbox"
      cursor="pointer"
      mr={1}
      mb="3px"
      checked={checked}
      ref={(el) => el && (el.indeterminate = indeterminate)}
      onChange={onChange}
    />
  )
}
