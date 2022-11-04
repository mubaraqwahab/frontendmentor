import {interpret} from "xstate"
import {calcMachine, isDigit, isNumeric, isOperator} from "./machine"

const themeSwitch = document.querySelectorAll<HTMLInputElement>("input[name='themeSwitch']")
themeSwitch.forEach((radio) => {
	radio.addEventListener("change", () => {
		document.documentElement.dataset.theme = radio.value
	})
})

// Actual calc stuff starts here

const calcService = interpret(calcMachine).start()

const outputEl = document.querySelector("output")!
calcService.onTransition((state) => {
	if (state.changed) {
		outputEl.textContent = state.context.input
			.map((item) => (isNumeric(item) ? formatNumStr(item) : item))
			.join("")

		console.log(
			`State '${state.toStrings().join(" ")}'. Input ${JSON.stringify(state.context.input)}`
		)

		const {nextEvents} = state
		if (nextEvents.every((e) => e !== "SOLVE")) {
			// TODO: Disable solve button
		}
		if (nextEvents.every((e) => e !== "DECIMAL_POINT")) {
			// TODO: Disable decimal point button
		}
	}
})

// Handle key clicks
const keyEls = document.querySelectorAll<HTMLButtonElement>(".Key")
keyEls.forEach((keyEl) => {
	keyEl.addEventListener("click", (e) => {
		e.preventDefault()
		// TODO: get from aria-accesskey?
		const key = keyEl.textContent!.trim().toUpperCase()
		handleKey(key)
		// TODO: is this below a good idea?
		outputEl.focus()
	})
})

// Handle key keyboard shorcuts
outputEl.addEventListener("keyup", (e) => {
	handleKey(e.key)
})

function handleKey(key: string) {
	if (isDigit(key)) {
		calcService.send({type: "DIGIT", data: key})
	} else if (isOperator(key) || key === "*") {
		calcService.send({type: "OPERATOR", data: key === "*" ? "×" : key})
	} else if (key === ".") {
		calcService.send({type: "DECIMAL_POINT"})
	} else if (key === "RESET" || key === "Reset") {
		// TODO: there's no such key as Reset
		calcService.send({type: "RESET"})
	} else if (key === "=" || key === "Enter") {
		calcService.send({type: "SOLVE"})
	} else if (key === "DEL" || key === "Backspace" || key === "Delete") {
		calcService.send({type: "DELETE"})
	}
}

/**
 * Format a numeric string into a comma-separated one.
 */
function formatNumStr(numStr: string) {
	// Expect nums like '123.', but not '.123'
	// And treat '123', '123.', and '123.0' differently

	const [intPart, fractionPart] = numStr.split(".")

	let formatted = formatIntStr(intPart!)
	if (fractionPart !== undefined) {
		// TODO: How to format fraction part?
		formatted += "." + fractionPart
	}

	return formatted
}

/**
 * Format an integral string into a comma-separated one.
 */
function formatIntStr(intStr: string) {
	let formatted = ""
	const len = intStr.length
	for (let i = 1; i <= len; i++) {
		const nextDigit = intStr[len - i]
		// Add a comma if i is a multiple of 3 and there's more digits in front
		formatted = (i % 3 === 0 && i < len ? "," : "") + nextDigit + formatted
	}
	return formatted
}
