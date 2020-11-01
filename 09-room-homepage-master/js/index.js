import { Application, Controller } from "stimulus";

class DisclosureController extends Controller {}

class CarouselController extends Controller {}

const application = Application.start();
application.register("disclosure", DisclosureController);
application.register("carousel", CarouselController);
