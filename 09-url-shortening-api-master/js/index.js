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

const application = Application.start();
application.register("navigation", NavigationController);
