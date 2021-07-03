import { createMachine, interpret } from "xstate"
import type { ShortenedURLResult, ShrtCodeAPIResponse } from "./types"

export interface URLShortenerContext {}

export type URLShortenerEvent = Event | { type: "COPY"; url: string }

export type URLShortenerState =
	| { value: "idle"; context: URLShortenerContext }
	| { value: "shortening"; context: URLShortenerContext }

const urlShortenerMachine = createMachine<
	URLShortenerContext,
	URLShortenerEvent,
	URLShortenerState
>(
	{
		id: "urlShortener",
		initial: "idle",
		context: {},
		states: {
			idle: {
				on: {
					input: {
						actions: "onInput",
					},
					submit: [
						{ target: "shortening", cond: "isValidURL" },
						{ actions: "onInvalid" },
					],
					COPY: {
						cond: "hasResults",
						actions: "onCopy",
					},
				},
			},
			shortening: {
				entry: "onSubmit",
				invoke: {
					id: "shortenURL",
					src: "shortenURL",
					onDone: {
						actions: "onShortened",
						target: "idle",
					},
					onError: {
						actions: "onFail",
						target: "idle",
					},
				},
			},
		},
	},
	{
		actions: {
			onInput(_, event) {
				const urlInput = (event as Event).target as HTMLInputElement

				// Find the input's associated pseudo-label
				const urlLabel = urlInput.form?.querySelector("[data-label-for='url']")

				// Hide the pseudo-label if the input has a value
				if (urlInput.value) {
					urlLabel?.classList.add("sr-only")
				} else {
					urlLabel?.classList.remove("sr-only")
				}
			},

			onSubmit(_, event) {
				const form = (event as Event).target as HTMLFormElement
				form.dataset.state = "shortening"
			},

			onInvalid(_, event) {
				const form = (event as Event).target as HTMLFormElement
				form.dataset.state = "invalid"
			},

			onShortened(_, event) {
				console.log({ _, event })
				// const form = (event as Event).target as HTMLFormElement
				// form.dataset.state = ""
			},

			onFail() {
				// TODO: Continue from here
				// const form = (event as Event).target as HTMLFormElement
				// form.dataset.state = "failed"
			},

			onCopy() {},
		},

		guards: {
			isValidURL(_, event) {
				const form = (event as Event).target as HTMLFormElement
				return form.checkValidity()
			},

			hasResults() {
				return true
			},
		},

		services: {
			shortenURL(_, event): Promise<ShortenedURLResult> {
				const form = (event as Event).target as HTMLFormElement
				const urlInput = form.elements.namedItem("url") as HTMLInputElement
				const url = urlInput.value

				const endpoint =
					"https://api.shrtco.de/v2/shorten?url=" + encodeURIComponent(url)

				return fetch(endpoint)
					.then((response) => response.json())
					.then((data: ShrtCodeAPIResponse) => {
						// if (!data.ok) throw new Error(data)

						return {
							ok: data.ok,
							shortUrl: data.result?.short_link,
							fullShortUrl: data.result?.full_short_link,
							originalUrl: url,
						}
					})
			},
		},
	}
)

const form = document.querySelector("form")!
const urlInput = form.elements.namedItem("url") as HTMLInputElement
form.noValidate = true

const service = interpret(urlShortenerMachine).start()

service.onTransition((state) => {
	console.log(`Transition: entered "${state.toStrings().join(" ")}" state`)
	if (state.changed) {
		form.dataset.state = state.toStrings().join(" ")
	}
})

form.addEventListener("submit", function (e) {
	e.preventDefault()
	service.send(e)
})

urlInput.addEventListener("input", service.send)

// function handleCopyBtnClick(e: Event) {
// 	const url = (e.currentTarget as HTMLButtonElement).dataset.url
// 	service.send({ type: "COPY", url })
// }

// First time using MutationObserver!

// An observer for result <li>s
// const resultLIObserver = new MutationObserver(function (mutations) {
// 	for (const mutation of mutations) {
// 		if (mutation.type === "childList") {
// 			// Add a copy handler to the copy button of each new result <li>
// 			mutation.addedNodes.forEach((resultLI: HTMLLIElement) => {
// 				const copyBtn = resultLI.querySelector("[data-copy-btn]")
// 				copyBtn.addEventListener("click", handleCopyBtnClick)
// 			})

// 			// Remove the copy handler from the copy button of the removed result <li>
// 			mutation.removedNodes.forEach((resultLI: HTMLLIElement) => {
// 				const copyBtn = resultLI.querySelector("[data-copy-btn]")
// 				copyBtn.removeEventListener("click", handleCopyBtnClick)
// 			})
// 		}
// 	}
// })

// const shortenedURLList = document.querySelector("#shortenedURLList")
// resultLIObserver.observe(shortenedURLList, { childList: true })
