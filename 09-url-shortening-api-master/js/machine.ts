import { MachineConfig } from "xstate"
import type { ShortenedURLResult } from "./types"

export interface URLShortenerContext {}

export type URLShortenerEvent =
	// | { type: "CHANGE"; target: HTMLInputElement }
	| { type: "SHORTEN" }
	| { type: "SUCCESS"; payload: ShortenedURLResult }
	| { type: "FAIL" }
	| { type: "COPY" }

export type URLShortenerState =
	| { value: "idle"; context: URLShortenerContext }
	// | { value: "changed"; context: URLShortenerContext }
	| { value: "shortening"; context: URLShortenerContext }
	| { value: "invalid"; context: URLShortenerContext }
	| { value: "shortened"; context: URLShortenerContext }
	| { value: "failed"; context: URLShortenerContext }
	| { value: "copied"; context: URLShortenerContext }

export const urlShortenerMachineConfig: MachineConfig<
	URLShortenerContext,
	any,
	URLShortenerEvent
> = {
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
			// @ts-ignore
			always: "idle",
		},
		shortened: {
			entry: "handleShortened",
			// @ts-ignore
			always: "idle",
		},
		failed: {
			entry: "handleFail",
			// @ts-ignore
			always: "idle",
		},
		copied: {
			entry: "handleCopy",
			// @ts-ignore
			always: "idle",
		},
	},
}
