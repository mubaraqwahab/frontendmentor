const shareBtnClass = "article-card__share-btn";
const shareTooltipClass = "article-card__share-tooltip";
const authorDateClass = "article-card__author-date-container";

const shareBtn = document.querySelector("." + shareBtnClass);
const shareTooltip = document.querySelector("." + shareTooltipClass);
const authorDate = document.querySelector("." + authorDateClass);

/**
 * Toggles the visibility of the share tooltip,
 * toggles the *--active class and aria-expanded attribute on the share btn,
 * toggles the visibilty of the author-date container on a mobile only.
 *
 * Note that on a mobile, the share tooltip and author-date container
 * can't be both hidden or visible.
 */
function toggleShareTooltip() {
  shareTooltip.classList.toggle(`${shareTooltipClass}--hidden`);
  authorDate.classList.toggle(`${authorDateClass}--hidden-mobile`);

  const isTooltipOpen = shareBtn.classList.toggle(`${shareBtnClass}--active`);

  shareBtn.setAttribute("aria-expanded", isTooltipOpen);
}

shareBtn.addEventListener("click", toggleShareTooltip);

// When share tooltip is open (this condition is important!) and
// user clicks outside it (but not on share btn),
// close share tooltip.
document.addEventListener("click", function (e) {
  const isShareButtonClicked = e.target.closest("." + shareBtnClass) !== null;
  const isTooltipClicked = e.target.closest("." + shareTooltipClass) !== null;
  const isTooltipOpen = shareBtn.classList.contains(`${shareBtnClass}--active`);

  if (isTooltipOpen && !isTooltipClicked && !isShareButtonClicked) {
    toggleShareTooltip();
  }
});

// When share tooltip is open (this condition is important!) and
// user presses the esc key, close share tooltip.
document.addEventListener("keydown", function (e) {
  const isTooltipOpen = shareBtn.classList.contains(`${shareBtnClass}--active`);
  const isEscKeyPressed = e.key === "Escape";

  if (isTooltipOpen && isEscKeyPressed) {
    toggleShareTooltip();
  }
});
