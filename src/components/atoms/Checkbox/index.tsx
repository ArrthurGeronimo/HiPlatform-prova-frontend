import { Box } from '@chakra-ui/react'

export default function Checkbox({ onChange, checked, indeterminate }) {
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
