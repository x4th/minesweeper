import React from 'react'

import './NumberDisplay.scss'

interface NumberDisplayProps {
  value: number
}

const NumberDisplay: React.FC<NumberDisplayProps> = ({ value }) => {
  let displayValue
  if (value >= 0) {
    displayValue = value.toString().padStart(3, '0')
  } else {
    displayValue = `-${Math.abs(value).toString().padStart(2, '0')}`
  }
  return (
    <div className='NumberDisplay'>
      {displayValue}
    </div>
    )
}

export default NumberDisplay
