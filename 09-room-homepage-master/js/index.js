import { Application } from "stimulus";

import DisclosureController from "./disclosure_controller";
import CarouselController from "./carousel_controller";

const application = Application.start();
application.register("disclosure", DisclosureController);
application.register("carousel", CarouselController);
