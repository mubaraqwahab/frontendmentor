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

	private results: ShortenedURLResult[];

	initialize() {
		const resultsInStorage = sessionStorage.getItem("shortenedURLResults");
		this.results = JSON.parse(resultsInStorage) ?? [];
	}

	connect() {
		const {
			formTarget,
			results,
			createResultLi,
			resultListTarget,
		}: UrlShortenerController = this;

		formTarget.noValidate = true;

		results.forEach((result) =>
			resultListTarget.insertBefore(
				createResultLi(result),
				resultListTarget.firstElementChild
			)
		);
	}

	// TODO
	// * Announce <li> insertion

	async submit(e: Event) {
		e.preventDefault();
		const {
			formTarget,
			inputTarget,
			addResult,
			shorten,
			setInputValidity,
			data,
			element,
		}: UrlShortenerController = this;

		// TODO: loading text
		if (formTarget.checkValidity()) {
			setInputValidity(true);

			const loadingClass = data.get("loadingClass");
			element.classList.add(loadingClass);

			const shortened = await shorten(inputTarget.value);

			if ("error" in shortened) {
				setInputValidity(false);
			} else {
				addResult(shortened);
				inputTarget.value = "";
			}

			element.classList.remove(loadingClass);
		} else {
			setInputValidity(false);
		}
	}

	/**
	 * Add a shortened URL result to the results list, DOM list and storage list.
	 * This function also trims the lists, so they are never longer 3 elements.
	 */
	private addResult = (result: ShortenedURLResult) => {
		const {
			results,
			resultListTarget,
			createResultLi,
		}: UrlShortenerController = this;

		if (results.length === 3) {
			results.shift();
			resultListTarget.lastElementChild.remove();
		}

		results.push(result);
		const resultLi = createResultLi(result);
		resultListTarget.insertBefore(resultLi, resultListTarget.firstElementChild);

		sessionStorage.setItem("shortenedURLResults", JSON.stringify(results));
	};

	/**
	 * Create an <li> element containing an expanded result template.
	 */
	private createResultLi = (shortened: ShortenedURLResult): HTMLLIElement => {
		const resultHTML = this.resultTemplateTarget.innerHTML.replace(
			/{{ ([a-zA-Z]+) }}/g,
			(_, placeholder: string) => "" + shortened[placeholder]
		);
		const resultLi = document.createElement("li");
		resultLi.innerHTML = resultHTML;
		return resultLi;
	};

	private setInputValidity = (valid: boolean) => {
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
	};

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

	private resetCopyBtnTextOnBlur = (e: Event) => {
		this.copyBtnTextTarget.textContent = this.data.get("copyText");
		e.target.removeEventListener("blur", this.resetCopyBtnTextOnBlur);
	};
}

const application = Application.start();
application.register("navigation", NavigationController);
application.register("form-field", FormFieldController);
application.register("url-shortener", UrlShortenerController);
application.register("clipboard", ClipboardController);
