import {assign, createMachine} from "xstate"

type Event =
	| {type: "DIGIT"; data: `${number}`}
	| {type: "OPERATOR"; data: "+" | "-" | "×" | "/"}
	| {type: "DECIMAL_POINT"}
	| {type: "SOLVE"}
	| {type: "RESET"}
	| {type: "DELETE"}

export const calcMachine =
	/** @xstate-layout N4IgpgJg5mDOIC5QGMCGAbZA6AlhdYAxACICSA4qQCqKgAOA9rDgC44MB2tIAHogEwBWAJxYAbPwAswgBwBGYYPli5AZjEAaEAE9Ec-gAZJWGarMB2U+dWK55gL72taTLnxFiAUQDCpALIAggAyAPoACgDypAByNEggjMxsnNx8CEKiEtLyispqmjqISqpY5sLlwuZVqoJiRo7OGNh4BIQRYZ4ASgFUEZ3ciazsXPFpGeJSsgpKcirqWrrpBqLS5eb85pKCqgaWDSAuzRwsJBTUA0xDKaOIkjsmwgYiwmJikmKC-HILevqiZmYZAYZGJHuUZPtDrhjiQfP5guEorELklhqkim8sJNbGJVEI7OYfgh5MYDGSDPxVJJZmSqZCmtCTu0uj0+iiriNQGlasZsYJZnj+VUietzFhyWTJPxpYIlPTXDgYZ1PABlTxxeiXZKc3iIMwGLDCVSbOrvOSCCmyolyc1iEwAmRbc0yQR3eVHE4qiJBABqnnZ2vRCB5WNW-Nx+OFhQQNptWAtZNlG3M+n4EKcBwZipOXiC6v98UGgZuwcxfIFkcJ0f0d3ErxTuLUKf47qwADMAE6oZDa06UDUJLVokubA0VRRSMlCWpE-mkiqWD5iGQr4Stzvd3vM7q9fqFofXLmIEGiR3qGSbfhG5f8IlUmRYVaySlSgw7STrrs94aEZVqgdFsOR4ILigjxlkOxqEoSjCES7zGDsEqOk6difpuP5er6Baaqih66sSoImHcy6XteMi3tGEhihKCgvDapiqGh36cLCeZUNhg64TqaQnkR56keeFGLIIZTiuS-AqG+wJyhmUIMHQYBdiwDAdn25z7lxQZGmKmzlNssxlEaqhEooJQSvq+jrCorbyYpqDKap26snuOEckGcgGGWpjUn8sxSDId4iY+FRAm+K6zMIH6yQytlKSpsK+IEoSRDEAEHtxx6EWeJFSmRQm3DU8Y0dsrrmDJjSuLF9nxX+6oBkB+GRXIWC2rMIh4uYyySESMiiOOZXKEIvVRRV2BVQ5rH5vVeFpPohXLOoEggnYxRwbKYlknIr6qFtlSOBmHAMBAcDcFCLRgNNGUIFK1rmmBDGSBSkiSECfmttml1Bnc-Chmsrp4qovVGta0rNQCj1khIrqCExxauXD+HWHaF7SE6nkmsZlGeeK-Uum+VKMdFlUKXFHafSWHnrKGdwvc8oJvnB0jBeOlLShIhOjVgsAMOgACuCOATNeieT97wgkCjw1C8AXVp5JSzGI1gGGoV7CGmrYABY4LALDk8BahbHxbxXomZWztYG0UnIK5PBs6ajXr+HW9aYr9XUwIKFSW37fYQA */
	createMachine(
		{
			schema: {
				events: {} as Event,
			},
			tsTypes: {} as import("./machine.typegen").Typegen0,
			context: {input: "0"},
			id: "calc",
			initial: "idle",
			states: {
				idle: {
					on: {
						DIGIT: {
							actions: "appendDigitToInput",
							target: "int",
						},
						DECIMAL_POINT: {
							actions: "appendDecimalPointToInput",
							target: "fraction",
						},
						OPERATOR: {
							actions: "appendOperatorToInput",
							target: "operator",
						},
					},
				},
				int: {
					on: {
						DIGIT: {
							actions: "appendDigitToInput",
							target: "int",
						},
						DECIMAL_POINT: {
							actions: "appendDecimalPointToInput",
							target: "fraction",
						},
						OPERATOR: {
							actions: "appendOperatorToInput",
							target: "operator",
						},
						SOLVE: {
							target: "solution",
						},
						// DELETE: {
						// 	target: "hist",
						// },
					},
				},
				fraction: {
					on: {
						DIGIT: {
							actions: "appendDigitToInput",
							target: "fraction",
						},
						OPERATOR: {
							actions: "appendOperatorToInput",
							target: "operator",
						},
						SOLVE: {
							target: "solution",
						},
						// DELETE: {
						// 	target: "hist",
						// },
					},
				},
				operator: {
					on: {
						DIGIT: {
							actions: "appendDigitToInput",
							target: "int",
						},
						OPERATOR: {
							actions: "replaceLastOperator",
							target: "operator",
						},
						DECIMAL_POINT: {
							actions: "appendDecimalPointToInput",
							target: "fraction",
						},
						// DELETE: {
						// 	target: "hist",
						// },
					},
				},
				solution: {
					entry: "solveInput",
					on: {
						DIGIT: {
							actions: ["resetInput", "appendDigitToInput"],
							target: "int",
						},
						DECIMAL_POINT: {
							actions: ["resetInput", "appendDecimalPointToInput"],
							target: "fraction",
						},
						OPERATOR: {
							actions: "appendOperatorToInput",
							target: "operator",
						},
					},
				},
			},
			on: {
				RESET: {
					actions: "resetInput",
					target: "idle",
				},
			},
		},
		{
			actions: {
				resetInput: assign({input: "0"}),
				appendDigitToInput: assign({
					input: (context, event) => {
						if (context.input === "0") {
							return event.data
						} else {
							return context.input + event.data
						}
					},
				}),
				appendDecimalPointToInput: assign({
					input: (context) => {
						return context.input + "."
					},
				}),
				appendOperatorToInput: assign({
					input: (context, event) => {
						return context.input + event.data
					},
				}),
				replaceLastOperator: assign({
					input: (context, event) => {
						return context.input.slice(0, context.input.length - 1) + event.data
					},
				}),
				solveInput: assign({
					input: (context) => {
						const cleaned = context.input.replace("×", "*")
						console.log({cleaned})
						return eval(cleaned)
					},
				}),
			},
		}
	)
