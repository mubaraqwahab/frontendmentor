const toolbar = document.querySelector("[role=toolbar]")!
const buttons = toolbar.querySelectorAll("button")

/**
 * Implement a roving tabindex on the calculator toolbar.
 * See:
 *  - (TODO: link to aria role toolbar)
 *  - https://w3c.github.io/aria-practices/#kbd_roving_tabindex
 */
export function initRovingTabIndex() {
	buttons.forEach((button, i) => {
		// Make only the first button reachable via keyboard initially
		button.tabIndex = i === 0 ? 0 : -1

		button.addEventListener("keydown", (e) => {
			const destIndex = focusDestInToolbarSequence(i, e.key)
			button.tabIndex = -1
			buttons[destIndex]!.tabIndex = 0
			buttons[destIndex]!.focus()
		})

		// Focus may come through mouseclick, for example
		button.addEventListener("focus", () => {
			buttons.forEach((btn, j) => {
				btn.tabIndex = i === j ? 0 : -1
			})
		})
	})
}

/**
 * Determine the index of the toolbar button that should receive focus,
 * given the index of the currently focused button and a navigation key
 * (i.e., 'ArrowRight' or 'ArrowLeft'). Note that the returned index is
 * always wrapped so that it is never out-of-bounds.
 *
 * If the given key isn't a navigation key, then return the index of the
 * currently focused button.
 *
 * @param buttonIndex
 * @param key
 */
function focusDestInToolbarSequence(buttonIndex: number, key: string) {
	if (key === "ArrowRight") {
		const nextIndex = (buttonIndex + 1) % buttons.length
		return nextIndex
	} else if (key === "ArrowLeft") {
		const prevIndex = buttonIndex === 0 ? buttons.length - 1 : buttonIndex - 1
		return prevIndex
	} else {
		return buttonIndex
	}
}
