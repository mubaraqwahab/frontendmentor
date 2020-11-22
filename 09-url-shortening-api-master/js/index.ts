import { Application, Controller } from "stimulus";

class NavigationController extends Controller {
  static targets = ["nav"];

  navTarget: HTMLElement;

  toggle(e: Event) {
    const button = e.target as HTMLButtonElement;
    const hiddenClass = this.data.get("hiddenClass");

    const ariaExpanded = button.getAttribute("aria-expanded") !== "false";
    this.navTarget.classList.toggle(hiddenClass, !ariaExpanded);
    button.setAttribute("aria-expanded", "" + !ariaExpanded);
  }
}

class FormFieldController extends Controller {
  static targets = ["label"];

  labelTarget: HTMLElement;

  /**
   * Simulate the <input> placeholder attribute behaviour;
   * show the label when input is empty, hide otherwise.
   */
  toggleLabel(e: Event) {
    const input = e.target as HTMLInputElement;
    const labelHiddenClass = this.data.get("labelHiddenClass");
    this.labelTarget.classList.toggle(labelHiddenClass, !!input.value);
  }
}

class UrlShortenerController extends Controller {
  static targets = [
    "form",
    "input",
    "helperText",
    "resultTemplate",
    "resultList",
  ];

  formTarget: HTMLFormElement;
  inputTarget: HTMLInputElement;
  helperTextTarget: HTMLElement;
  resultTemplateTarget: HTMLTemplateElement;
  resultListTarget: HTMLUListElement;

  connect() {
    this.formTarget.noValidate = true;
  }

  async submit(e: Event) {
    e.preventDefault();
    const { formTarget, inputTarget }: UrlShortenerController = this;

    if (formTarget.checkValidity()) {
      this.setInputValidity(true);
      const shortened = await this.shorten(inputTarget.value);
      if ("error" in shortened) {
        return this.setInputValidity(false);
      }
      // ...
    } else {
      this.setInputValidity(false);
    }
  }

  private setInputValidity(valid: boolean) {
    const { helperTextTarget, inputTarget }: UrlShortenerController = this;
    const hiddenClass = this.data.get("hiddenClass");

    if (valid) {
      helperTextTarget.classList.add(hiddenClass); // if needed
      inputTarget.setAttribute("aria-invalid", "false");
      inputTarget.removeAttribute("aria-describedby");
    } else {
      helperTextTarget.classList.remove(hiddenClass);
      inputTarget.setAttribute("aria-invalid", "true");
      inputTarget.setAttribute("aria-describedby", helperTextTarget.id);
      inputTarget.focus();
    }
  }

  private shorten(url: string) {
    interface ShrtCodeResponse {
      ok: boolean;
      result: {
        short_link: string;
      };
    }

    return fetch(
      `https://api.shrtco.de/v2/shorten?url=${encodeURIComponent(url)}`
    )
      .then((response) => response.json())
      .then((data: ShrtCodeResponse) => {
        if (data.ok) {
          return {
            id: 0,
            originalUrl: url,
            shortUrl: data.result.short_link,
          };
        } else {
          throw new Error(`Malformed URL ${url}`);
        }
      })
      .catch((error) => ({ error }));
  }
}

const application = Application.start();
application.register("navigation", NavigationController);
application.register("form-field", FormFieldController);
application.register("url-shortener", UrlShortenerController);
