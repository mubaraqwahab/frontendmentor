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

class CarouselController extends Controller {
  static targets = ["slide", "controls"];

  connect() {
    this.showCurrentSlide();
    this.controlsTarget.classList.remove("hidden");
  }

  prevSlide() {
    this.index--;
  }

  nextSlide() {
    this.index++;
  }

  get index() {
    return parseInt(this.data.get("index"), 10);
  }

  set index(value) {
    this.prevIndex = this.index;

    // Index should never underflow/overflow
    let normalizedIndex =
      value < 0
        ? value + this.slideTargets.length
        : value % this.slideTargets.length;

    this.data.set("index", normalizedIndex);
    this.showCurrentSlide();
  }

  showCurrentSlide() {
    const currentClass = this.data.get("current-class");
    // Remove current class from previous slide
    this.slideTargets[this.prevIndex]?.classList.remove(currentClass);
    // Add it to the new slide
    this.slideTargets[this.index].classList.add(currentClass);
  }
}

const application = Application.start();
application.register("navigation", NavigationController);
application.register("carousel", CarouselController);
