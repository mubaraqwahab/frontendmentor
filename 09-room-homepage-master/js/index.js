import { Application, Controller } from "stimulus";
import Disclosure from "../../shared/disclosure";

class NavigationController extends Controller {
  static targets = ["button", "menuIcon", "closeIcon", "body"];

  connect() {
    this.disclosure = new Disclosure(this.buttonTarget);

    // Toggle between menu/close icon on nav toggle.
    this.disclosure.addListener(({ target }) => {
      const { hiddenClass } = target;
      if (target.open) {
        this.menuIconTarget.classList.add(hiddenClass);
        this.closeIconTarget.classList.remove(hiddenClass);
      } else {
        this.closeIconTarget.classList.add(hiddenClass);
        this.menuIconTarget.classList.remove(hiddenClass);
      }
    });
  }

  /** Close the navigation if user clicks outside it (and not the nav button) */
  closeOnOutsideClick(e) {
    if (
      !this.bodyTarget.contains(e.target) &&
      !this.buttonTarget.contains(e.target)
    ) {
      this.disclosure.open = false;
    }
  }

  /** Close the navigation if the focus leaves the links within it or the button */
  closeOnBlur(e) {
    if (
      !this.bodyTarget.contains(e.relatedTarget) &&
      e.relatedTarget !== this.buttonTarget
    ) {
      this.disclosure.open = false;
    }
  }

  disconnect() {
    this.disclosure = null;
  }
}

class CarouselController extends Controller {}

const application = Application.start();
application.register("navigation", NavigationController);
application.register("carousel", CarouselController);
