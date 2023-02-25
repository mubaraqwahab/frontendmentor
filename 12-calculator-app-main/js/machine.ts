import {assign, createMachine, send} from "xstate"

// The return type assertion could be stricter, but there's no need.
export function isUnsignedDigit(str: string): str is `${number}` {
	return /^\d$/.test(str)
}

export function isSignedDigit(str: string): str is `${number}` {
	return /^-\d$/.test(str)
}

export function isNumeric(str: string): str is `${number}` {
	return /^-?\d+(\.\d*)?$/.test(str)
}

export function isInteger(str: string): str is `${number}` {
	return /^-?\d+$/.test(str)
}

export const OPERATORS = ["+", "-", "*", "/"] as const
export type Operator = typeof OPERATORS[number]

export function isOperator(str: string): str is Operator {
	// @ts-ignore (I don't get why TS is complaining about str 😕)
	return OPERATORS.includes(str)
}

type CalcEvent =
	| {type: "OPERATOR"; data: Operator}
	| {type: "DIGIT"; data: `${number}`}
	| {type: "DELETE"}
	| {type: "RESET"}
	| {type: "DECIMAL_POINT"}
	| {type: "SOLVE"}
	| {type: "DONE"; data: `${number}`}
	| {type: "ERROR"; data: string}

export const calcMachine = createMachine(
	{
		id: "calculator",
		initial: "expectsNewNumber",
		states: {
			number: {
				initial: "int",
				states: {
					int: {
						on: {
							DECIMAL_POINT: {
								target: "decimal",
								actions: "appendToLastToken",
							},
							DIGIT: [
								{
									cond: "lastTokenIsZeroOrMinusZero",
									actions: "replaceLastChar",
								},
								{
									actions: "appendToLastToken",
								},
							],
							DELETE: [
								{
									target: "#calculator.expectsNewNumber.operator",
									cond: "lastTokenIsUnsignedDigitAfterOperator",
									actions: "deleteLastToken",
								},
								{
									target: "#calculator.expectsNewNumber",
									cond: "lastTokenIsUnsignedDigitAndOnlyToken",
								},
								{
									target: "#calculator.sign",
									cond: "lastTokenIsSignedDigit",
									actions: "deleteLastChar",
								},
								{
									actions: "deleteLastChar",
								},
							],
						},
					},
					decimal: {
						on: {
							DELETE: [
								{
									target: "int",
									cond: "lastTokenEndsWithDecimalPoint",
									actions: "deleteLastChar",
								},
								{
									actions: "deleteLastChar",
								},
							],
							DIGIT: {
								actions: "appendToLastToken",
							},
						},
					},
				},
				on: {
					SOLVE: {
						target: "solving",
					},
					OPERATOR: {
						target: "#calculator.expectsNewNumber.operator",
						actions: "appendNewToken",
					},
				},
			},
			expectsNewNumber: {
				initial: "idle",
				states: {
					idle: {
						entry: "clearTokens",
					},
					operator: {
						on: {
							DELETE: [
								{
									target: "#calculator.number",
									cond: "secondToLastTokenIsInteger",
									actions: "deleteLastToken",
								},
								{
									target: "#calculator.number.decimal",
									actions: "deleteLastToken",
								},
							],
							OPERATOR: {
								cond: "operatorIsNotMinusOrLastTokenIsPlusOrMinus",
								actions: "replaceLastChar",
							},
						},
					},
				},
				on: {
					DIGIT: {
						target: "number",
						actions: "appendNewToken",
					},
					DECIMAL_POINT: {
						target: "#calculator.number.decimal",
						actions: "appendNewDecimalToken",
					},
					OPERATOR: {
						target: "sign",
						cond: "operatorIsMinus",
						actions: "appendNewToken",
					},
				},
			},
			sign: {
				on: {
					DELETE: [
						{
							target: "expectsNewNumber",
							cond: "lastTokenIsOnlyToken",
						},
						{
							target: "#calculator.expectsNewNumber.operator",
							actions: "deleteLastToken",
						},
					],
					DECIMAL_POINT: {
						target: "#calculator.number.decimal",
						actions: "appendNewDecimalToLastToken",
					},
					DIGIT: {
						target: "number",
						actions: "appendToLastToken",
					},
				},
			},
			solving: {
				entry: "solve",
				on: {
					DONE: {
						target: "result",
					},
					ERROR: {
						target: "#calculator.result.error",
					},
				},
			},
			result: {
				entry: "replaceAllWithNewToken",
				initial: "solution",
				states: {
					solution: {
						on: {
							OPERATOR: {
								target: "#calculator.expectsNewNumber.operator",
								actions: "appendNewToken",
							},
						},
					},
					error: {
						on: {
							OPERATOR: {
								target: "#calculator.sign",
								cond: "operatorIsMinus",
								actions: "replaceAllWithNewToken",
							},
						},
					},
				},
				on: {
					DIGIT: {
						target: "number",
						actions: "replaceAllWithNewToken",
					},
					DECIMAL_POINT: {
						target: "#calculator.number.decimal",
						actions: "replaceAllWithNewDecimalToken",
					},
					DELETE: {
						target: "expectsNewNumber",
					},
				},
			},
		},
		on: {
			RESET: {
				target: ".expectsNewNumber",
			},
		},
		schema: {
			context: {} as {
				tokens: string[]
			},
			events: {} as CalcEvent,
		},
		context: {tokens: []},
		predictableActionArguments: true,
		preserveActionOrder: true,
		tsTypes: {} as import("./machine.typegen").Typegen0,
	},
	{
		actions: {
			appendNewDecimalToken: assign({
				tokens: (context, event) => {
					return [...context.tokens, "0."]
				},
			}),
			appendNewDecimalToLastToken: assign({
				tokens: (context, event) => {
					const lastToken = context.tokens.at(-1)!
					return [...exceptLast(context.tokens), lastToken + "0."]
				},
			}),
			appendNewToken: assign({
				tokens: (context, event) => {
					return [...context.tokens, event.data]
				},
			}),
			appendToLastToken: assign({
				tokens: (context, event) => {
					const lastToken = context.tokens.at(-1)!
					const suffix = event.type === "DECIMAL_POINT" ? "." : event.data
					return [...exceptLast(context.tokens), lastToken + suffix]
				},
			}),
			clearTokens: assign({
				tokens: (context, event) => {
					return []
				},
			}),
			deleteLastChar: assign({
				tokens: (context, event) => {
					const lastToken = context.tokens.at(-1)!
					return [...exceptLast(context.tokens), exceptLast(lastToken)]
				},
			}),
			deleteLastToken: assign({
				tokens: (context, event) => {
					return [...exceptLast(context.tokens)]
				},
			}),
			replaceAllWithNewDecimalToken: assign({
				tokens: (context, event) => {
					return ["0."]
				},
			}),
			replaceAllWithNewToken: assign({
				tokens: (context, event) => {
					return [event.data]
				},
			}),
			replaceLastChar: assign({
				tokens: (context, event) => {
					const lastToken = context.tokens.at(-1)!
					const newLastToken = exceptLast(lastToken) + event.data
					return [...exceptLast(context.tokens), newLastToken]
				},
			}),
			solve: send((context, event) => {
				const expression = context.tokens.join("")
				const result = eval(expression) as number
				if (Number.isFinite(result)) {
					return {type: "DONE", data: `${result}`}
				} else {
					return {type: "ERROR", data: "Cannot divide by zero"}
				}
			}),
		},
		guards: {
			lastTokenEndsWithDecimalPoint: (context, event) => {
				return context.tokens.at(-1)!.endsWith(".")
			},
			lastTokenIsOnlyToken: (context, event) => {
				return context.tokens.length === 1
			},
			lastTokenIsSignedDigit: (context, event) => {
				return isSignedDigit(context.tokens.at(-1)!)
			},
			lastTokenIsUnsignedDigitAfterOperator: (context, event) => {
				const lastToken = context.tokens.at(-1)!
				// This could be undefined actually, but just for convenience, pretend otherwise.
				const secondToLastToken = context.tokens.at(-2)!
				return isUnsignedDigit(lastToken) && isOperator(secondToLastToken)
			},
			lastTokenIsUnsignedDigitAndOnlyToken: (context, event) => {
				const lastToken = context.tokens.at(-1)!
				return isUnsignedDigit(lastToken) && context.tokens.length === 1
			},
			lastTokenIsZeroOrMinusZero: (context, event) => {
				const lastToken = context.tokens.at(-1)!
				return lastToken === "0" || lastToken === "-0"
			},
			operatorIsMinus: (context, event) => {
				return event.data === "-"
			},
			operatorIsNotMinusOrLastTokenIsPlusOrMinus: (context, event) => {
				const lastToken = context.tokens.at(-1)!
				return event.data !== "-" || lastToken === "+" || lastToken === "-"
			},
			secondToLastTokenIsInteger: (context, event) => {
				return isInteger(context.tokens.at(-2)!)
			},
		},
	}
)

function exceptLast<T>(arr: Array<T>): Array<T>
function exceptLast(str: string): string
function exceptLast<T>(arrOrStr: Array<T> | string) {
	return arrOrStr.slice(0, arrOrStr.length - 1)
}
