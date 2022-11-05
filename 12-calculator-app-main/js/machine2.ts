import {assign, createMachine} from "xstate"

const OPERATORS = ["+", "-", "*", "/"] as const
type Operator = typeof OPERATORS[number]

export function isOperator(str: string): str is Operator {
	// @ts-ignore (I don't get why TS is complaining about str 😕)
	return OPERATORS.includes(str)
}

type CalcEvent =
	| {type: "DIGIT"; data: `${number}`}
	| {type: "OPERATOR"; data: Operator}
	| {type: "DECIMAL_POINT"}
	| {type: "SOLVE"}
	| {type: "RESET"}
	| {type: "DELETE"}
	| {type: "ERROR"}

type CalcContext = {
	tokens: string[]
}

type CalcService = {
	solve: {
		data: string
	}
}

export const calcMachine =
	/** @xstate-layout N4IgpgJg5mDOIC5QGMCGAbZBXdqAuA9gE4B0AdlgLYBGYpAlmXgMQAiAkgOLsAqA2gAYAuolAAHArHp56BMqJAAPRAFoAjACYAHCQCcAgGwBmbUYAsG3boCsWowBoQAT1VqBakgHYNBgZYFmRloCuoEAvmGOaJg4+MTkVLQMTGxcvHxqIkggElIycgrKCBqeXsZqwcFGulpqugaeji4I5iRa1oGe9WqeBmYWZhFRGNi4hKQUNHQkjCysAKIAwuwAsgCCADIA+gAKAPLsAHL8wgq50rLy2UUqGmYGJKY+oQZu5kaNzojmZiTWbiUPmYBNUAkMQNFRnEJolpgAzIioZD5MipbgnLLiSQXArXRBaUrGAm2KyeQwlaxNRAWHQabTWTxk4kmcGQ2LjBJTIjMPY7eYAJTWPD2-MEmJy2JRhWpBgeagM7RKnnaZlCGgcXxa7RIRnMyp6dLUFWsrJG7PikySzAAynsNgA1eZis6Sy7ShBmLS6NruRU9Bo1DRUhDqQwkMzWf6eYEdIwdEGmmJjeIEMR0aE8vmC4Wi07Zc5SvEIeoaHUCawg4wR6w1AzB9XWPSGBlGASef5maNGRNQjmp9PjNHpPNYvJuot6rzyzxAjoGSyheveEgGBkadwGXQVVUfHvm0j9xGDhbLdbbfZHDEuse40BFYylvq6Z663Xqz7NawaDzfuo+TfAmYah7smpCwAQ6AAG6MFAzAQHIYAzGQkEEAA1ohbKgSQ4FQTBCCMChaAomKzr5q6t5KIgDQ6CCX5uDYvhqIEwa3J6JBqLqRIcR82jqiB0LYRB0FkLBdBEPEYhjHCxCUCQmECThwlQPhyEEERlwkSOEo3lcd7UloOh2DOpieD0RosXSRhtNGpmykYfSRhoJqRBCZpYUQcA4HggnoFgKKZgKQoiqRo44rplEIMEpbtAI7hAfo751pqHhaJ2dLtq8676Foq78RyHmwF5bBLKsmy7AcxwhdpYXuioNYCCQfi6L0v7Pt4WgsUEejyhYtY1P0nF5fEBVFRw6JVQW456S0soriYTm1Po2Uas0RoNT0cY1vUXZxkN3L8vM1rzFeZE6bVGU6n0QHPASrwraodylv8IS6k1hjNhELlkAQEBwAo8kcpa0yzNeNVFuovQrlYdwcZ69ztkGyU9Ox74mM+Jh2HxLkAxasKkAiSKFqFRMRXSfzeBUbYgoEuith1modL89wVNGtipZYe2ckkoMkzcli-E8AGvNTHwsXUDXeL4nrqu42Wc4e0I81NEV2N6gZdOW8r1O4wZGJo7ENEEdTtu0mic4pMFKxR96quxM42O1BKGElzTqMCjzBDOoJAdYxgGJzI3oN5OF+crk3W1RFaNa8q404qqWdYy7GpfOvvVLTcMB55QckGJxBW+FRQVg16MUs1NZqF+ielNuqfGFY5ipVnhVBwX7oRqWpftuXW5V5qdVMcn9zuDLHGmXtbfg8Evz2f0mibrdHEsb4VnbltnsdO0n1hEAA */
	createMachine(
		{
			context: {
				tokens: ["0"],
			},
			tsTypes: {} as import("./machine2.typegen").Typegen0,
			schema: {
				events: {} as CalcEvent,
				context: {} as CalcContext,
				services: {} as CalcService,
			},
			id: "calculator",
			initial: "number",
			on: {
				RESET: {
					target: ".number.int",
					actions: "resetTokens",
				},
			},
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
								DECIMAL_POINT: {
									target: "fraction",
									actions: "appendToLastToken",
								},
							},
						},
						fraction: {
							on: {
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
					invoke: {
						src: "solve",
						onDone: [
							{
								target: "result",
							},
						],
						onError: [
							{
								target: "#calculator.result.error",
							},
						],
					},
				},
				result: {
					entry: "replaceAllWithResult",
					initial: "solution",
					states: {
						solution: {
							on: {
								OPERATOR: {
									target: "#calculator.operator",
									actions: "appendNewToken",
								},
							},
						},
						error: {},
					},
					on: {
						DECIMAL_POINT: {
							target: "#calculator.number.fraction",
							actions: "replaceAllWithNewFractionToken",
						},
						DIGIT: {
							target: "#calculator.number.int",
							actions: "replaceAllWithNewToken",
						},
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
				replaceAllWithResult: assign({
					tokens: (context, event) => {
						if (typeof event.data === "string") {
							return [event.data]
						} else {
							return [(event.data as Error).message]
						}
					},
				}),
				resetTokens: assign({
					tokens: ["0"],
				}),
			},
			services: {
				async solve(context) {
					const concatted = context.tokens.join("")
					const result = eval(concatted) as number
					if (Number.isFinite(result)) {
						return result.toString()
					} else {
						throw new Error("Cannot divide by zero")
					}
				},
			},
			guards: {
				lastTokenIsZero: (context) => {
					return context.tokens.at(-1) === "0"
				},
			},
		}
	)

function exceptLast<T>(arr: Array<T>): Array<T>
function exceptLast(str: string): string
function exceptLast<T>(sliceable: Array<T> | string) {
	return sliceable.slice(0, sliceable.length - 1)
}
