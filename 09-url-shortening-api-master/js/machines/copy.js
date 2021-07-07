import { createMachine } from "xstate"

const copyShortURL = (context, event) => {
	return navigator.clipboard.writeText(event.value).then(() => event.value)
}

// TODO
const isDifferentCopy = (context, event) => true

const copyMachineConfig = {
	id: "copy",
	initial: "idle",
	states: {
		idle: {
			on: {
				COPY: "copying",
			},
		},
		copying: {
			invoke: {
				src: copyShortURL,
				onDone: "copied",
				onError: "idle",
			},
			on: {
				COPY: {
					target: "copying",
					cond: isDifferentCopy,
				},
			},
		},
		copied: {
			on: {
				COPY: "copying",
			},
			after: {
				3000: "idle",
			},
		},
	},
}

export default copyMachineConfig
