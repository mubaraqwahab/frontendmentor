// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
	"@@xstate/typegen": true
	internalEvents: {
		"xstate.init": {type: "xstate.init"}
	}
	invokeSrcNameMap: {}
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
		replaceAllWithNewFractionToken: "DECIMAL_POINT"
		replaceAllWithNewToken: "DIGIT" | "DONE" | "ERROR"
		replaceLastToken: "DIGIT" | "OPERATOR"
		resetTokens: "DELETE" | "RESET"
		solve: "SOLVE"
	}
	eventsCausingServices: {}
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
