// @ts-check

import { createMachine, interpret, assign } from "xstate"
import * as disclosure from "../../shared/disclosure"

disclosure.initializeAll()

const assignURL = assign({
	url: (context, event) => event.target.value,
})

const assignResults = assign({
	results: (context, event) => {
		return [event.data, ...context.results.slice(0, 2)]
	},
})

const hasInput = (context) => !!context.url

const isValidURL = (context) => {
	try {
		new URL(context.url)
		return true
	} catch {
		return false
	}
}

const shortenURL = async (context) => {
	const endpoint =
		"https://api.shrtco.de/v2/shorten?url=" + encodeURIComponent(context.url)

	const response = await fetch(endpoint)

	/**
	 * @type {import("./types").ShrtCodeAPIResponse}
	 */
	const data = await response.json()

	if (data.ok) {
		return {
			shortURL: data.result.short_link,
			fullShortURL: data.result.full_short_link,
			originalURL: data.result.original_link,
		}
	} else {
		throw new Error("Failed to shorten. Error code " + data.error_code)
	}
}

const urlShortenerMachine = createMachine({
	id: "urlShortener",
	initial: "idle",
	context: {
		url: "",
		results: [],
	},
	states: {
		idle: {
			on: {
				input: "inputted",
				submit: "invalid",
			},
		},
		inputted: {
			entry: assignURL,
			always: [{ target: "nonemptyURL", cond: hasInput }, { target: "idle" }],
		},
		invalid: {
			on: {
				input: "inputted",
			},
		},
		nonemptyURL: {
			on: {
				input: "inputted",
				submit: "shortening",
			},
		},
		shortening: {
			invoke: {
				src: shortenURL,
				onDone: {
					actions: [assignResults /* TODO */],
				},
				onError: {
					actions: (context, event) => console.log("Failure", event.data),
				},
			},
		},
	},
})

const form = document.querySelector("form")
form.noValidate = true

/** @type {HTMLInputElement} */
const urlInput = form.elements.namedItem("url")

const service = interpret(urlShortenerMachine)

service.onTransition((state) => {
	if (state.changed) {
		console.log(state.toStrings().join(" "))

		form.dataset.state = state.toStrings().join(" ")
	}
})

service.start()

form.addEventListener("submit", (e) => {
	e.preventDefault()
	service.send(e)
})

urlInput.addEventListener("input", (e) => {
	service.send(e)
})
