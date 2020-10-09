/**
 * A disclosure widget implementing the WAI-ARIA disclosure pattern.
 * See https://www.w3.org/TR/wai-aria-practices-1.1/#disclosure
 */
class Disclosure {
  /**
   * Initialize a disclosure widget.
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
   */
  constructor(button) {
    this.button = button;

    const ariaExpanded = button.getAttribute("aria-expanded");
    if (
      !ariaExpanded ||
      !(ariaExpanded === "true" || ariaExpanded === "false")
    ) {
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

    this.controlledElement = document.getElementById(controlledId);
    if (!this.controlledElement) {
      throw new Error(
        `"aria-controls" attribute on disclosure button has value "${controlledId}"` +
          ` but there is no element with that ID.`
      );
    }

    /** @private */
    this._hiddenClass = button.dataset.hiddenClass?.trim();
    if (!this._hiddenClass) {
      throw new Error(
        `"data-hidden-class" attribute must be present on a disclosure button.`
      );
    }

    /** @private */
    this._listeners = [];

    // Note: unlike before, there's no need to check if the button state
    // and controlledElement state are out of sync.
    // Should they be out of sync, they would be re-synced on toggle.

    this.button.addEventListener("click", () => this.toggle());
  }

  get open() {
    return this.button.getAttribute("aria-expanded") === "true";
  }

  set open(bool) {
    const wasOpen = this.open;
    this.controlledElement.classList.toggle(this._hiddenClass, !bool);
    this.button.setAttribute("aria-expanded", bool);
    if (wasOpen !== bool) {
      // Trigger toggle listeners
      const event = { target: this };
      for (const listener of this._listeners) {
        listener.call(this, event);
      }
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
   * @callback eventListener
   * @param {{ target: Disclosure }} event
   */

  /**
   * Register a listener for a disclosure "toggle" event.
   * @param {eventListener} listener
   */
  addListener(listener) {
    // Credit for listener implementation: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
    this._listeners.push(listener);
  }

  /**
   * Remove a listener registered using the addListener method.
   * @param {eventListener} listener
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

  /**
   * Initialize a disclosure widget from each element matching a selector.
   * The matching element should be a button.
   *
   * Use this when you just want the disclosure widgets in the DOM to work,
   * but you don't (or do) need any references to them.
   *
   * @param {string} [selector="button[data-disclosure-btn]"]
   * @returns An array of the initialized disclosures,
   * in the order the buttons appear in the DOM.
   */
  static initializeAll(selector = "button[data-disclosure-btn]") {
    return [].map.call(
      document.querySelectorAll(selector),
      (btn) => new Disclosure(btn)
    );
  }
}

export default Disclosure;
// You may need to bind this method to Disclosure, if you ever use `this` within it.
export const { initializeAll } = Disclosure;
