import { Action, ConditionPredicate, createMachine, interpret } from "xstate"
import type { ShortenedURLResult, ShrtCodeAPIResponse } from "./types"

/* TYPES FOR THE MACHINE */

export interface URLShortenerContext {}

export type URLShortenerEvent =
	// | { type: "CHANGE"; target: HTMLInputElement }
	| { type: "SHORTEN"; form: HTMLFormElement }
	| { type: "SUCCESS"; result: ShortenedURLResult }
	| { type: "FAIL" }
	| { type: "COPY"; url: string }

export type URLShortenerState =
	| { value: "idle"; context: URLShortenerContext }
	// | { value: "changed"; context: URLShortenerContext }
	| { value: "shortening"; context: URLShortenerContext }
	| { value: "invalid"; context: URLShortenerContext }
	| { value: "shortened"; context: URLShortenerContext }
	| { value: "failed"; context: URLShortenerContext }
	| { value: "copied"; context: URLShortenerContext }

export type URLShortenerAction = Action<URLShortenerContext, URLShortenerEvent>
export type URLShortenerGuard = ConditionPredicate<
	URLShortenerContext,
	URLShortenerEvent
>

/* ACTIONS */

const handleSubmit: URLShortenerAction = async (_, event) => {
	// const loadingClass = this.data.get("loadingClass")
	// this.element.classList.add(loadingClass)

	if (event.type !== "SHORTEN") return

	const { form } = event
	const urlInput = form.elements.namedItem("url") as HTMLInputElement
	const url = urlInput.value

	// this.setInputValidity(true)

	try {
		const response = await fetch(
			`https://api.shrtco.de/v2/shorten?url=${encodeURIComponent(url)}`
		)
		const data: ShrtCodeAPIResponse = await response.json()
		const result = {
			ok: data.ok,
			shortUrl: data.result?.short_link,
			fullShortUrl: data.result?.full_short_link,
			originalUrl: url,
		}

		this.service.send({ type: "SUCCESS", result })
	} catch {
		this.service.send("FAIL")
	}
}
const handleInvalid: URLShortenerAction = () => {
	// this.setInputValidity(false)
}

const handleShortened: URLShortenerAction = (_, event) => {
	// const loadingClass = this.data.get("loadingClass")
	// this.element.classList.remove(loadingClass)

	if (event.type === "SUCCESS") {
		this.addResult(event.result)
	}
}

const handleFail: URLShortenerAction = () => {
	const failedClass = this.data.get("shortenFailedClass")
	this.element.classList.add(failedClass)
}

const handleCopy: URLShortenerAction = () => {
	// Continue from here
	navigator.clipboard.writeText(this.sourceTarget.href).then(
		() => this.element.classList.add(this.data.get("copiedClass")),
		() => this.element.classList.add(this.data.get("copyFailedText"))
	)
}

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
					// CHANGE: "changed",
					SHORTEN: [
						{ target: "shortening", cond: "isValidURL" },
						{ target: "invalid" },
					],
					COPY: { target: "copied", cond: "hasResults" },
				},
			},
			// changed: {
			// 	entry: "handleChange",
			// 	on: {
			// 		CHANGE: "changed",
			// 		SHORTEN: [
			// 			{ target: "shortening", cond: "validURL" },
			// 			{ target: "invalid" },
			// 		],
			// 		COPY: { target: "copied", cond: "hasResults" },
			// 	},
			// },
			shortening: {
				entry: "handleSubmit",
				on: {
					SUCCESS: "shortened",
					FAIL: "failed",
				},
			},
			invalid: {
				entry: "handleInvalid",
				always: "idle",
			},
			shortened: {
				entry: "handleShortened",
				always: "idle",
			},
			failed: {
				entry: "handleFail",
				always: "idle",
			},
			copied: {
				entry: "handleCopy",
				always: "idle",
			},
		},
	},
	{
		guards: {
			isValidURL(): boolean {
				// Lazy way to do this, but works :)
				console.log(this.formTarget.checkValidity())
				return this.formTarget.checkValidity()
			},

			hasResults(): boolean {
				return this.results.length > 0
			},
		},
	}
)

const urlShortenerService = interpret(urlShortenerMachine)

const form = document.querySelector("form")

form.addEventListener("submit", function (e) {
	e.preventDefault()
	const form = e.target as HTMLFormElement
	urlShortenerService.send({ type: "SHORTEN", form })
})

function handleCopyBtnClick(e: Event) {
	const url = (e.currentTarget as HTMLButtonElement).dataset.url
	urlShortenerService.send({ type: "COPY", url })
}

// First time using MutationObserver!

// An observer for result <li>s
const resultLIObserver = new MutationObserver(function (mutations) {
	for (const mutation of mutations) {
		if (mutation.type === "childList") {
			// Add a copy handler to the copy button of each new result <li>
			mutation.addedNodes.forEach((resultLI: HTMLLIElement) => {
				const copyBtn = resultLI.querySelector("[data-copy-btn]")
				copyBtn.addEventListener("click", handleCopyBtnClick)
			})

			// Remove the copy handler from the copy button of the removed result <li>
			mutation.removedNodes.forEach((resultLI: HTMLLIElement) => {
				const copyBtn = resultLI.querySelector("[data-copy-btn]")
				copyBtn.removeEventListener("click", handleCopyBtnClick)
			})
		}
	}
})

const shortenedURLList = document.querySelector("#shortenedURLList")
resultLIObserver.observe(shortenedURLList, { childList: true })
