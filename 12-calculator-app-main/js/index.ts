import {interpret} from "xstate"
import {calcMachine, isOperator, isDigit, isNumeric} from "./machine"

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
		outputEl.textContent = state.context.tokens
			// format numbers
			.map((token) => (isNumeric(token) ? formatNumStr(token) : token))
			// format multiplication signs
			.map((token) => (token === "*" ? "×" : token))
			.join("")

		console.log(
			`State '${state.toStrings().join(" ")}'. Input ${JSON.stringify(state.context.tokens)}`
		)

		// TODO: is it good/bad UX to disable?
		// const {nextEvents} = state
		// const solveBtn = document.querySelector<HTMLButtonElement>("[data-solve-btn]")
		// solveBtn.disabled = nextEvents.every((e) => e !== "SOLVE")

		// const decimalPointBtn = document.querySelector<HTMLButtonElement>("[data-decimal-point-btn]")
		// decimalPointBtn.disabled = nextEvents.every((e) => e !== "DECIMAL_POINT")

		// const operatorBtns = document.querySelectorAll<HTMLButtonElement>("[data-operator-btn]")
		// operatorBtns.forEach((btn) => {
		// 	btn.disabled = nextEvents.every((e) => e !== "OPERATOR")
		// })
	}
})

// Handle key clicks
const keyEls = document.querySelectorAll<HTMLButtonElement>(".Key")
keyEls.forEach((keyEl) => {
	keyEl.addEventListener("click", (e) => {
		e.preventDefault()
		const key = keyEl.getAttribute("aria-keyshortcuts")!
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
	} else if (isOperator(key) || key === "Plus") {
		calcService.send({type: "OPERATOR", data: key === "Plus" ? "+" : key})
	} else if (key === ".") {
		calcService.send({type: "DECIMAL_POINT"})
	} else if (key === "Delete") {
		calcService.send({type: "RESET"})
	} else if (key === "=" || key === "Enter") {
		calcService.send({type: "SOLVE"})
	} else if (key === "Backspace") {
		calcService.send({type: "DELETE"})
	} else {
		console.error("Unknown key", key)
	}
}

/**
 * Format a numeric string into a comma-separated one.
 */
function formatNumStr(numStr: string) {
	const [intPart, fractionPart] = numStr.split(".")

	let formatted = formatIntStr(intPart!)
	if (fractionPart !== undefined) {
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
