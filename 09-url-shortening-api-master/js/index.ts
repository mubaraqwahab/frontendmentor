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
	ok: boolean;
	shortUrl?: string;
	fullShortUrl?: string;
	originalUrl?: string;
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
			resultListTarget.appendChild(createResultLi(result))
		);
	}

	async submit(e: Event) {
		e.preventDefault();
		const {
			formTarget,
			inputTarget,
			addResult,
			shorten,
			setInputValidity,
		}: UrlShortenerController = this;

		const failedClass = this.data.get("shortenFailedClass");
		this.element.classList.remove(failedClass); // if necessary

		if (formTarget.checkValidity()) {
			setInputValidity(true);

			const loadingClass = this.data.get("loadingClass");
			this.element.classList.add(loadingClass);

			const shortened: ShortenedURLResult = await shorten(inputTarget.value);
			this.element.classList.remove(loadingClass);

			if (shortened.ok) {
				addResult(shortened);
				inputTarget.value = "";
			} else {
				this.element.classList.add(failedClass);
			}
		} else {
			setInputValidity(false);
		}
	}

	/**
	 * Prepend a shortened URL result to the results list, DOM list and storage list.
	 * This function also trims the lists, so they are never longer 3 elements.
	 */
	private addResult = (result: ShortenedURLResult) => {
		const {
			results,
			resultListTarget,
			createResultLi,
		}: UrlShortenerController = this;

		if (results.length === 3) {
			results.pop();
			resultListTarget.lastElementChild.remove();
		}

		results.unshift(result);
		const resultLi = createResultLi(result);
		resultListTarget.insertBefore(resultLi, resultListTarget.firstElementChild);

		sessionStorage.setItem("shortenedURLResults", JSON.stringify(results));
	};

	/**
	 * Create an <li> element containing a compiled result template.
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
		const {
			helperTextTarget,
			inputTarget,
			formTarget,
			data,
		}: UrlShortenerController = this;
		const errorClass = data.get("formErrorClass");

		if (valid) {
			formTarget.classList.remove(errorClass);
			inputTarget.setAttribute("aria-invalid", "false");
			inputTarget.removeAttribute("aria-describedby");
		} else {
			formTarget.classList.add(errorClass);
			inputTarget.setAttribute("aria-invalid", "true");
			inputTarget.setAttribute("aria-describedby", helperTextTarget.id);
			inputTarget.focus();
		}
	};

	private shorten(url: string): Promise<ShortenedURLResult> {
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
			.then((response) => response.json())
			.then(
				(data: ShrtCodeResponse): ShortenedURLResult => ({
					ok: data.ok,
					shortUrl: data.result?.short_link,
					fullShortUrl: data.result?.full_short_link,
					originalUrl: url,
				}),
				() => ({ ok: false })
			);
	}
}

class ClipboardController extends Controller {
	static targets = ["source"];

	sourceTarget: HTMLAnchorElement;

	copy(e: Event) {
		navigator.clipboard.writeText(this.sourceTarget.href).then(
			() => this.element.classList.add(this.data.get("copiedClass")),
			() => this.element.classList.add(this.data.get("copyFailedText"))
		);
	}
}

const application = Application.start();
application.register("navigation", NavigationController);
application.register("form-field", FormFieldController);
application.register("url-shortener", UrlShortenerController);
application.register("clipboard", ClipboardController);
