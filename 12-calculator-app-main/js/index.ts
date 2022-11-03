import {interpret, StateValue} from "xstate"
import {calcMachine} from "./machine"

const themeSwitch = document.querySelectorAll<HTMLInputElement>("input[name='themeSwitch']")
themeSwitch.forEach((radio) => {
	radio.addEventListener("change", () => {
		document.documentElement.dataset.theme = radio.value
	})
})

// Actual calc stuff starts here
const stack: Array<StackElement> = []
const calcService = interpret(calcMachine).start()

type StackElement = {
	value: StateValue
	context: typeof calcService.initialState.context
}

calcService.onTransition((state, event) => {
	if (!state.history || state.changed) {
		if (event.type === "SOLVE") {
			// Clear the stack
			stack.length = 0
		}
		stack.push({value: state.value, context: state.context})
		console.log(JSON.stringify(stack, null, 2))
	}
})

const outputEl = document.querySelector("output")!
calcService.onTransition((state) => {
	if (state.changed) {
		outputEl.textContent = state.context.input

		console.log("State", state.toStrings().join(" "))

		const {nextEvents} = state
		if (nextEvents.every((e) => e !== "SOLVE")) {
			// Disable solve button
		}
		if (nextEvents.every((e) => e !== "DECIMAL_POINT")) {
			// Disable decimal point button
		}
	}
})

// Handle key clicks
const keyEls = document.querySelectorAll<HTMLButtonElement>(".Key")
keyEls.forEach((keyEl) => {
	keyEl.addEventListener("click", (e) => {
		e.preventDefault()
		// TODO: get from aria-accesskey?
		const key = keyEl.textContent!.trim()
		console.log({key})
		if (isDigit(key)) {
			calcService.send({type: "DIGIT", data: key})
		} else if (isOperator(key)) {
			calcService.send({type: "OPERATOR", data: key})
		} else if (key === ".") {
			calcService.send({type: "DECIMAL_POINT"})
		} else if (key === "Reset") {
			calcService.send({type: "RESET"})
		} else if (key === "=") {
			calcService.send({type: "SOLVE"})
		}
	})
})

// Handle key keyboard shorcuts
document.body.addEventListener("keyup", (e) => {
	console.log("event key", e.key)
	const key = e.key
	if (isDigit(key)) {
		calcService.send({type: "DIGIT", data: key})
	} else if (isOperator(key) || key === "*") {
		calcService.send({type: "OPERATOR", data: key === "*" ? "×" : key})
	} else if (key === ".") {
		calcService.send({type: "DECIMAL_POINT"})
	} else if (key === "Enter") {
		calcService.send({type: "SOLVE"})
	}
})

function isDigit(str: string): str is `${number}` {
	const converted = +str
	return !Number.isNaN(converted)
}

const OPERATORS = ["+", "-", "×", "/"] as const

function isOperator(str: string): str is typeof OPERATORS[number] {
	// @ts-ignore (I don't get why TS is complaining about str 😕)
	return OPERATORS.includes(str)
}

/**
 * Format a numeric string into a comma-separated one.
 */
function formatNumStr(numStr: string) {
	let formatted = ""

	// TODO: what if the numstr begins with a sign or is a float?

	const len = numStr.length
	for (let i = 1; i <= len; i++) {
		const nextDigit = numStr[len - i]
		// Add a comma if i is a multiple of 3 and there's more digits in front
		formatted = (i % 3 === 0 && i < len ? "," : "") + nextDigit + formatted
	}

	return formatted
}
