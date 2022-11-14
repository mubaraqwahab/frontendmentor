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
		appendNewFractionToLastToken: "DECIMAL_POINT"
		appendNewFractionToken: "DECIMAL_POINT"
		appendNewToken: "DIGIT" | "OPERATOR"
		appendToLastToken: "DECIMAL_POINT" | "DIGIT"
		deleteLastChar: "DELETE"
		deleteLastToken: "DELETE"
		replaceAllWithNewFractionToken: "DECIMAL_POINT"
		replaceAllWithNewToken: "DIGIT" | "DONE" | "ERROR"
		replaceLastToken: "DIGIT" | "OPERATOR"
		resetTokens: "RESET"
		solve: "SOLVE"
	}
	eventsCausingServices: {}
	eventsCausingGuards: {
		lastTokenEndsWithDecimalPoint: "DELETE"
		lastTokenIsSignedDigit: "DELETE"
		lastTokenIsUnsignedDigit: "DELETE"
		lastTokenIsZero: "DIGIT"
		onlyOneCharIsLeftInTokens: "DELETE"
		operatorIsMinusSign: "OPERATOR"
		operatorIsMinusSignAndLastTokenIsMultiplicative: "OPERATOR"
		prevToLastTokenHasDecimalPoint: "DELETE"
	}
	eventsCausingDelays: {}
	matchesStates:
		| "idle"
		| "number"
		| "number.fraction"
		| "number.int"
		| "operator"
		| "result"
		| "result.error"
		| "result.solution"
		| "sign"
		| "solving"
		| {number?: "fraction" | "int"; result?: "error" | "solution"}
	tags: never
}
