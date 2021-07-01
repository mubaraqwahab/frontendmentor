import { createMachine } from "@xstate/fsm"

interface User {
	name: string
}

interface UserContext {
	user?: User
	error?: string
}

type UserEvent =
	| { type: "FETCH"; id: string }
	| { type: "RESOLVE"; user: User }
	| { type: "REJECT"; error: string }

type UserState =
	| { value: "idle" }
	| { value: "changed" }
	| { value: "submitting" }
	| { value: "invalid" }
	| { value: "success" }
	| { value: "failed" }
	| { value: "copied" }

// const shortenerMachine = createMachine<UserContext, UserEvent, UserState>({
// 	id: "user",
// 	initial: "idle",
// 	states: {
// 		idle: {},
// 		changed: {},
// 	},
// });
