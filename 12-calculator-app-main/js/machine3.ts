import {createMachine} from "xstate"

const machine = createMachine({
	id: "calculator",
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
								cond: "lastTokenEndsWithDigit",
								actions: "deleteLastDigit",
							},
							{
								target: "int",
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
			initial: "solution",
			states: {
				solution: {
					entry: "replaceAllWithNewToken",
					on: {
						OPERATOR: {
							target: "#calculator.operator",
							actions: "appendNewToken",
						},
					},
				},
				error: {
					entry: "replaceAllWithError",
				},
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
	schema: {
		context: {} as {},
		events: {} as
			| {type: "OPERATOR"}
			| {type: "DIGIT"}
			| {type: "DELETE"}
			| {type: "RESET"}
			| {type: "DECIMAL_POINT"}
			| {type: "SOLVE"},
	},
	context: {},
	predictableActionArguments: true,
	preserveActionOrder: true,
})
