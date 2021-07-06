// @ts-check

import { createMachine, interpret } from "xstate"
import * as disclosure from "../../shared/disclosure"

disclosure.initializeAll()

const urlShortenerMachine = createMachine({
	id: "urlShortener",
	initial: "idle",
	context: {},
	states: {
		idle: {},
	},
})

const form = document.querySelector("form")
form.noValidate = true

// prettier-ignore
const urlInput = /** @type {HTMLInputElement} */ (form.elements.namedItem("url"))

const service = interpret(urlShortenerMachine)

service.onTransition((state) => {})

service.start()

form.addEventListener("submit", (e) => {
	e.preventDefault()
})

urlInput.addEventListener("input", (e) => {})
