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
	static targets = ["label", "input"];

	labelTarget: HTMLElement;
	inputTarget: HTMLInputElement;

	connect() {
		// Programmatically changing input.value doesn't trigger event listeners.
		// This is a workaround. See https://stackoverflow.com/a/55033939/12695621
		const valueDesc = Object.getOwnPropertyDescriptor(
			HTMLInputElement.prototype,
			"value"
		);
		const toggleLabel = this.toggleLabel.bind(this);
		Object.defineProperty(this.inputTarget, "value", {
			...valueDesc,
			set(value) {
				valueDesc.set.call(this, value);
				toggleLabel();
			},
		});
	}

	/**
	 * Simulate the <input> placeholder attribute behaviour;
	 * show the label when input is empty, hide otherwise.
	 */
	toggleLabel() {
		const labelHiddenClass = this.data.get("labelHiddenClass");
		this.labelTarget.classList.toggle(
			labelHiddenClass,
			!!this.inputTarget.value
		);
	}
}

interface ShortenedURLResult {
	shortUrl: string;
	fullShortUrl: string;
	originalUrl: string;
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

	// TODO
	// * Announce <li> insertion
	// * Prepend https:// to shortUrl

	async submit(e: Event) {
		e.preventDefault();
		const {
			formTarget,
			inputTarget,
			resultTemplateTarget,
			resultListTarget,
			createResultLi,
			shorten,
		}: UrlShortenerController = this;

		if (formTarget.checkValidity()) {
			this.setInputValidity(true);
			const shortened = await shorten(inputTarget.value);

			if ("error" in shortened) {
				this.setInputValidity(false);
			} else {
				const resultLi = createResultLi(
					resultTemplateTarget.innerHTML,
					shortened
				);
				resultListTarget.insertBefore(
					resultLi,
					resultListTarget.firstElementChild
				);
				inputTarget.value = "";
				inputTarget.setAttribute("value", "");
			}
		} else {
			this.setInputValidity(false);
		}
	}

	private createResultLi(
		html: string,
		shortened: ShortenedURLResult
	): HTMLLIElement {
		const resultHTML = html.replace(
			/{{ ([a-zA-Z]+) }}/g,
			(_, placeholder: string) => "" + shortened[placeholder]
		);
		const resultLi = document.createElement("li");
		resultLi.innerHTML = resultHTML;
		return resultLi;
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

	private shorten(url: string): Promise<ShortenedURLResult | { error: Error }> {
		interface ShrtCodeResponse {
			ok: boolean;
			result: {
				short_link: string;
				full_short_link: string;
			};
		}

		return fetch(
			`https://api.shrtco.de/v2/shorten?url=${encodeURIComponent(url)}`
		)
			.then((response) => {
				if (response.ok) return response.json();
				throw new Error(response.statusText);
			})
			.then(
				(data: ShrtCodeResponse): ShortenedURLResult => {
					if (data.ok) {
						return {
							shortUrl: data.result.short_link,
							fullShortUrl: data.result.full_short_link,
							originalUrl: url,
						};
					} else {
						throw new Error(`Malformed URL ${url}`);
					}
				}
			)
			.catch((error) => ({ error }));
	}
}

const application = Application.start();
application.register("navigation", NavigationController);
application.register("form-field", FormFieldController);
application.register("url-shortener", UrlShortenerController);
