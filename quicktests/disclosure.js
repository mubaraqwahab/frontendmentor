/**
 * Initialize disclosure widgets in a given DOM node.
 *
 * A disclosure widget is identified by a disclosure button;
 * a <button> with a "data-disclosure-btn" (boolean) attribute.
 * The button is expected to have an "aria-expanded" attribute
 * indicating whether the controlled element is visible or not,
 * and an "aria-controls" attribute whose value is the ID of the controlled element.
 *
 * The button may optionally have a "data-hidden-class" attribute
 * whose value is the "hidden" class to toggle on the controlled content.
 * If the attribute is absent (or its value is the empty string or whitespace),
 * the HTML "hidden" attribute is used on the controlled content.
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

      if (
        ariaExpanded === "true" &&
        isElemHidden(controlledElem, hiddenClass)
      ) {
        const reason = hiddenClass
          ? `"${hiddenClass}" class`
          : `"hidden" attribute`;
        return console.error(
          `Disclosure button has "aria-expanded" attribute set to "true"`,
          `but its controlled element has the ${reason}`,
          disclosureBtn,
          controlledElem
        );
      } else if (
        ariaExpanded === "false" &&
        !isElemHidden(controlledElem, hiddenClass)
      ) {
        const reason = hiddenClass
          ? `"${hiddenClass}" class`
          : `"hidden" attribute`;
        return console.error(
          `Disclosure button has "aria-expanded" attribute set to "false"`,
          `but its controlled element does not have the ${reason}`,
          disclosureBtn,
          controlledElem
        );
      }

      disclosureBtn.addEventListener("click", function () {
        handleDisclosureBtnClick(disclosureBtn, controlledElem);
      });
    });
}

function isElemHidden(element, hiddenClass) {
  if (hiddenClass) return element.classList.contains(hiddenClass);
  return element.hasAttribute("hidden");
}

function handleDisclosureBtnClick(btn, controlledElem) {
  const hiddenClass = btn.dataset.hiddenClass?.trim();
  let isHidden;
  if (hiddenClass) {
    isHidden = controlledElem.classList.toggle(hiddenClass);
  } else {
    isHidden = controlledElem.toggleAttribute("hidden");
  }
  btn.setAttribute("aria-expanded", !isHidden);
}

export default initializeDisclosures;
