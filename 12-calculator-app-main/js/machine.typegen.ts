// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
	"@@xstate/typegen": true
	internalEvents: {
		"done.invoke.calculator.solving:invocation[0]": {
			type: "done.invoke.calculator.solving:invocation[0]"
			data: unknown
			__tip: "See the XState TS docs to learn how to strongly type this."
		}
		"error.platform.calculator.solving:invocation[0]": {
			type: "error.platform.calculator.solving:invocation[0]"
			data: unknown
		}
		"xstate.init": {type: "xstate.init"}
	}
	invokeSrcNameMap: {
		solve: "done.invoke.calculator.solving:invocation[0]"
	}
	missingImplementations: {
		actions: never
		services: never
		guards: never
		delays: never
	}
	eventsCausingActions: {
		appendNewFractionToken: "DECIMAL_POINT"
		appendNewToken: "DIGIT" | "OPERATOR"
		appendToLastToken: "DECIMAL_POINT" | "DIGIT"
		deleteLastDigit: "DELETE"
		deleteLastToken: "DELETE"
		replaceAllWithError: "error.platform.calculator.solving:invocation[0]"
		replaceAllWithNewFractionToken: "DECIMAL_POINT"
		replaceAllWithNewToken: "DIGIT" | "done.invoke.calculator.solving:invocation[0]"
		replaceLastToken: "DIGIT" | "OPERATOR"
		resetTokens: "DELETE" | "RESET"
	}
	eventsCausingServices: {
		solve: "SOLVE"
	}
	eventsCausingGuards: {
		lastTokenEndsWithDecimalPoint: "DELETE"
		lastTokenHasManyDigits: "DELETE"
		lastTokenHasOnlyOneDigit: "DELETE"
		lastTokenIsZero: "DIGIT"
		onlyOneDigitIsLeftInTokens: "DELETE"
		prevToLastTokenHasDecimalPoint: "DELETE"
	}
	eventsCausingDelays: {}
	matchesStates:
		| "number"
		| "number.fraction"
		| "number.int"
		| "operator"
		| "result"
		| "result.error"
		| "result.solution"
		| "solving"
		| {number?: "fraction" | "int"; result?: "error" | "solution"}
	tags: never
}
