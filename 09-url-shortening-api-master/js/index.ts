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
			set(v) {
				valueDesc.set.call(this, v);
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
		// For some reason, this is necessary
		this.createResultLi = this.createResultLi.bind(this);
	}

	// TODO
	// * Announce <li> insertion

	async submit(e: Event) {
		e.preventDefault();
		const {
			formTarget,
			inputTarget,
			resultListTarget,
			createResultLi,
			shorten,
		}: UrlShortenerController = this;

		// TODO: loading text
		if (formTarget.checkValidity()) {
			this.setInputValidity(true);
			const shortened = await shorten(inputTarget.value);

			if ("error" in shortened) {
				this.setInputValidity(false);
			} else {
				const resultLi = createResultLi(shortened);
				// TODO: Limit shown result count to 3 or 5
				resultListTarget.insertBefore(
					resultLi,
					resultListTarget.firstElementChild
				);
				inputTarget.value = "";
			}
		} else {
			this.setInputValidity(false);
		}
	}

	/**
	 * Create an <li> element containing an expanded result template.
	 */
	private createResultLi(shortened: ShortenedURLResult): HTMLLIElement {
		const resultHTML = this.resultTemplateTarget.innerHTML.replace(
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

class ClipboardController extends Controller {
	static targets = ["source", "copyBtnText"];

	sourceTarget: HTMLElement;
	copyBtnTextTarget: HTMLElement;

	initialize() {
		this.resetCopyBtnTextOnBlur = this.resetCopyBtnTextOnBlur.bind(this);
	}

	copy(e: Event) {
		navigator.clipboard.writeText(this.sourceTarget.textContent).then(
			() => {
				this.copyBtnTextTarget.textContent = this.data.get("copiedText");
				e.target.addEventListener("blur", this.resetCopyBtnTextOnBlur);
			},
			() => {
				this.copyBtnTextTarget.textContent = this.data.get("copyFailedText");
				e.target.addEventListener("blur", this.resetCopyBtnTextOnBlur);
			}
		);
	}

	private resetCopyBtnTextOnBlur(e: Event) {
		this.copyBtnTextTarget.textContent = this.data.get("copyText");
		e.target.removeEventListener("blur", this.resetCopyBtnTextOnBlur);
	}
}

const application = Application.start();
application.register("navigation", NavigationController);
application.register("form-field", FormFieldController);
application.register("url-shortener", UrlShortenerController);
application.register("clipboard", ClipboardController);
