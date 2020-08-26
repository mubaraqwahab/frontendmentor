/** @type {HTMLFormElement} */
const form = document.querySelector(".form");

// Disable the browser's validation.
// (I'm doing this here just as a progressive enhancement)
form.setAttribute("novalidate", "");

form.addEventListener("submit", function (event) {
  if (form.checkValidity()) {
    return;
  }

  form.querySelectorAll(".form-group").forEach((formGroup) => {
    /** @type {HTMLInputElement} */
    const input = formGroup.querySelector(".form-group__input");
    const { valid } = input.validity;

    // Add/remove the invalid class to the form group as appropriate.
    formGroup.classList.toggle("form-group--invalid", !valid);

    // Set/remove the aria-invalid attribute as appropriate
    input.setAttribute("aria-invalid", !valid);

    // Associate the error text with the invalid input or dissociate it from it, as appropriate.
    if (valid) {
      input.removeAttribute("aria-describedby");
    } else {
      const errorText = formGroup.querySelector(".form-group__error-text");
      input.setAttribute("aria-describedby", errorText.id);
    }
  });

  // Focus on the first invalid input
  form.querySelector(".form-group__input:invalid").focus();

  event.preventDefault();
});
