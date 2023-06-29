import { DateRange } from 'react-date-range'

import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

const DatePicker = ({value, handleSelect}) => {
  return (
    <DateRange
      rangeColors={['#F43F5E']}
      date={new Date()}
      direction='vertical'
      showDateDisplay={false}
      minDate={value.startDate}
      maxDate={value.endDate}
      ranges={[value]}
      onChange={handleSelect}
    />
  )
}

export default DatePicker
