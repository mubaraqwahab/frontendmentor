import {createMachine} from "xstate"

// See https://stately.ai/viz/eb5fc349-c9e3-4d34-9b35-49526d113628

let input = "0"
let currentState = "idle"
const stack = [currentState]

type Event =
	| {type: "DIGIT"; data: `${number}`}
	| {type: "OPERATOR"; data: "+" | "-" | "*" | "/"}
	| {type: "DECIMAL_POINT"}
	| {type: "SOLVE"}
	| {type: "RESET"}
	| {type: "DELETE"}

export const calcMachine =
	/** @xstate-layout N4IgpgJg5mDOIC5QGMCGAbZA6AlhdYAxACICSA4qQCqKgAOA9rDgC44MB2tIAHogEwBWAJxYAbPwAswgBwBGYYPli5AZjEAaEAE9Ec-gAZJWGarMB2U+dWK55gL72taTLnxFiAUQDCpALIAggAyAPoACgDypAByNEggjMxsnNx8CEKiEtLyispqmjqISqpY5sLlwuZVqoJiRo7OGNh4BIQRYZ4ASgFUEZ3ciazsXPFpGeJSsgpKcirqWrrpBqLS5eb85pKCqgaWDSAuzRwsJBTUA0xDKaOIkjsmwgYiwmJikmKC-HILevqiZmYZAYZGJHuUZPtDrhjiQfP5guEorELklhqkim8sJNbGJVEI7OYfgh5MYDGSDPxVJJZmSqZCmtCTu0uj0+iiriNQGlasZsYJZnj+VUietzFhyWTJPxpYIlPTXDgYZ1PABlTxxeiXZKc3iIMwGLDCVSbOrvOSCCmyolyc1iEwAmRbc0yQR3eVHE4qiJBABqnnZ2vRCB5WNW-Nx+OFhQQNptWAtZNlG3M+n4EKcBwZipOXiC6v98UGgZuwcxfIFkcJ0f0d3ErxTuLUKf47qwADMAE6oZDa06UDUJLVokubA0VRRSMlCWpE-mkiqWD5iGQr4Stzvd3vM7q9fqFofXLmIEGiR3qGSbfhG5f8IlUmRYVaySlSgw7STrrs94aEZVqgdFsOR4ILigjxlkOxqEoSjCES7zGDsEqOk6difpuP5er6Baaqih66sSoImHcy6XteMi3tGEhihKCgvDapiqGh36cLCeZUNhg64TqaQnkR56keeFGLIIZTiuS-AqG+wJyhmUIMHQYBdiwDAdn25z7lxQZGmKmzlNssxlEaqhEooJQSvq+jrCorbyYpqDKap26snuOEckGcgGGWpjUn8sxSDId4iY+FRAm+K6zMIH6yQytlKSpsK+IEoSRDEAEHtxx6EWeJFSmRQm3DU8Y0dsrrmDJjSuLF9nxX+6oBkB+GRXIWC2rMIh4uYyySESMiiOOZXKEIvVRRV2BVQ5rH5vVeFpPohXLOoEggnYxRwbKYlknIr6qFtlSOBmHAMBAcDcFCLRgNNGUIFK1rmmBDGSBSkiSECfmttml1Bnc-Chmsrp4qovVGta0rNQCj1khIrqCExxauXD+HWHaF7SE6nkmsZlGeeK-Uum+VKMdFlUKXFHafSWHnrKGdwvc8oJvnB0jBeOlLShIhOjVgsAMOgACuCOATNeieT97wgkCjw1C8AXVp5JSzGI1gGGoV7CGmrYABY4LALDk8BahbHxbxXomZWztYG0UnIK5PBs6ajXr+HW9aYr9XUwIKFSW37fYQA */
	createMachine({
		context: {input: "0"},
		tsTypes: {} as import("./machine.typegen").Typegen0,
		id: "calc",
		initial: "idle",
		states: {
			idle: {
				entry: resetInput,
				on: {
					DIGIT: {
						actions: appendToInput,
						target: "int",
					},
					DECIMAL_POINT: {
						actions: appendDecimalPointToInput,
						target: "fraction",
					},
					OPERATOR: {
						actions: appendToInput,
						target: "operator",
					},
				},
			},
			int: {
				on: {
					DIGIT: {
						actions: appendToInput,
						target: "int",
						internal: false,
					},
					DECIMAL_POINT: {
						actions: appendDecimalPointToInput,
						target: "fraction",
					},
					OPERATOR: {
						actions: appendToInput,
						target: "operator",
					},
					RESET: {
						target: "idle",
					},
					SOLVE: {
						target: "solution",
					},
					DELETE: {
						target: "hist",
					},
				},
			},
			fraction: {
				on: {
					DIGIT: {
						actions: appendToInput,
						target: "fraction",
						internal: false,
					},
					OPERATOR: {
						actions: appendToInput,
						target: "operator",
					},
					RESET: {
						target: "idle",
					},
					SOLVE: {
						target: "solution",
					},
					DELETE: {
						target: "hist",
					},
				},
			},
			operator: {
				on: {
					DIGIT: {
						actions: appendToInput,
						target: "int",
					},
					OPERATOR: {
						actions: replaceLastOperator,
						target: "operator",
						internal: false,
					},
					DECIMAL_POINT: {
						actions: appendDecimalPointToInput,
						target: "fraction",
					},
					RESET: {
						target: "idle",
					},
					DELETE: {
						target: "hist",
					},
				},
			},
			solution: {
				entry: solveInput,
			},
			hist: {
				history: false,
				type: "history",
			},
		},
	})

function appendToInput(_, event: Event & {type: "DIGIT" | "OPERATOR"}) {
	if (input === "0") {
		input = event.data
	}
	input = input + event.data
}

function appendDecimalPointToInput(_, event: Event) {
	input = input + "."
}

function resetInput() {
	input = "0"
}

function replaceLastOperator(_, event: Event & {type: "OPERATOR"}) {
	input = input.slice(0, input.length - 1) + event.data
}

function solveInput(_, event: Event) {
	input = "100"
}
