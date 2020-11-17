import { Application, Controller } from "stimulus";

class NavigationController extends Controller {
  static get targets() {
    return ["nav"];
  }

  toggle(e) {
    const button = /** @type {HTMLButtonElement} */ (e.target);
    const hiddenClass = this.data.get("hiddenClass");

    if (button.getAttribute("aria-expanded") === "false") {
      this.navTarget.classList.add(hiddenClass);
      button.setAttribute("aria-expanded", "true");
    } else {
      this.navTarget.classList.remove(hiddenClass);
      button.setAttribute("aria-expanded", "false");
    }
  }
}

class FormFieldController extends Controller {
  static get targets() {
    return ["label"];
  }

  /**
   * Simulate the <input> placeholder attribute behaviour;
   * show the label when input is empty, hide otherwise.
   */
  toggleLabel(e) {
    const labelHiddenClass = this.data.get("labelHiddenClass");
    this.labelTarget.classList.toggle(labelHiddenClass, !!e.target.value);
  }
}

class UrlShortenerController extends Controller {
  static get targets() {
    return ["form", "resultTemplate", "resultList"];
  }

  connect() {
    /** @type {HTMLFormElement}     */ this.formTarget;
    /** @type {HTMLTemplateElement} */ this.resultTemplateTarget;
    /** @type {HTMLUListElement}    */ this.resultListTarget;

    this.formTarget.noValidate = true;
  }
}

const application = Application.start();
application.register("navigation", NavigationController);
application.register("form-field", FormFieldController);
application.register("url-shortener", UrlShortenerController);
