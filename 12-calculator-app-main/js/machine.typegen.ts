// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
	"@@xstate/typegen": true
	internalEvents: {
		"xstate.init": {type: "xstate.init"}
	}
	invokeSrcNameMap: {}
	missingImplementations: {
		actions: never
		delays: never
		guards: never
		services: never
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
		replaceLastChar: "DIGIT" | "OPERATOR"
		resetTokens: "RESET"
		solve: "SOLVE"
	}
	eventsCausingDelays: {}
	eventsCausingGuards: {
		lastTokenEndsWithDecimalPoint: "DELETE"
		lastTokenIsSignedDigit: "DELETE"
		lastTokenIsUnsignedDigit: "DELETE"
		lastTokenIsZeroOrMinusZero: "DIGIT"
		onlyOneCharIsLeftInTokens: "DELETE"
		operatorIsMinusSign: "OPERATOR"
		operatorIsMinusSignAndLastTokenIsNotAdditive: "OPERATOR"
		prevToLastTokenHasDecimalPoint: "DELETE"
	}
	eventsCausingServices: {}
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

// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
	"@@xstate/typegen": true
	internalEvents: {
		"xstate.init": {type: "xstate.init"}
	}
	invokeSrcNameMap: {}
	missingImplementations: {
		actions: never
		delays: never
		guards: never
		services: never
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
		replaceLastChar: "DIGIT" | "OPERATOR"
		resetTokens: "RESET"
		solve: "SOLVE"
	}
	eventsCausingDelays: {}
	eventsCausingGuards: {
		lastTokenEndsWithDecimalPoint: "DELETE"
		lastTokenIsSignedDigit: "DELETE"
		lastTokenIsUnsignedDigit: "DELETE"
		lastTokenIsZeroOrMinusZero: "DIGIT"
		onlyOneCharIsLeftInTokens: "DELETE"
		operatorIsMinusSign: "OPERATOR"
		operatorIsMinusSignAndLastTokenIsNotAdditive: "OPERATOR"
		prevToLastTokenHasDecimalPoint: "DELETE"
	}
	eventsCausingServices: {}
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
// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
	"@@xstate/typegen": true
	internalEvents: {
		"xstate.init": {type: "xstate.init"}
	}
	invokeSrcNameMap: {}
	missingImplementations: {
		actions: never
		delays: never
		guards: "operatorIsMinusSignAndLastTokenIsNotAdditi"
		services: never
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
		replaceLastChar: "DIGIT" | "OPERATOR"
		resetTokens: "RESET"
		solve: "SOLVE"
	}
	eventsCausingDelays: {}
	eventsCausingGuards: {
		lastTokenEndsWithDecimalPoint: "DELETE"
		lastTokenIsSignedDigit: "DELETE"
		lastTokenIsUnsignedDigit: "DELETE"
		lastTokenIsZeroOrMinusZero: "DIGIT"
		onlyOneCharIsLeftInTokens: "DELETE"
		operatorIsMinusSign: "OPERATOR"
		operatorIsMinusSignAndLastTokenIsNotAdditi: "OPERATOR"
		prevToLastTokenHasDecimalPoint: "DELETE"
	}
	eventsCausingServices: {}
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
