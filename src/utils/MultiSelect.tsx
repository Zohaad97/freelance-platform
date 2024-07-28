import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import OutlinedInput from '@mui/material/OutlinedInput'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import * as React from 'react'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

export default function MultipleSelectCheckmarks(props: {
  isDisabled?: boolean
  width?: number | string
  data: Array<string>
  label: string
  onSelectionChange?: (value: string[]) => void
}) {
  const [selectedValue, setSelectedValue] = React.useState<string[]>([])

  const handleChange = (event: SelectChangeEvent<typeof selectedValue>) => {
    const {
      target: { value },
    } = event
    const newSelectedValue = typeof value === 'string' ? value.split(',') : value
    setSelectedValue(newSelectedValue)
    if (props.onSelectionChange) {
      props.onSelectionChange(newSelectedValue)
    }
  }

  return (
    <div>
      <FormControl
        fullWidth
        variant="outlined"
        margin="normal"
        style={{ width: props.width || '100%' }}
      >
        <InputLabel shrink>{props.label}</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox-disabled"
          multiple
          disabled={props.isDisabled}
          value={selectedValue}
          onChange={handleChange}
          input={<OutlinedInput label="Tag" />}
          renderValue={selected => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {props &&
            props.data.map(item => (
              <MenuItem key={item} value={item}>
                <Checkbox checked={selectedValue.indexOf(item) > -1} />
                <ListItemText primary={item} />
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </div>
  )
}
