/**
 * A disclosure widget implementing the WAI-ARIA disclosure pattern.
 * See https://www.w3.org/TR/wai-aria-practices-1.1/#disclosure
 */
class Disclosure {
  /**
   * Initialize a disclosure widget in a given parent DOM node.
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
   * @param {ParentNode} parentNode
   */
  constructor(button, parentNode = document) {
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

    this.controlledElement = parentNode.getElementById(controlledId);
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
    this.controlledElement.classList.toggle(this._hiddenClass, !bool);
    this.button.setAttribute("aria-expanded", bool);
  }

  /**
   * Toggle the visibility of the controlled element of the disclosure widget.
   *
   * @param {boolean} [force] - If `true`, the widget will be open.
   * If `false`, the widget will be closed.
   * @returns A boolean indicating whether widget is open after toggling.
   */
  toggle(force) {
    const wasOpen = this.open;
    if (typeof force === "boolean") {
      this.open = force;
    } else {
      this.open = !wasOpen;
    }

    if (wasOpen !== this.open) {
      // Trigger toggle listeners
      const event = { target: this };
      for (const listener of this._listeners) {
        listener.call(this, event);
      }
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
   * Initialize a disclosure widget from every button element
   * with the `data-disclosure-btn` attribute in a given parent DOM node.
   *
   * Use this when you just want the disclosure widgets to work,
   * and you do or don't need any references to them.
   *
   * @param {ParentNode} parentNode
   * @returns An array of the initialized disclosures,
   * in the order the buttons appear in the DOM.
   */
  static initializeAll(parentNode = document) {
    return [].map.call(
      parentNode.querySelectorAll("button[data-disclosure-btn]"),
      (btn) => new Disclosure(btn, parentNode)
    );
  }
}

export default Disclosure;
export const { initializeAll } = Disclosure;
