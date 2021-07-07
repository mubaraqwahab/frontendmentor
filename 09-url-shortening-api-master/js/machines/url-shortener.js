// @ts-check

import { assign, send } from "xstate"

/* Actions */

const assignURL = assign({
	url: (context, event) => event.target.value,
})

const assignResults = assign({
	results: (context, event) => {
		return [event.data, ...context.results.slice(0, 2)]
	},
})

const resetURL = send({
	type: "input",
	target: {
		value: "",
	},
})

const saveResults = (context) => {
	try {
		sessionStorage.setItem("shortenedURLs", JSON.stringify(context.results))
	} catch {
		// noop
	}
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
	 * @type {import("../types").ShrtCodeAPIResponse}
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

/* Machines */

let initialResults
try {
	const resultsInStorage = sessionStorage.getItem("shortenedURLs")
	initialResults = JSON.parse(resultsInStorage) ?? []
} catch {
	initialResults = []
}

const urlShortenerMachineConfig = {
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
					entry: "showResults",
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
}

export default urlShortenerMachineConfig
