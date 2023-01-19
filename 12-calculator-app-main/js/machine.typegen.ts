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
		appendNewDecimalToLastToken: "DECIMAL_POINT"
		appendNewDecimalToken: "DECIMAL_POINT"
		appendNewToken: "DIGIT" | "OPERATOR"
		appendToLastToken: "DECIMAL_POINT" | "DIGIT"
		clearTokens: "DELETE" | "RESET" | "xstate.init"
		deleteLastChar: "DELETE"
		deleteLastToken: "DELETE"
		replaceAllWithNewDecimalToken: "DECIMAL_POINT"
		replaceAllWithNewToken: "DIGIT" | "DONE" | "ERROR" | "OPERATOR"
		replaceLastChar: "DIGIT" | "OPERATOR"
		solve: "SOLVE"
	}
	eventsCausingDelays: {}
	eventsCausingGuards: {
		lastTokenEndsWithDecimalPoint: "DELETE"
		lastTokenIsOnlyToken: "DELETE"
		lastTokenIsSignedDigit: "DELETE"
		lastTokenIsUnsignedDigitAfterOperator: "DELETE"
		lastTokenIsUnsignedDigitAndOnlyToken: "DELETE"
		lastTokenIsZeroOrMinusZero: "DIGIT"
		operatorIsMinus: "OPERATOR"
		operatorIsMinusAndLastTokenIsTimesOrSlash: "OPERATOR"
		secondToLastTokenIsInteger: "DELETE"
	}
	eventsCausingServices: {}
	matchesStates: "decimal" | "error" | "idle" | "int" | "operator" | "sign" | "solution" | "solving"
	tags: never
}
