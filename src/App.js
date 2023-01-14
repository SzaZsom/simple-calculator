import { useReducer } from "react";
import"./styles.css";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";


const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CLEAR: "clear",
  DELETE_DIGIT: "delete",
  CHOOSE_OPERATION: "choose-operation",
  EVALUATE: "evaluate"

}

function reducer (state, { type, payload }) {
  switch(type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }
      if(payload.digit === "0" && state.currentOperand === "0") {
        return state
      }
      if(payload.digit === "." && state.currentOperand == null) {
        return {}
      }
      if(payload.digit === "." && state.currentOperand.includes(".")) {
        return state
      }

    return {
      ...state,
      currentOperand: `${state.currentOperand || ""}${payload.digit}`,
    };
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state
      }
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        }
      }

      if (state.previousOperand == null ) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        }
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null
      }
      
    case ACTIONS.CLEAR:
      return{}
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null
        }
      }
      if (state.currentOperand == null) {
        return state
      }
      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null
        }
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      }
    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state
      }
      return {
        ...state,
        previousOperand: null,
        overwrite: true,
        currentOperand: evaluate(state),
        operation: null
      }
      
  }

}

function evaluate({ currentOperand, previousOperand, operation}) {
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if (isNaN(prev) || isNaN(current)) return ""
  let computation = ""
  switch (operation) {
    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current
      break
    case "*":
      computation = prev * current
      break
    case "÷":
      computation = prev / current
      break
  }
  return computation.toString()
}

const INTEGER_FORMATTER =  new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})

function formatOperand (operand) {
  if (operand == null) {
    return
  }
  const [integer, decimal] =operand.split(".")
  if (decimal == null) { return INTEGER_FORMATTER.format(integer) }
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
  const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer, {});

  return (
    <div className="calculator">
      <div className="calculator-grid">
        <div className='output'>
          <div className='previous-operand'>{formatOperand(previousOperand)} {operation}</div>
          <div className='current-operand'>{formatOperand(currentOperand)}</div>
        </div>
        <button className='btn gray span-two' onClick={() => dispatch({ type: ACTIONS.CLEAR })}>C</button>
        <button className='btn gray del' onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT})}>Del</button>
        <OperationButton className="btn orange" operation="÷" dispatch={dispatch} />
        <DigitButton className="btn number" digit="7" dispatch={dispatch} />
        <DigitButton className="btn number" digit="8" dispatch={dispatch} />
        <DigitButton className="btn number" digit="9" dispatch={dispatch} />
        <OperationButton className="btn orange" operation="*" dispatch={dispatch} />
        <DigitButton className="btn number" digit="4" dispatch={dispatch} />
        <DigitButton className="btn number" digit="5" dispatch={dispatch} />
        <DigitButton className="btn number" digit="6" dispatch={dispatch} />
        <OperationButton className="btn orange" operation="-" dispatch={dispatch} />
        <DigitButton className="btn number" digit="1" dispatch={dispatch} />
        <DigitButton className="btn number" digit="2" dispatch={dispatch} />
        <DigitButton className="btn number" digit="3" dispatch={dispatch} />
        <OperationButton className="btn orange" operation="+" dispatch={dispatch} />
        <DigitButton className="btn number span-two" digit="0" dispatch={dispatch} />
        <DigitButton className="btn number" digit="." dispatch={dispatch} />
        <button className="btn orange" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
      </div>
    </div>
  );
}

export { ACTIONS };
export default App;
