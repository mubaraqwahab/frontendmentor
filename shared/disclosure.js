/**
 * A disclosure widget implementing the WAI-ARIA disclosure pattern.
 * See https://www.w3.org/TR/wai-aria-practices-1.1/#disclosure
 */
class Disclosure {
	/**
	 * Initialize a disclosure widget in a parent DOM node.
	 *
	 * A disclosure widget is identified by a disclosure button.
	 * The button is expected to have an `aria-expanded` attribute
	 * indicating whether the controlled element is visible or not,
	 * and an `aria-controls` attribute whose value is the ID of
	 * the controlled element.
	 *
	 * The button must also have a `data-hidden-class` attribute
	 * whose value is the "hidden" class to toggle on the controlled content.
	 *
	 * Note: Unlike this class, the WAI-ARIA disclosure pattern
	 * doesn't require the disclosure widget to be mounted on
	 * a button element. It also doesn't require that the
	 * `aria-controls` attribute be present on the mount.
	 *
	 * @param {HTMLButtonElement} button
	 * @param {ParentNode} [parentNode=document]
	 */
	constructor(button, parentNode = document) {
		/** The disclosure button element */
		this.button = button;

		const ariaExpandedAttribute = button.getAttribute("aria-expanded");
		const ariaExpanded =
			ariaExpandedAttribute === "true"
				? true
				: ariaExpandedAttribute === "false"
				? false
				: undefined;
		if (typeof ariaExpanded === "undefined") {
			throw new Error(
				`"aria-expanded" attribute must be present on a disclosure button` +
					` and its value must be one of "true" and "false".`
			);
		}

		const controlledId = button.getAttribute("aria-controls");
		if (!controlledId) {
			throw new Error(
				`"aria-controls" attribute must be present on a disclosure button.`
			);
		}

		/**
		 * The controlled element of the disclosure.
		 * The `aria-controls` attribute on the disclosure button must contain the ID of this element.
		 * The "hidden" class is toggled on this element.
		 */
		this.controlledElement = parentNode.querySelector(`#${controlledId}`);
		if (!this.controlledElement) {
			throw new Error(
				`"aria-controls" attribute on disclosure button has value "${controlledId}"` +
					` but there is no element with that ID.`
			);
		}

		/**
		 * The "hidden" class to be toggled on the controlled element.
		 * It is derived from the value of the `data-hidden-class` attribute on the disclosure button.
		 */
		this.hiddenClass = button.dataset.hiddenClass?.trim();
		if (!this.hiddenClass) {
			throw new Error(
				`"data-hidden-class" attribute must be present on a disclosure button.`
			);
		}

		const controlledElementHasHiddenClass = this.controlledElement.classList.contains(
			this.hiddenClass
		);
		if (ariaExpanded === controlledElementHasHiddenClass) {
			throw new Error(
				`"aria-expanded" attribute on disclosure button has value "${ariaExpanded}"` +
					` but "${this.hiddenClass}" class is ${
						controlledElementHasHiddenClass ? "" : "not "
					}present on controlled element`
			);
		}

		/** @private Event listeners for a disclosure instance. */
		this._listeners = [];

		this.button.addEventListener("click", () => this.toggle());
	}

	get open() {
		return (
			this.button.getAttribute("aria-expanded") === "true" &&
			!this.controlledElement.classList.contains(this.hiddenClass)
		);
	}

	set open(bool) {
		const wasOpen = this.open;
		this.controlledElement.classList.toggle(this.hiddenClass, !bool);
		this.button.setAttribute("aria-expanded", bool);
		if (wasOpen !== bool) {
			// Trigger toggle listeners
			const event = { target: this };
			for (const listener of this._listeners) {
				listener.call(this, event);
			}
			// Interesting note on what's above:
			// The same event object is passed to all listeners when a toggle happens.
			// This is consistent with how native events are handled (at least on Chrome).
			// Also note that a new event object is created for every toggle.
		}
	}

	/**
	 * Toggle the visibility of (the controlled element of) the disclosure widget.
	 *
	 * @param {boolean} [force] - If absent, open the widget if it's closed
	 * and close it if it's open. If `true`, open the widget, else close the widget.
	 * @returns `true` if the widget is open after toggling, `false` otherwise.
	 */
	toggle(force) {
		if (typeof force === "boolean") {
			this.open = force;
		} else {
			this.open = !this.open;
		}
		return this.open;
	}

	/**
	 * @typedef {object} DisclosureEvent
	 * @prop {Disclosure} target
	 */

	/**
	 * @callback EventListener
	 * @param {DisclosureEvent} event
	 * @returns {void}
	 */

	/**
	 * Register a listener for a disclosure "toggle" event.
	 * @param {EventListener} listener
	 */
	addListener(listener) {
		// Credit for listener implementation: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
		this._listeners.push(listener);
	}

	/**
	 * Remove a listener registered using the addListener method.
	 * @param {EventListener} listener
	 */
	removeListener(listener) {
		const listeners = this._listeners;
		for (let i = 0; i < listeners.length; i++) {
			if (listeners[i] === listener) {
				listeners.splice(i, 1);
				break;
			}
		}
	}
}

/**
 * Initialize a disclosure widget from each element matching a selector
 * in a parent DOM node. The matching element should be a button.
 *
 * Use this when you just want the disclosure widgets in the DOM to work,
 * but you don't (or do) need any references to them.
 *
 * @param {ParentNode} [parentNode=document]
 * @param {string} [selector="button[data-disclosure-btn]"]
 * @returns {Element[]} An array of the initialized disclosures,
 * in the order the buttons appear in the DOM.
 */
function initializeAll(
	parentNode = document,
	selector = "button[data-disclosure-btn]"
) {
	return [].map.call(
		parentNode.querySelectorAll(selector),
		(btn) => new Disclosure(btn, parentNode)
	);
}

export { Disclosure as default, initializeAll };
