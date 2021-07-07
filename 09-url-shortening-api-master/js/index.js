// @ts-check

import { createMachine, interpret, assign } from "xstate"
import * as disclosure from "../../shared/disclosure"

disclosure.initializeAll()

const form = document.querySelector("form")
const urlInput = form.elements.namedItem("url")
const resultUL = document.querySelector("#shortenedURLList")
const resultTemplate = document.querySelector("#shortenedURLTemplate")
const resultTemplateHTML = resultTemplate.innerHTML

form.noValidate = true

/* Actions */

const assignURL = assign({
	url: (context, event) => event.target.value,
})

const assignResults = assign({
	results: (context, event) => {
		return [event.data, ...context.results.slice(0, 2)]
	},
})

const resetURL = assign({ url: "" })

const saveResults = (context) => {
	try {
		sessionStorage.setItem("shortenedURLs", JSON.stringify(context.results))
	} catch {
		// noop
	}
}

const showResults = (context) => {
	let resultULHTML = ""
	for (const result of context.results) {
		const resultHTML = resultTemplateHTML.replace(
			/{{ ([a-zA-Z]+) }}/g,
			(_, placeholder) => result[placeholder]
		)
		const resultLIHTML = "<li>" + resultHTML + "</li>"
		resultULHTML += resultLIHTML
	}
	resultUL.innerHTML = resultULHTML
}

/* Guards */

const hasInput = (context) => !!context.url

const isValidURL = (context) => {
	try {
		new URL(context.url)
		return true
	} catch {
		return false
	}
}

/* Services */

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

/* Machine */

let initialResults
try {
	const resultsInStorage = sessionStorage.getItem("shortenedURLs")
	initialResults = JSON.parse(resultsInStorage) ?? []
} catch {
	initialResults = []
}

const urlShortenerMachine = createMachine({
	id: "urlShortener",
	type: "parallel",
	context: {
		url: "",
		results: initialResults,
	},
	states: {
		input: {
			initial: "empty",
			states: {
				empty: {
					on: {
						input: "changed",
					},
				},
				changed: {
					entry: assignURL,
					always: [{ target: "nonempty", cond: hasInput }, { target: "empty" }],
				},
				nonempty: {
					on: {
						input: "changed",
					},
				},
			},
		},
		shortener: {
			initial: "idle",
			states: {
				idle: {
					entry: showResults,
					on: {
						submit: "beforeSubmit",
					},
				},
				beforeSubmit: {
					always: [
						{ target: "shortening", cond: isValidURL },
						{ target: "invalid" },
					],
				},
				invalid: {
					on: {
						submit: "beforeSubmit",
					},
				},
				shortening: {
					invoke: {
						src: shortenURL,
						onDone: {
							target: "save",
							actions: [assignResults, resetURL],
						},
						onError: "failed",
					},
				},
				save: {
					entry: saveResults,
					always: "idle",
				},
				failed: {
					on: {
						submit: "beforeSubmit",
					},
				},
			},
		},
	},
})

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
