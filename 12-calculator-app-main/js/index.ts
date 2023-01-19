import {interpret} from "xstate"
import {calcMachine, isOperator, isUnsignedDigit as isDigit, isNumeric} from "./machine"
import {initRovingTabIndex} from "./toolbar"

initRovingTabIndex()

const themeSwitch = document.querySelectorAll<HTMLInputElement>("input[name='themeSwitch']")

const THEME_STORAGE_KEY = "calculator-app-theme"

themeSwitch.forEach((radio) => {
	radio.addEventListener("change", () => {
		document.documentElement.dataset.theme = radio.value
		localStorage.setItem(THEME_STORAGE_KEY, radio.value)
	})

	// Get theme from localstorage
	const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
	if (savedTheme === radio.value) {
		radio.checked = true
		// Remember: setting the above programmatically doesn't trigger a change event.
		document.documentElement.dataset.theme = radio.value
	}
})

// Actual calc stuff starts here

const calcService = interpret(calcMachine).start()

const display = document.querySelector("output")!
calcService.onTransition((state) => {
	if (!state.history || state.changed) {
		display.value = state.context.tokens
			// format numbers
			.map((token) => (isNumeric(token) ? formatNumStr(token) : token))
			// format multiplication signs
			.map((token) => (token === "*" ? "×" : token))
			.join(" ")

		console.log(
			`State '${state.toStrings().join(" ")}'. Tokens ${JSON.stringify(state.context.tokens)}`
		)

		/**
		 * Determine if the current state rejects an event of a given type.
		 * A state 'rejects' an event if the event can't cause a transition from the state.
		 * @param eventType
		 */
		function rejectsEvent(eventType: string) {
			const {nextEvents} = state
			return nextEvents.every((e) => e !== eventType)

			// I later learnt that XState has state.can(), so I don't really need this function.
			// However, I'm keeping it because for events that have data, I would have to do something
			// like state.can({ type: "OPERATOR", data: "+" }), which is a little bit tedious.
		}

		// Disable buttons with aria-disabled so they remain perceivable (i.e. focusable)
		// const solveBtn = document.querySelector<HTMLButtonElement>("[data-solve-btn]")!
		// solveBtn.setAttribute("aria-disabled", rejectsEvent("SOLVE").toString())

		// const deleteBtn = document.querySelector<HTMLButtonElement>("[data-delete-btn]")!
		// deleteBtn.setAttribute("aria-disabled", rejectsEvent("DELETE").toString())

		// const decimalPointBtn = document.querySelector<HTMLButtonElement>("[data-decimal-point-btn]")!
		// decimalPointBtn.setAttribute("aria-disabled", rejectsEvent("DECIMAL_POINT").toString())

		// const operatorBtns = document.querySelectorAll<HTMLButtonElement>("[data-operator-btn]")
		// operatorBtns.forEach((btn) => {
		// 	btn.setAttribute("aria-disabled", rejectsEvent("OPERATOR").toString())
		// })
	}
})

// Handle key clicks
const keyEls = document.querySelectorAll<HTMLButtonElement>(".Key")
keyEls.forEach((keyEl) => {
	keyEl.addEventListener("click", (e) => {
		e.preventDefault()
		const key = keyEl.dataset.keyshortcuts!
		handleKey(key)
	})
})

// Handle key keyboard shorcuts.
// Listen for 'keydown' not 'keyup', so that a user can press
// and hold a key to type it repeatedly.
document.body.addEventListener("keydown", (e) => {
	const target = e.target as HTMLElement

	if (target.matches("input[type=radio]")) return

	// Don't handle Enter key when pressed on a button
	// so that it doesn't interfere with the default behaviour.
	// (The default behaviour is to activate the button.)
	// I must admit though that, because of this, the UX feels weird.
	if (!target.matches("button") || (target.matches("button") && e.key !== "Enter")) {
		handleKey(e.key)
	}
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
		console.warn("Unhandled key", key)
	}
}

/**
 * Format a numeric string into a comma-separated one.
 */
function formatNumStr(numStr: string) {
	const sign = numStr.startsWith("-") ? "-" : ""
	const numericPart = sign ? numStr.slice(1) : numStr
	const [intPart, fractionPart] = numericPart.split(".")

	let formatted = formatIntStr(intPart!)
	if (fractionPart !== undefined) {
		formatted += "." + fractionPart
	}
	formatted = sign + formatted

	return formatted
}

/**
 * Format an (unsigned) integral string into a comma-separated one.
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
