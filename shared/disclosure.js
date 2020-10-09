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
    this._listeners = {};

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
    if (typeof force === "boolean") {
      this.open = force;
    } else {
      this.open = !this.open;
    }

    // Trigger toggle listeners
    for (const listener of this._listeners.toggle) {
      listener.call(this, { target: this });
    }

    return this.open;
  }

  /**
   * @callback eventListener
   * @param {Object} event
   * @param {Object} event.target
   */

  /**
   * Register a listener for a disclosure event.
   * The only recognized event is "toggle".
   * @param {"toggle"} type
   * @param {eventListener} listener
   */
  addEventListener(type, listener) {
    // Credit for listener implementaion: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
    switch (type) {
      case "toggle":
        if (!(type in this._listeners)) {
          this._listeners[type] = [];
        }
        this._listeners[type].push(listener);
        break;
      default:
        throw new Error(`Disclosure event type "${type}" is unknown.`);
    }
  }

  /**
   * Remove a listener registered using the addEventListener method.
   * @param {"toggle"} type
   * @param {eventListener} listener
   */
  removeEventListener(type, listener) {
    switch (type) {
      case "toggle":
        if (!(type in this._listeners)) {
          return;
        }
        const listeners = this._listeners[type];
        for (let i = 0; i < listeners.length; i++) {
          if (listeners[i] === listener) {
            listeners.splice(i, 1);
          }
        }
        break;
      default:
        throw new Error(`Disclosure event type "${type}" is unknown.`);
    }
  }
}

/**
 * Initialize a disclosure widget from every button element
 * with the `data-disclosure-btn` attribute in a given parent DOM node.
 *
 * Use this when you just want the disclosure widgets to work,
 * but you don't need any references to them.
 *
 * @param {ParentNode} parentNode
 */
function initializeDisclosures(parentNode = document) {
  parentNode
    .querySelectorAll("button[data-disclosure-btn]")
    .forEach((btn) => new Disclosure(btn, parentNode));
}

export { Disclosure, initializeDisclosures };
