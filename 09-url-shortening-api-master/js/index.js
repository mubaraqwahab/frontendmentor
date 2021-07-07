// @ts-check

import { createMachine, interpret, assign, send } from "xstate"
import * as disclosure from "../../shared/disclosure"

disclosure.initializeAll()

const form = document.querySelector("form")
const urlInput = form.elements.namedItem("url")
const resultUL = document.querySelector("#shortenedURLList")
const resultTemplate = document.querySelector("#shortenedURLTemplate")
const resultTemplateHTML = resultTemplate.innerHTML

form.noValidate = true

/**
 * @typedef {object} ShrtCodeAPIResponse
 * @prop {boolean} ok
 * @prop {object} [result]
 * @prop {string} result.short_link
 * @prop {string} result.full_short_link
 * @prop {string} result.original_link
 * @prop {string} [error_code]
 */

/* URL Shortener Machine */

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
	// Mimick event.target.value
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

const showResults = (context) => {
	for (const result of context.results) {
		const resultHTML = resultTemplateHTML.replace(
			/{{ ([a-zA-Z]+) }}/g,
			(_, placeholder) => result[placeholder]
		)
		const resultLI = document.createElement("li")
		resultLI.innerHTML = resultHTML
		resultUL.appendChild(resultLI)
	}
}

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
	 * @type {ShrtCodeAPIResponse}
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

/* Copy Machine */

const copyShortURL = (context, event) => {
	return navigator.clipboard.writeText(event.value)
}

// TODO
const isDifferentCopy = (context, event) => true

const copyMachine = createMachine({
	id: "copy",
	initial: "idle",
	states: {
		idle: {
			on: {
				COPY: "copying",
			},
		},
		copying: {
			invoke: {
				src: copyShortURL,
				onDone: "copied",
				onError: "idle",
			},
			on: {
				COPY: {
					target: "copying",
					cond: isDifferentCopy,
				},
			},
		},
		copied: {
			on: {
				COPY: "copying",
			},
			after: {
				3000: "idle",
			},
		},
	},
})

const urlShortenerService = interpret(urlShortenerMachine)
const copyService = interpret(copyMachine)

urlShortenerService.onTransition((state) => {
	if (state.changed) {
		console.log(state.toStrings().join(" "))

		// The two go out of sync only when context.url is reset (e.g. in the resetURL action)
		if (urlInput.value !== state.context.url) {
			urlInput.value = state.context.url
		}

		form.dataset.state = state.toStrings().join(" ")
	}
})

copyService.onTransition((state) => {
	if (state.changed) {
		console.log(state.toStrings().join(" "))

		// const { event } = state
		// if (event.data) {
		// 	// Find the clicked copy button
		// 	const copyBtn = resultUL.querySelector(`button[data-copy="${event.data}"`)
		// 	copyBtn.dataset.state = state.toStrings().join(" ")
		// }
	}
})

// First time using MutationObserver!

const resultsObserver = new MutationObserver(function (mutations) {
	for (const mutation of mutations) {
		if (mutation.type === "childList") {
			// Add a copy handler to the copy button of each new result <li>
			mutation.addedNodes.forEach((resultLI) => {
				const copyBtn = resultLI.querySelector("button[data-copy]")

				// TODO: consider setting up the service for each button

				copyBtn.addEventListener("click", handleCopyBtnClick)
			})

			// Remove the copy handler from the copy button of the removed result <li>
			mutation.removedNodes.forEach((resultLI) => {
				const copyBtn = resultLI.querySelector("button[data-copy]")
				copyBtn.removeEventListener("click", handleCopyBtnClick)
			})
		}
	}
})

// Observe before starting shortener service
resultsObserver.observe(resultUL, { childList: true })

urlShortenerService.start()
copyService.start()

form.addEventListener("submit", (e) => {
	e.preventDefault()
	urlShortenerService.send(e)
})

urlInput.addEventListener("input", (e) => {
	urlShortenerService.send(e)
})

function handleCopyBtnClick(e) {
	const copyBtn = e.currentTarget
	copyService.send({ type: "COPY", value: copyBtn.dataset.copy })
}
