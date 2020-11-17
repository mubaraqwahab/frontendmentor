import { Application, Controller } from "stimulus";

class NavigationController extends Controller {
  static targets = ["nav"];

  navTarget!: HTMLElement;

  toggle(e: Event) {
    const button = e.target as HTMLButtonElement;
    const hiddenClass = this.data.get("hiddenClass")!;

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
  static targets = ["label"];

  labelTarget!: HTMLElement;

  /**
   * Simulate the <input> placeholder attribute behaviour;
   * show the label when input is empty, hide otherwise.
   */
  toggleLabel(e: Event) {
    const input = e.target as HTMLInputElement;
    const labelHiddenClass = this.data.get("labelHiddenClass")!;
    this.labelTarget.classList.toggle(labelHiddenClass, !!input.value);
  }
}

class UrlShortenerController extends Controller {
  static targets = ["form", "resultTemplate", "resultList"];

  formTarget!: HTMLFormElement;
  resultTemplateTarget!: HTMLTemplateElement;
  resultListTarget!: HTMLUListElement;

  connect() {
    this.formTarget.noValidate = true;
  }
}

const application: Application = Application.start();
application.register("navigation", NavigationController);
application.register("form-field", FormFieldController);
application.register("url-shortener", UrlShortenerController);
