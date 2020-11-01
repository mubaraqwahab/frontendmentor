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
  static targets = ["slide", "prevBtn", "nextBtn"];

  connect() {
    this.showCurrentSlide();
  }

  prevSlide() {
    this.index--;
  }

  nextSlide() {
    this.index++;
  }

  get index() {
    return parseInt(this.data.get("index"), 10) || 0;
  }

  set index(i) {
    this.prevIndex = this.index;
    this.data.set("index", i);
    this.showCurrentSlide();
  }

  showCurrentSlide() {
    // Remove current class from previous slide
    this.slideTargets[this.prevIndex]?.classList.remove("slide--current");

    this.slideTargets[this.index].classList.add("slide--current");

    this.prevBtnTarget.disabled = this.index === 0;
    this.nextBtnTarget.disabled = this.index === this.slideTargets.length - 1;
  }
}

const application = Application.start();
application.register("navigation", NavigationController);
application.register("carousel", CarouselController);
