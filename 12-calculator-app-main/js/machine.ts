import {assign, createMachine, send} from "xstate"

export function isDigit(str: string): str is `${number}` {
	return /^\d$/.test(str)
}

export function isNumeric(str: string): str is `${number}` {
	return /^\d+(\.\d*)?$/.test(str)
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
			context: {
				tokens: ["0"],
			},
			predictableActionArguments: true,
			preserveActionOrder: true,
			initial: "number",
			states: {
				number: {
					initial: "int",
					states: {
						int: {
							on: {
								DIGIT: [
									{
										cond: "lastTokenIsZero",
										actions: "replaceLastToken",
									},
									{
										actions: "appendToLastToken",
									},
								],
								DELETE: [
									{
										cond: "onlyOneDigitIsLeftInTokens",
										actions: "resetTokens",
									},
									{
										target: "#calculator.operator",
										cond: "lastTokenHasOnlyOneDigit",
										actions: "deleteLastToken",
									},
									{
										cond: "lastTokenHasManyDigits",
										actions: "deleteLastDigit",
									},
								],
								DECIMAL_POINT: {
									target: "fraction",
									actions: "appendToLastToken",
								},
							},
						},
						fraction: {
							on: {
								DELETE: [
									{
										cond: "lastTokenEndsWithDecimalPoint",
										target: "int",
										actions: "deleteLastDigit",
									},
									{
										actions: "deleteLastDigit",
									},
								],
								DIGIT: {
									actions: "appendToLastToken",
								},
							},
						},
					},
					on: {
						OPERATOR: {
							target: "operator",
							actions: "appendNewToken",
						},
						SOLVE: {
							target: "solving",
						},
					},
				},
				operator: {
					on: {
						DELETE: [
							{
								target: "#calculator.number.fraction",
								cond: "prevToLastTokenHasDecimalPoint",
								actions: "deleteLastToken",
							},
							{
								target: "#calculator.number.int",
								actions: "deleteLastToken",
							},
						],
						OPERATOR: {
							actions: "replaceLastToken",
						},
						DIGIT: {
							target: "#calculator.number.int",
							actions: "appendNewToken",
						},
						DECIMAL_POINT: {
							target: "#calculator.number.fraction",
							actions: "appendNewFractionToken",
						},
					},
				},
				solving: {
					entry: "solve",
					on: {
						ERROR: {
							target: "#calculator.result.error",
						},
						DONE: {
							target: "result",
						},
					},
				},
				result: {
					initial: "solution",
					entry: "replaceAllWithNewToken",
					states: {
						solution: {
							on: {
								OPERATOR: {
									target: "#calculator.operator",
									actions: "appendNewToken",
								},
								SOLVE: {
									target: "#calculator.solving",
								},
							},
						},
						error: {},
					},
					on: {
						DELETE: {
							target: "#calculator.number.int",
							actions: "resetTokens",
						},
						DIGIT: {
							target: "#calculator.number.int",
							actions: "replaceAllWithNewToken",
						},
						DECIMAL_POINT: {
							target: "#calculator.number.fraction",
							actions: "replaceAllWithNewFractionToken",
						},
					},
				},
			},
			on: {
				RESET: {
					target: ".number.int",
					actions: "resetTokens",
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
				appendNewToken: assign({
					tokens: (context, event) => {
						return [...context.tokens, event.data]
					},
				}),
				appendNewFractionToken: assign({
					tokens: (context) => {
						return [...context.tokens, "0."]
					},
				}),
				replaceLastToken: assign({
					tokens: (context, event) => {
						return [...exceptLast(context.tokens), event.data]
					},
				}),
				replaceAllWithNewToken: assign({
					tokens: (context, event) => {
						return [event.data]
					},
				}),
				replaceAllWithNewFractionToken: assign({
					tokens: ["0."],
				}),
				deleteLastDigit: assign({
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
				resetTokens: assign({
					tokens: ["0"],
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
				lastTokenIsZero: (context) => {
					return context.tokens.at(-1) === "0"
				},
				onlyOneDigitIsLeftInTokens: (context) => {
					const {tokens} = context
					return tokens.length === 1 && tokens[0]!.length === 1
				},
				lastTokenHasOnlyOneDigit: (context) => {
					return context.tokens.at(-1)!.length === 1
				},
				lastTokenHasManyDigits: (context) => {
					return context.tokens.at(-1)!.length > 1
				},
				lastTokenEndsWithDecimalPoint: (context) => {
					return context.tokens.at(-1)!.endsWith(".")
				},
				prevToLastTokenHasDecimalPoint: (context) => {
					return context.tokens.at(-2)!.includes(".")
				},
			},
		}
	)

function exceptLast<T>(arr: Array<T>): Array<T>
function exceptLast(str: string): string
function exceptLast<T>(sliceable: Array<T> | string) {
	return sliceable.slice(0, sliceable.length - 1)
}
