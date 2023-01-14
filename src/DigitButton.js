import React from 'react'
import { ACTIONS } from "./App";


function DigitButton({ dispatch, digit, className}) {
  return (
    <button className={className} onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload:  { digit } })}>
        {digit}
    </button>
  )
}

export default DigitButton