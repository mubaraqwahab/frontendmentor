/**
 * Initialize disclosure widgets in a given DOM node.
 *
 * A disclosure widget is identified by a disclosure button;
 * a <button> with a "data-disclosure-btn" (boolean) attribute.
 *
 * The button is expected to have an "aria-expanded" attribute
 * indicating whether the controlled element is visible or not,
 * and an "aria-controls" attribute whose value is the ID of
 * the controlled element.
 *
 * The button must also have a "data-hidden-class" attribute
 * whose value is the "hidden" class to toggle on the controlled content.
 *
 * @param {ParentNode} domNode
 */
function initializeDisclosures(domNode) {
  domNode
    .querySelectorAll("button[data-disclosure-btn]")
    .forEach((disclosureBtn) => {
      const ariaExpanded = disclosureBtn.getAttribute("aria-expanded");

      if (!ariaExpanded) {
        return console.error(
          `There is no "aria-expanded" attribute on the disclosure button`,
          disclosureBtn
        );
      }

      // Note that aria-expanded has one of three valid values: true, false, undefined (default)
      if (!(ariaExpanded === "true" || ariaExpanded === "false")) {
        return console.error(
          `Disclosure button has an invalid "aria-expanded" attribute value.`,
          `Valid values are "true" and "false"`,
          disclosureBtn
        );
      }

      const controlledElemId = disclosureBtn.getAttribute("aria-controls");

      if (!controlledElemId) {
        return console.error(
          `There is no "aria-controls" attribute on the disclosure button`,
          disclosureBtn
        );
      }

      const controlledElem = domNode.querySelector(`#${controlledElemId}`);
      const hiddenClass = disclosureBtn.dataset.hiddenClass?.trim();

      if (!hiddenClass) {
        return console.error(
          `Disclosure button must have a "data-hidden-class" attribute`,
          `whose value is the class to toggle on the controlled content`
        );
      }

      if (
        ariaExpanded === "true" &&
        controlledElem.classList.contains(hiddenClass)
      ) {
        return console.error(
          `Disclosure button has "aria-expanded" attribute set to "true"`,
          `but its controlled element has the "${hiddenClass}" class`,
          disclosureBtn,
          controlledElem
        );
      } else if (
        ariaExpanded === "false" &&
        !controlledElem.classList.contains(hiddenClass)
      ) {
        return console.error(
          `Disclosure button has "aria-expanded" attribute set to "false"`,
          `but its controlled element does not have the "${hiddenClass}" class`,
          disclosureBtn,
          controlledElem
        );
      }

      disclosureBtn.addEventListener("click", function () {
        handleDisclosureBtnClick(disclosureBtn, controlledElem);
      });
    });
}

function handleDisclosureBtnClick(btn, controlledElem) {
  // Assume it's guaranteed to exist
  const hiddenClass = btn.dataset.hiddenClass.trim();
  const isHidden = controlledElem.classList.toggle(hiddenClass);
  btn.setAttribute("aria-expanded", !isHidden);
}

export default initializeDisclosures;
