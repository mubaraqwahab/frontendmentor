import {createMachine} from "xstate"

const machine =
	/** @xstate-layout N4IgpgJg5mDOIC5QGMCGAbZBXdqAuA9gE4B0AdlgLYBGYpAlmXgMQAiAkgOLsAqA2gAYAuolAAHArHp56BMqJAAPRAFoAjACYAHCQCcAgGwBmbUYAsG3boCsWowBoQAT1VqBakgHYNBgZYFmRloCuoEAvmGOaJg4+MTkVLQMTGxcvHxqIkggElIycgrKCBqeXsZqwcFGulpqugaeji4I5iRa1oGe9WqeBmYWZhFRGNi4hKQUNHQkjCysAKIAwuwAsgCCADIA+gAKAPLsAHL8wgq50rLy2UUqGmYGJKY+oQZu5kaNzojmZiTWbiUPmYBNUAkMQNFRnEJolpgAzIioZD5MipbgnLLiSQXArXRBaUrGAm2KyeQwlaxNRAWHQabTWTxk4kmcGQ2LjBJTIjMPY7eYAJTWPD2-MEmJy2JRhWpBgeagM7RKnnaZlCGgcXxa7RIRnMyp6dLUFWsrJG7PikySzAAynsNgA1eZis6Sy7ShBmLS6NruRU9Bo1DRUhDqQwkMzWf6eYEdIwdEGmmJjeIEMR0aE8vmC4Wi07Zc5SvEIeoaHUCawg4wR6w1AzB9XWPSGBlGASef5maNGRNQjmp9PjNHpPNYvJuot6rzyzxAjoGSyheveEgGBkadwGXQVVUfHvm0j9xGDhbLdbbfZHDEuse40BFYylvq6Z663Xqz7NawaDzfuo+TfAmYah7smpCwAQ6AAG6MFAzAQHIYAzGQkEEAA1ohbKgSQ4FQTBCCMChaAomKzr5q6t5KIgUYrtYDTtBWFTrpSmq3JoJCGJuNYRp2uhGAYIHQthEHQWQsF0EQ8RiGMcLEJQJCYYJOEiVA+HIQQRGXCRI4SjeVx3ognjyiuG73ASQTtGowa3POei2NY5i+DS1QCRyRBwDgcxLKsmy7AcxykaOOJ6ZRIa2EY4b-H4gJMgqwaaB48rztogQCO4tEaC58RubAHlDleZG6e6fEPA+Gi2HUIQCHYcVuCQPRxjW9RdnGESRCAZAEBAcAKApHKWtMszXkF7rqL0K5WHcajmFo9ztkGmpGqUmgfCYz4mHY6qZTCXIkAiSKFoFB0hXSfzeBUbYgoEvFVcGHS-PcFTRrYM2WFtnJJENR03JYvxPABryXR8VkVV4Ph+EByr2T8b2HtCn3jvpCB2N6gZdOW8r1O4wZGGx05BHU7YWRlbW9fESkwfDFH3qqdUzjY3haASHHA8CjzBDOoJAbRfFvdlHlCegWBHQWCMhRGHihIZ2h2NGq6dlZHweF0HwdHUvj1N2JNmlhfPoHgJDicQlPBUUNYPIYvodn4Wh1ixiteLx7ZAZjGu8+5evG+6wLhZLmiM0Ccsfqo9wCA7Kt3M+VW6J4W2e0WKjlBFALRVVsUsR03rK9GtSenUOOtWEQA */
	createMachine({
		initial: "number",
		states: {
			number: {
				initial: "int",
				states: {
					int: {
						on: {
							DIGIT: [
								{
									cond: "lastTokenIsZero",
									actions: "replaceLastToken",
								},
								{
									actions: "appendToLastToken",
								},
							],
							DECIMAL_POINT: {
								target: "fraction",
								actions: "appendToLastToken",
							},
						},
					},
					fraction: {
						on: {
							DIGIT: {
								actions: "appendToLastToken",
							},
						},
					},
				},
				on: {
					OPERATOR: {
						target: "operator",
						actions: "appendNewToken",
					},
					SOLVE: {
						target: "solving",
					},
				},
			},
			operator: {
				on: {
					OPERATOR: {
						actions: "replaceLastToken",
					},
					DIGIT: {
						target: "#calculator.number.int",
						actions: "appendNewToken",
					},
					DECIMAL_POINT: {
						target: "#calculator.number.fraction",
						actions: "appendNewFractionToken",
					},
				},
			},
			solving: {
				invoke: {
					src: "solve",
					onDone: [
						{
							target: "result",
						},
					],
					onError: [
						{
							target: "#calculator.result.error",
						},
					],
				},
			},
			result: {
				initial: "solution",
				states: {
					solution: {},
					error: {},
				},
				on: {
					DECIMAL_POINT: {
						target: "#calculator.number.fraction",
						actions: "replaceAllWithNewFractionToken",
					},
					DIGIT: {
						target: "#calculator.number.int",
						actions: "replaceAllWithNewToken",
					},
				},
			},
		},
		id: "calculator",
	})
