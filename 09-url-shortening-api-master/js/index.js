import { Application, Controller } from "stimulus";

class HelloController extends Controller {
  static get targets() {
    // For each target [name], there is
    // * a this.[name]Target prop,
    // * a this.[name]Targets prop and
    // * a this.has[Name]Target prop.
    return [];
  }

  initialize() {}

  connect() {}

  disconnect() {}
}

const application = Application.start();
application.register("hello", HelloController);
