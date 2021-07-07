// @ts-check

import { createMachine, interpret } from "xstate"
import * as disclosure from "../../shared/disclosure"
import copyMachineConfig from "./machines/copy"
import urlShortenerMachineConfig from "./machines/url-shortener"

disclosure.initializeAll()

const form = document.querySelector("form")
const urlInput = form.elements.namedItem("url")
const resultUL = document.querySelector("#shortenedURLList")
const resultTemplate = document.querySelector("#shortenedURLTemplate")
const resultTemplateHTML = resultTemplate.innerHTML

form.noValidate = true

/* Machines */

const urlShortenerMachine = createMachine(urlShortenerMachineConfig, {
	actions: {
		showResults: (context) => {
			for (const result of context.results) {
				const resultHTML = resultTemplateHTML.replace(
					/{{ ([a-zA-Z]+) }}/g,
					(_, placeholder) => result[placeholder]
				)
				const resultLI = document.createElement("li")
				resultLI.innerHTML = resultHTML
				resultUL.appendChild(resultLI)
			}
		},
	},
})
const copyMachine = createMachine(copyMachineConfig)

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
