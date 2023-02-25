import {interpret} from "xstate"
import {
	calcMachine,
	type Operator as NormalOperator,
	isOperator as isNormalOperator,
	isUnsignedDigit as isDigit,
	isNumeric,
} from "./machine"
import {initThemeSwitch} from "./theme-switch"
import {initRovingTabIndex} from "./toolbar"

initThemeSwitch()
initRovingTabIndex()

const calcService = interpret(calcMachine).start()

// Handle button clicks.
const buttons = document.querySelectorAll<HTMLButtonElement>(".Button")
buttons.forEach((button) => {
	button.addEventListener("click", () => {
		const text = button.textContent!.trim().toUpperCase()
		handleCalcInput(text)
	})
})

// Handle keyboard presses (including shortcuts).
// Listen for 'keydown' not 'keyup', so that a user can press
// and hold a key to type it repeatedly.
document.body.addEventListener("keydown", (e) => {
	const target = e.target as HTMLElement

	if (target.matches("input[type=radio]")) return

	// Don't handle the Enter key when it's pressed on a button,
	// to avoid interfering with the default button-Enter behaviour,
	// which is to activate the button. I must admit that, because
	// of this, the UX feels a little weird.
	if (!target.matches("button") || (target.matches("button") && e.key !== "Enter")) {
		handleCalcInput(e.key)
	}
})

// Sync the display with the machine.
const display = document.querySelector(".Display")!
calcService.onTransition((state) => {
	if (!state.changed) return

	display.textContent = state.context.tokens
		// format numbers and operators
		.map((token) => {
			if (isNumeric(token)) return formatNumStr(token)
			if (isOperator(token)) return formatOperator(token)
			return token
		})
		.join(" ")

	console.log(`State '${state.toStrings().at(-1)}'. Tokens ${JSON.stringify(state.context.tokens)}`)
})

/* HELPERS */

/** Handle a (button or keyboard) calculator input */
function handleCalcInput(input: string) {
	if (isDigit(input)) {
		calcService.send({type: "DIGIT", data: input})
	} else if (isOperator(input)) {
		calcService.send({type: "OPERATOR", data: normalizeOperator(input)})
	} else if (input === ".") {
		calcService.send({type: "DECIMAL_POINT"})
	} else if (input === "=" || input === "Enter") {
		calcService.send({type: "SOLVE"})
	} else if (input === "DEL" || input === "Backspace") {
		calcService.send({type: "DELETE"})
	} else if (input === "RESET" || input === "Delete") {
		calcService.send({type: "RESET"})
	} else {
		console.warn("Unhandled input", input)
	}
}

// The 'fancy' operators are displayed on the UI,
// while the 'normal' ones are used by the machine.
type Operator = NormalOperator | FancyOperator

const FANCY_OPERATORS = ["×", "−"] as const
type FancyOperator = typeof FANCY_OPERATORS[number]

function isOperator(str: string): str is Operator {
	// @ts-ignore
	return isNormalOperator(str) || FANCY_OPERATORS.includes(str)
}

/**
 * Convert a fancy operator to a normal one.
 * But return a normal one as is.
 */
function normalizeOperator(op: Operator) {
	if (op === "×") return "*"
	if (op === "−") return "-"
	return op
}

/**
 * Format a normal operator into a fancy one.
 * But return a fancy one as is.
 */
function formatOperator(op: Operator) {
	if (op === "*") return "×"
	if (op === "-") return "−"
	return op
}

/**
 * Format a numeric string into a comma-separated one.
 * (This doesn't comma-separate the fraction part, if any)
 */
function formatNumStr(numStr: `${number}`) {
	const sign = numStr.startsWith("-") ? "-" : ""
	const numericPart = sign ? numStr.slice(1) : numStr
	const [intPart, fractionPart] = numericPart.split(".")

	let formatted = formatUnsignedIntStr(intPart!)
	if (fractionPart !== undefined) {
		formatted += "." + fractionPart
	}
	formatted = sign + formatted

	return formatted
}

/**
 * Format an unsigned integral string into a comma-separated one.
 */
function formatUnsignedIntStr(intStr: string) {
	let formatted = ""
	const len = intStr.length
	for (let i = 1; i <= len; i++) {
		const nextDigit = intStr[len - i]
		// Add a comma if i is a multiple of 3 and there's more digits in front
		formatted = (i % 3 === 0 && i < len ? "," : "") + nextDigit + formatted
	}
	return formatted
}
