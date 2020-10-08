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

    this._hiddenClass = button.dataset.hiddenClass?.trim();
    if (!this._hiddenClass) {
      throw new Error(
        `"data-hidden-class" attribute must be present on a disclosure button.`
      );
    }

    this.button.addEventListener("click", () => this.toggle());
  }

  get hidden() {
    return this.button.getAttribute("aria-expanded") === "false";
  }

  set hidden(bool) {
    this.controlledElement.classList.toggle(this._hiddenClass, bool);
    this.button.setAttribute("aria-expanded", !bool);
  }

  /**
   * Toggle the visibility of the controlled element of the disclosure widget.
   *
   * @param {boolean} [force] - If `true`, the controlled element is shown.
   * If `false`, the controlled element is hidden.
   * @returns A boolean indicating if the controlled element is visible after toggling.
   */
  toggle(force) {
    if (typeof force === "boolean") {
      this.hidden = !force;
    } else {
      this.hidden = !this.hidden;
    }
    return !this.hidden;
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
