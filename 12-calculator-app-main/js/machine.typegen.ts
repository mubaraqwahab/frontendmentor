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
		appendDecimalPointToInput: "DECIMAL_POINT"
		appendDigitToInput: "DIGIT"
		appendOperatorToInput: "OPERATOR"
		replaceLastOperator: "OPERATOR"
		resetInput: "DECIMAL_POINT" | "DIGIT" | "RESET"
		solveInput: "SOLVE"
	}
	eventsCausingServices: {}
	eventsCausingGuards: {}
	eventsCausingDelays: {}
	matchesStates: "fraction" | "idle" | "int" | "operator" | "solution"
	tags: never
}
