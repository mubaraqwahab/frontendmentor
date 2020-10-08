/**
 * Initialize disclosure widgets in a given DOM node.
 *
 * A disclosure widget is identified by a disclosure button;
 * a <button> with a "data-disclosure-btn" (boolean) attribute.
 * The button is expected to have an "aria-expanded" attribute
 * indicating whether the controlled content is open or closed,
 * and an "aria-controls" attribute whose value is the ID of the controlled content.
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
      const contentId = disclosureBtn.getAttribute("aria-controls");

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

      if (!contentId) {
        return console.error(
          `There is no "aria-controls" attribute on the disclosure button`,
          disclosureBtn
        );
      }

      const content = domNode.querySelector(`#${contentId}`);
      const hiddenClass = disclosureBtn.dataset.hiddenClass?.trim();

      if (ariaExpanded === "true" && isElemHidden(content, hiddenClass)) {
        const reason = hiddenClass
          ? `"${hiddenClass}" class`
          : `"hidden" attribute`;
        return console.error(
          `Disclosure button has "aria-expanded" attribute set to "true"`,
          `but its controlled element has the ${reason}`,
          disclosureBtn,
          content
        );
      } else if (
        ariaExpanded === "false" &&
        !isElemHidden(content, hiddenClass)
      ) {
        const reason = hiddenClass
          ? `"${hiddenClass}" class`
          : `"hidden" attribute`;
        return console.error(
          `Disclosure button has "aria-expanded" attribute set to "false"`,
          `but its controlled element does not have the ${reason}`,
          disclosureBtn,
          content
        );
      }

      disclosureBtn.addEventListener("click", function () {
        handleDisclosureBtnClick(disclosureBtn, content);
      });
    });
}

function isElemHidden(element, hiddenClass) {
  if (hiddenClass) return element.classList.contains(hiddenClass);
  return element.hasAttribute("hidden");
}

function handleDisclosureBtnClick(btn, content) {
  const hiddenClass = btn.dataset.hiddenClass?.trim();
  let isHidden;
  if (hiddenClass) {
    isHidden = content.classList.toggle(hiddenClass);
  } else {
    isHidden = content.toggleAttribute("hidden");
  }
  btn.setAttribute("aria-expanded", !isHidden);
}

export default initializeDisclosures;
