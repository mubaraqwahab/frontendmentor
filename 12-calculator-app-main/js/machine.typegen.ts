// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
	"@@xstate/typegen": true
	internalEvents: {
		"done.invoke.calc.solving:invocation[0]": {
			type: "done.invoke.calc.solving:invocation[0]"
			data: unknown
			__tip: "See the XState TS docs to learn how to strongly type this."
		}
		"error.platform.calc.solving:invocation[0]": {
			type: "error.platform.calc.solving:invocation[0]"
			data: unknown
		}
		"xstate.init": {type: "xstate.init"}
	}
	invokeSrcNameMap: {
		solveInput: "done.invoke.calc.solving:invocation[0]"
	}
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
		delete: "DELETE"
		replaceLastOperator: "OPERATOR"
		resetInput: "DECIMAL_POINT" | "DELETE" | "DIGIT" | "RESET" | "xstate.init"
		setMathError: "ERROR" | "error.platform.calc.solving:invocation[0]"
		setResult: "done.invoke.calc.solving:invocation[0]"
	}
	eventsCausingServices: {
		solveInput: "SOLVE"
	}
	eventsCausingGuards: {
		inputHasOnlyOneDigit: "DELETE"
		lastItemEndsWithDigit: "DELETE"
		lastItemHasManyDigits: "DELETE"
		lastItemHasOnlyOneDigit: "DELETE"
		prevToLastItemHasDecimalPoint: "DELETE"
	}
	eventsCausingDelays: {}
	matchesStates:
		| "fraction"
		| "idle"
		| "int"
		| "operator"
		| "solution"
		| "solution.error"
		| "solution.result"
		| "solving"
		| {solution?: "error" | "result"}
	tags: never
}
