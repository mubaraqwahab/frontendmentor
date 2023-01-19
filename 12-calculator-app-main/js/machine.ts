import {assign, createMachine, send} from "xstate"

type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export function isUnsignedDigit(str: string): str is `${Digit}` {
	return /^\d$/.test(str)
}

export function isSignedDigit(str: string): str is `-${Digit}` {
	return /^-\d$/.test(str)
}

export function isNumeric(str: string): str is `${number}` {
	return /^-?\d+(\.\d*)?$/.test(str)
}

export function isInteger(str: string): str is `${number}` {
	return /^-?\d+$/.test(str)
}

const OPERATORS = ["+", "-", "*", "/"] as const
type Operator = typeof OPERATORS[number]

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

export const calcMachine =
	/** @xstate-layout N4IgpgJg5mDOIC5QGMCGAbZBXdqAuA9gE4B0AdlgLYBGYpAlmXgMQAiAkgOLsAqA2gAYAuolAAHArHp56BMqJAAPRAFoAjACYAHCQCcAgGwBmbUYAsG3boCsWowBoQAT1VqBakgHYNBgZYFmRloCuoEAvmGOaJg4+MTkVLQMTGxcvHxqIkggElIycgrKCBqeXsZqwcFGulpqugaeji4I5iRa1oGe9WqeBmYWZhFRGNi4hKQUNHQkjCysAKIAwuwAsgCCADIA+gAKAPLsAHL8wgq50rLy2UUqGmYGJKY+oQZu5kaNzojmZiTWbiUPmYBNUAkMQNFRnEJolpgAzIioZD5MipbgnLLiSQXArXRBaUrGAm2KyeQwlaxNRAWHQabTWTxk4kmcGQ2LjBJTIjMPY7eYAJTWPD2-MEmJy2JRhWpBgeagM7RKnnaZlCGgcXxa7RIRnMyp6dLUFWsrJG7PikySzAAynsNgA1eZis6Sy7ShBmLS6NruRU9Bo1DRUhDqQwkMzWf6eYEdIwdEGmmJjeIEMR0aE8vmC4Wi07Zc5SvEIeoaHUCawg4wR6w1AzB9XWPSGBlGASef5maNGRNQjmp9PjNHpPNYvJuot6rzyzxAjoGSyheveEgGBkadwGXQVVUfHvm0j9xGDhbLdbbfZHDEuse40BFYylvq6Z663Xqz7NawaDzfuo+TfAmYah7smpCwAQ6AAG6MFAzAQHIYAzGQkEEAA1ohbKgSQ4FQTBCCMChaAomKzr5q6t5KIgDQ6CCX5uDYvhqIEwa3J6JBqLqRIcR82jqiB0LYRB0FkLBdBEPEYhjHCxCUCQmECThwlQPhyEEERlwkSOEo3lcd7UloOh2DOpieD0RosXSRhtNGpmykYfSRhoJqRBCZpYUQcA4HggnoFgKKZgKQoiqRo44rplEIMEpbtAI7hAfo751pqHhaJ2dLtq8676Foq78RyHmwF5bBLKsmy7AcxwhdpYXuioNYCCQfi6L0v7Pt4WgsUEejyhYtY1P0nF5fEBVFRw6JVQW456S0soriYTm1Po2Uas0RoNT0cY1vUXZxkN3L8vM1rzFeZE6bVGU6n0QHPASrwraodylv8IS6k1hjNhELlkAQEBwAo8kcpa0yzNeNVFuovQrlYdwcZ69ztkGyU9Ox74mM+Jh2HxLkAxasKkAiSKFqFRMRXSfzeBUbYgoEuith1modL89wVNGtipZYe2ckkoMkzcli-E8AGvNTHwsXUDXeIxWjaM+aiRp4nOHtCPNTRFdjeoGXTlvK9TuMGRiaOxDRBHU7btJonOKTBKsUfeqrsTONjtQShhJc06jAo8wQzqCQHWMYBicyN6DeThfmq5NttURWjWvKuNOKqlnWMuxqXzv71S03DQeeSHJBicQNvhUUFYNejFLNTWcuI+7HylNu6fGFY5ipTnhUh0X7oRqW5ftpXW5fixHap-cPjeE5fhaHtnfg8Evz2f0mibrdHEsb4VkN2PffVN2n1AA */
	createMachine(
		{
			id: "calculator",
			tsTypes: {} as import("./machine.typegen").Typegen0,
			schema: {
				context: {} as {tokens: string[]},
				events: {} as CalcEvent,
			},
			predictableActionArguments: true,
			preserveActionOrder: true,
			context: {
				tokens: [],
			},
			initial: "idle",
			states: {
				idle: {
					entry: "clearTokens",
					on: {
						DIGIT: {
							target: "int",
							actions: "appendNewToken",
						},
						DECIMAL_POINT: {
							target: "decimal",
							actions: "appendNewDecimalToken",
						},
						OPERATOR: {
							target: "sign",
							cond: "operatorIsMinus",
							actions: "appendNewToken",
						},
					},
				},
				int: {
					on: {
						DIGIT: [
							{
								cond: "lastTokenIsZeroOrMinusZero",
								actions: "replaceLastChar",
							},
							{
								actions: "appendToLastToken",
							},
						],
						DECIMAL_POINT: {
							target: "decimal",
							actions: "appendToLastToken",
						},
						OPERATOR: {
							target: "operator",
							actions: "appendNewToken",
						},
						RESET: "idle",
						SOLVE: "solving",
						DELETE: [
							{
								target: "idle",
								cond: "lastTokenIsUnsignedDigitAndOnlyToken",
							},
							{
								target: "sign",
								cond: "lastTokenIsSignedDigit",
								actions: "deleteLastChar",
							},
							{
								target: "operator",
								cond: "lastTokenIsUnsignedDigitAfterOperator",
								actions: "deleteLastToken",
							},
							{
								actions: "deleteLastChar",
							},
						],
					},
				},
				decimal: {
					on: {
						DIGIT: {
							actions: "appendToLastToken",
						},
						OPERATOR: {
							target: "operator",
							actions: "appendNewToken",
						},
						RESET: "idle",
						SOLVE: "solving",
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
					},
				},
				operator: {
					on: {
						DIGIT: {
							target: "int",
							actions: "appendNewToken",
						},
						DECIMAL_POINT: {
							target: "decimal",
							actions: "appendNewDecimalToken",
						},
						OPERATOR: [
							{
								target: "sign",
								cond: "operatorIsMinusAndLastTokenIsTimesOrSlash",
								actions: "appendNewToken",
							},
							{
								actions: "replaceLastChar",
							},
						],
						RESET: "idle",
						DELETE: [
							{
								target: "int",
								cond: "secondToLastTokenIsInteger",
								actions: "deleteLastToken",
							},
							{
								target: "decimal",
								actions: "deleteLastToken",
							},
						],
					},
				},
				sign: {
					on: {
						DIGIT: {
							target: "int",
							actions: "appendToLastToken",
						},
						DECIMAL_POINT: {
							target: "decimal",
							actions: "appendNewDecimalToLastToken",
						},
						RESET: "idle",
						DELETE: [
							{
								target: "idle",
								cond: "lastTokenIsOnlyToken",
							},
							{
								target: "operator",
								actions: "deleteLastToken",
							},
						],
					},
				},
				solving: {
					entry: "solve",
					on: {
						DONE: "solution",
						ERROR: "error",
					},
				},
				solution: {
					entry: "replaceAllWithNewToken",
					on: {
						DIGIT: {
							target: "int",
							actions: "replaceAllWithNewToken",
						},
						DECIMAL_POINT: {
							target: "decimal",
							actions: "replaceAllWithNewDecimalToken",
						},
						OPERATOR: {
							target: "operator",
							actions: "appendNewToken",
						},
						RESET: "idle",
						DELETE: "idle",
					},
				},
				error: {
					entry: "replaceAllWithNewToken",
					on: {
						DIGIT: {
							target: "int",
							actions: "replaceAllWithNewToken",
						},
						DECIMAL_POINT: {
							target: "decimal",
							actions: "replaceAllWithNewDecimalToken",
						},
						OPERATOR: {
							target: "sign",
							cond: "operatorIsMinus",
							actions: "replaceAllWithNewToken",
						},
						RESET: "idle",
						DELETE: "idle",
					},
				},
			},
		},
		{
			actions: {
				appendToLastToken: assign({
					tokens: (context, event) => {
						const lastToken = context.tokens.at(-1)
						const suffix = event.type === "DECIMAL_POINT" ? "." : event.data
						return [...exceptLast(context.tokens), lastToken + suffix]
					},
				}),
				appendNewDecimalToLastToken: assign({
					tokens: (context) => {
						const lastToken = context.tokens.at(-1)
						return [...exceptLast(context.tokens), lastToken + "0."]
					},
				}),
				appendNewToken: assign({
					tokens: (context, event) => {
						return [...context.tokens, event.data]
					},
				}),
				appendNewDecimalToken: assign({
					tokens: (context) => {
						return [...context.tokens, "0."]
					},
				}),
				replaceLastChar: assign({
					tokens: (context, event) => {
						const lastToken = context.tokens.at(-1)!
						const newLastToken = exceptLast(lastToken) + event.data
						return [...exceptLast(context.tokens), newLastToken]
					},
				}),
				replaceAllWithNewToken: assign({
					tokens: (context, event) => {
						return [event.data]
					},
				}),
				replaceAllWithNewDecimalToken: assign({
					tokens: ["0."],
				}),
				deleteLastChar: assign({
					tokens: (context) => {
						const lastToken = context.tokens.at(-1)!
						return [...exceptLast(context.tokens), exceptLast(lastToken)]
					},
				}),
				deleteLastToken: assign({
					tokens: (context) => {
						return [...exceptLast(context.tokens)]
					},
				}),
				clearTokens: assign({
					tokens: [] as string[],
				}),
				solve: send((context): CalcEvent => {
					const concatted = context.tokens.join("")
					const result = eval(concatted) as number
					if (Number.isFinite(result)) {
						return {type: "DONE", data: `${result}`}
					} else {
						return {type: "ERROR", data: "Cannot divide by zero"}
					}
				}),
			},
			guards: {
				operatorIsMinus: (context, event) => {
					return event.data === "-"
				},
				operatorIsMinusAndLastTokenIsTimesOrSlash: (context, event) => {
					const lastToken = context.tokens.at(-1)!
					return event.data === "-" && !"+-".includes(lastToken)
				},
				lastTokenIsZeroOrMinusZero: (context) => {
					const lastToken = context.tokens.at(-1)!
					return lastToken === "0" || lastToken === "-0"
				},
				lastTokenIsUnsignedDigitAndOnlyToken: (context) => {
					const lastToken = context.tokens.at(-1)!
					return isUnsignedDigit(lastToken) && context.tokens.length === 1
				},
				lastTokenIsSignedDigit: (context) => {
					const lastToken = context.tokens.at(-1)!
					return isSignedDigit(lastToken)
				},
				lastTokenIsUnsignedDigitAfterOperator: (context) => {
					const lastToken = context.tokens.at(-1)!
					const secondToLastToken = context.tokens.at(-2)!
					// There's actually no need to check if second-to-last token is an op;
					// you could just check if the token exists (as in tokens.length > 1)
					// because the finite states already enforce the type of the token.
					return isUnsignedDigit(lastToken) && isOperator(secondToLastToken)
				},
				lastTokenEndsWithDecimalPoint: (context) => {
					return context.tokens.at(-1)!.endsWith(".")
				},
				lastTokenIsOnlyToken: (context) => {
					return context.tokens.length === 1
				},
				secondToLastTokenIsInteger: (context) => {
					return isInteger(context.tokens.at(-2)!)
				},
			},
		}
	)

function exceptLast<T>(arr: Array<T>): Array<T>
function exceptLast(str: string): string
function exceptLast<T>(sliceable: Array<T> | string) {
	return sliceable.slice(0, sliceable.length - 1)
}
