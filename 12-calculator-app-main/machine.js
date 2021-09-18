function _(machine) {
	let currentState = calcMachine.initial

	const result = {
		send(event) {
			// const event =
			const nextState = machine.states[currentState].on[event.type]?.target || currentState
			currentState = nextState
		},
	}

	return result
}

const calcMachine = {
	initial: "idle",
	states: {
		idle: {
			on: {
				DIGIT: {
					target: "idle",
				},
				DECIMAL_POINT: {
					target: "afterPoint",
				},
				OPERATOR: {
					target: "operator",
				},
				SOLVE: {
					target: "solution",
				},
			},
		},
		afterPoint: {
			on: {
				DIGIT: {
					target: "afterPoint",
				},
				OPERATOR: {
					target: "operator",
				},
				SOLVE: {
					target: "solution",
				},
			},
		},
		operator: {
			on: {
				DIGIT: {
					target: "idle",
				},
				OPERATOR: {
					target: "operator",
					action: "replaceOperator",
				},
				DECIMAL_POINT: {
					target: "afterPoint",
				},
			},
		},
		solution: {
			on: {
				DIGIT: {
					target: "idle",
				},
				DECIMAL_POINT: {
					target: "afterPoint",
				},
				OPERATOR: {
					target: "operator",
				},
			},
		},
	},
}

// send({ type: "OPERATOR", data: "+" })
