const shareBtn = document.querySelector(".article-card__share-btn");
const shareTooltip = document.querySelector(".article-card__share-tooltip");
const authorDateContainer = document.querySelector(
  ".article-card__author-date-container"
);

// On click of the share btn on a mobile,
// If the footer is visible, hide it. Otherwise, unhide it
// Same goes for the .share-box.
// Note that the footer and .share-box can't be both hidden or visible.
// Also, change the button style to active and update aria-expanded.

// On a desktop, only difference is you never hide the footer (CSS handles this).

shareBtn.addEventListener("click", function (e) {
  shareTooltip.classList.toggle("article-card__share-tooltip--hidden");
  authorDateContainer.classList.toggle(
    "article-card__author-date-container--hidden-mobile"
  );

  const isShareTooltipVisible = shareBtn.classList.toggle(
    "article-card__share-btn--active"
  );
  shareBtn.setAttribute("aria-expanded", isShareTooltipVisible);
});
