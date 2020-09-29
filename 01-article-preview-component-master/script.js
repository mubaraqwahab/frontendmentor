const shareBtnClass = "article-card__share-btn";
const shareTooltipClass = "article-card__share-tooltip";
const authorDateClass = "article-card__author-date-container";

const shareBtn = document.querySelector("." + shareBtnClass);
const shareTooltip = document.querySelector("." + shareTooltipClass);
const authorDate = document.querySelector("." + authorDateClass);

/**
 * If `force` isn't given, do the following:
 * - toggle the visibility of the share tooltip,
 * - toggle the *--active class and aria-expanded attribute on the share btn,
 * - toggle the visibilty of the author-date container on a mobile only.
 *
 * Note that on a mobile, the share tooltip and author-date container
 * can't be both hidden or visible.
 *
 * @param {boolean} [force] - If true, shows the tooltip. If false, hides the tooltip.
 * In either case, it toggles necessary properties of the share btn and author-date container.
 */
function toggleShareTooltip(force) {
  shareTooltip.classList.toggle(`${shareTooltipClass}--hidden`, boolNot(force));
  authorDate.classList.toggle(`${authorDateClass}--hidden-mobile`, force);

  const isTooltipOpen = shareBtn.classList.toggle(
    `${shareBtnClass}--active`,
    force
  );

  shareBtn.setAttribute("aria-expanded", isTooltipOpen);
}

/**
 * Same as logical NOT operator (!), but only on a boolean.
 * If value is not a boolean, return value.
 *
 * @param value
 */
function boolNot(value) {
  if (typeof value === "boolean") return !value;
  return value;
}

shareBtn.addEventListener("click", () => toggleShareTooltip());

// When user clicks outside share tooltip (but not on share btn), close share tooltip.
document.addEventListener("click", function (e) {
  const isTooltipClicked = e.target.closest("." + shareTooltipClass) !== null;
  const isShareButtonClicked = e.target.closest("." + shareBtnClass) !== null;

  if (!isTooltipClicked && !isShareButtonClicked) {
    toggleShareTooltip(false);
  }
});

// When share tooltip is open (this condition is important!) and
// user presses the esc key, close share tooltip.
document.addEventListener("keydown", function (e) {
  const isTooltipOpen = shareBtn.classList.contains(`${shareBtnClass}--active`);

  if (isTooltipOpen && e.key === "Escape") {
    toggleShareTooltip(false);
    shareBtn.focus();
  }
});

// Hide the share tooltip when focus leaves the links within it.
shareTooltip
  .querySelectorAll(".article-card__social-icon-link")
  .forEach((socialLink) => {
    socialLink.addEventListener("blur", function (e) {
      // Related target refers to the next element on the page to receive focus.
      // If there's no such element, its value is null
      // (See https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent/relatedTarget)
      const nextFocused = e.relatedTarget;

      // Hide the tooltip if the next focused isn't in the tooltip
      // Note here: the tooltip isn't hidden when next focused === null
      // i.e. when the next focused is outside the current document
      if (nextFocused && !nextFocused.closest("." + shareTooltipClass)) {
        toggleShareTooltip(false);
      }
    });
  });
