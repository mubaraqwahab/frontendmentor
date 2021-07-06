import { createMachine, interpret, assign } from "xstate"
import * as disclosure from "../../shared/disclosure"

disclosure.initializeAll()

const assignURL = assign({
	url: (context, event) => event.target.value,
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

const invokeShortenURL = (context) => shortenURL(context.url)

async function shortenURL(url) {
	const response = await fetch(
		`https://api.shrtco.de/v2/shorten?url=${encodeURIComponent(url)}`
	)

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
				id: "shortenURL",
				src: invokeShortenURL,
				onDone: {
					actions: (context, event) => console.log("Success", event.data),
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
