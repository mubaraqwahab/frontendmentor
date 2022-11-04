import {assign, createMachine} from "xstate"

export function isDigit(str: string): str is `${number}` {
	return /^[0-9]$/.test(str)
}

const OPERATORS = ["+", "-", "×", "/"] as const
type Operator = typeof OPERATORS[number]

export function isOperator(str: string): str is Operator {
	// @ts-ignore (I don't get why TS is complaining about str 😕)
	return OPERATORS.includes(str)
}

type Event =
	| {type: "DIGIT"; data: `${number}`}
	| {type: "OPERATOR"; data: Operator}
	| {type: "DECIMAL_POINT"}
	| {type: "SOLVE"}
	| {type: "RESET"}
	| {type: "DELETE"}
	| {type: "ERROR"}

export const calcMachine =
	/** @xstate-layout N4IgpgJg5mDOIC5QGMCGAbZA6AlhdYAxACICSA4qQCqKgAOA9rDgC44MB2tIAHogEwBWAJxYAbPwAswgBwBGYYPli5AZjEAaEAE9Ec-gAZJWGarMB2U+dWK55gL72taTLnxFiAUQDCpALIAggAyAPoACgDypAByNEggjMxsnNx8CEKiEtLyispqmjqISqpY5sLlwuZVqoJiRo7OGNh4BIQRYZ4ASgFUEZ3ciazsXPFpGeJSsgpKcirqWrrpBqLS5eb85pKCqgaWDSAuzRwsJBTUA0xDKaOIkjsmwgYiwmJikmKC-HILevqiZmYZAYZGJHuUZPtDrhjiQfP5guEorELklhqkim8sJNbGJVEI7OYfgh5MYDGSDPxVJJZmSqZCmtCTu0uj0+iiriNQGlasZsYJZnj+VUietzFhyWTJPxpYIlPTXDgYZ1PABlTxxeiXZKc3iIMwGLDCVSbOrvOSCCmyolyc1iEwAmRbc0yQR3eVHE4qiJBABqnnZ2vRCB5WNW-Nx+OFhQQNptWAtZNlG3M+n4EKcBwZipOXiC6v98UGgZuwcxfIFkcJ0f0d3ErxTuLUKf47qwADMAE6oZDa06UDUJLVokubA0VRRSMlCWpE-mkiqWD5iGQr4Stzvd3vM7q9fqFofXLmIEGiR3qGSbfhG5f8IlUmRYVaySlSgw7STrrs94aEZVqgdFsOR4ILigjxlkOxqEoSjCES7zGDsEqOk6difpuP5er6Baaqih66sSoImHcy6XteMi3tGEhihKCgvDapiqGh36cLCeZUNhg64TqaQnkR56keeFGLIIZTiuS-AqG+wJyhmUIMHQYBdiwDAdn25z7lxQZGmKmzlNssxlEaqhEooJQSvq+jrCorbyYpqDKap26snuOEckGcgGGWpjUn8sxSDId4iY+FRAm+K6zMIH6yQytlKSpsK+IEoSRDEAEHtxx6EWeJFSmRQm3DU8Y0dsrrmDJjSuLF9nxX+6oBkB+GRXIWC2rMIh4uYyySESMiiOOZXKEIvVRRV2BVQ5rH5vVeFpPohXLOoEggnYxRwbKYlknIr6qFtlSOBmHAMBAcDcFCLRgNNGUIFK1rmmBDGSBSkiSECfmttml1Bnc-Chmsrp4qovVGta0rNQCj1khIrqCExxauXD+HWHaF7SE6nkmsZlGeeK-Uum+VKMdFlUKXFHafSWHnrKGdwvc8oJvnB0jBeOlLShIhOjVgsAMOgACuCOATNeieT97wgkCjw1C8AXVp5JSzGI1gGGoV7CGmrYABY4LALDk8BahbHxbxXomZWztYG0UnIK5PBs6ajXr+HW9aYr9XUwIKFSW37fYQA */
	createMachine(
		{
			schema: {
				events: {} as Event,
				services: {} as {solveInput: {data: string}},
			},
			tsTypes: {} as import("./machine.typegen").Typegen0,
			context: {input: ["0"]},
			id: "calc",
			initial: "idle",
			states: {
				idle: {
					entry: "resetInput",
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
						// DELETE here has no effect
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
							target: "solving",
						},
						DELETE: [
							{
								target: "idle",
								cond: "inputHasOnlyOneDigit",
							},
							{
								cond: "lastItemHasManyDigits",
								actions: "delete",
								target: "int",
							},
							{
								cond: "lastItemHasOnlyOneDigit",
								actions: "delete",
								target: "operator",
							},
						],
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
							target: "solving",
						},
						DELETE: [
							{
								actions: "delete",
								target: "fraction",
								cond: "lastItemEndsWithDigit",
							},
							{
								actions: "delete",
								target: "int",
							},
						],
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
						DELETE: [
							{
								actions: "delete",
								target: "fraction",
								cond: "prevToLastItemHasDecimalPoint",
							},
							{
								actions: "delete",
								target: "int",
							},
						],
					},
				},
				solving: {
					invoke: {
						src: "solveInput",
						onDone: "solution.result",
						onError: "solution.error",
					},
				},
				solution: {
					type: "compound",
					on: {
						DIGIT: {
							actions: ["resetInput", "appendDigitToInput"],
							target: "int",
						},
						DECIMAL_POINT: {
							actions: ["resetInput", "appendDecimalPointToInput"],
							target: "fraction",
						},
						ERROR: {
							target: "solution.error",
						},
						DELETE: {
							target: "idle",
						},
					},
					states: {
						result: {
							entry: "setResult",
							on: {
								OPERATOR: {
									actions: "appendOperatorToInput",
									target: "#calc.operator",
								},
							},
						},
						error: {
							entry: "setMathError",
						},
					},
				},
			},
			on: {
				RESET: {
					target: "idle",
				},
			},
		},
		{
			actions: {
				resetInput: assign({input: ["0"]}),
				appendDigitToInput: assign({
					input: (context, event) => {
						const {input} = context
						const last = input.at(-1)!
						if (Number.isNaN(+last)) {
							// Append a new top
							return [...input, event.data]
						} else if (last === "0") {
							// Replace the old top
							return [...exceptLast(input), event.data]
						} else {
							// Append to the old top
							return [...exceptLast(input), last + event.data]
						}
					},
				}),
				appendDecimalPointToInput: assign({
					input: (context) => {
						const last = context.input.at(-1)!
						return [...exceptLast(context.input), last + "."]
					},
				}),
				appendOperatorToInput: assign({
					input: (context, event) => {
						return [...context.input, event.data]
					},
				}),
				replaceLastOperator: assign({
					input: (context, event) => {
						return [...exceptLast(context.input), event.data]
					},
				}),
				setResult: assign({
					input: (context, event) => {
						return [event.data]
					},
				}),
				setMathError: assign({
					input: ["MathError"],
				}),
				delete: assign({
					input: (context) => {
						const {input} = context
						const last = input.at(-1)!
						if (last.length === 1) {
							return [...exceptLast(input)]
						} else {
							return [...exceptLast(input), exceptLast(last)]
						}
					},
				}),
			},
			services: {
				async solveInput(context) {
					const cleaned = context.input.join("").replace("×", "*")
					const result = eval(cleaned) as number
					console.log({cleaned, result})
					if (Number.isFinite(result)) {
						return result.toString()
					} else {
						throw new Error("MathError: " + result)
					}
				},
			},
			guards: {
				/** Check if the input has a single item which is a single digit */
				inputHasOnlyOneDigit(context) {
					return context.input.length === 1 && context.input.at(-1)!.length === 1
				},
				/** Check if the last input item has many digits */
				lastItemHasManyDigits(context) {
					return context.input.at(-1)!.length > 1
				},
				/** Check if the last input item has only one digit */
				lastItemHasOnlyOneDigit(context) {
					return context.input.at(-1)!.length === 1
				},
				/** Check if the last input item ends with a digit */
				lastItemEndsWithDigit(context) {
					const last = context.input.at(-1)!
					return isDigit(last.at(-1)!)
				},
				/** Check if the penultimate item has a decimal point */
				prevToLastItemHasDecimalPoint(context) {
					return context.input.at(-2)!.includes(".")
				},
			},
		}
	)

function exceptLast<T>(arr: Array<T>): Array<T>
function exceptLast(str: string): string
function exceptLast<T>(sliceable: Array<T> | string) {
	return sliceable.slice(0, sliceable.length - 1)
}
