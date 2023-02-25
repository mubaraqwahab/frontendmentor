const THEME_STORAGE_KEY = "calculator-app-theme"

export function initThemeSwitch() {
	const themeSwitch = document.querySelectorAll<HTMLInputElement>("input[name='themeSwitch']")

	themeSwitch.forEach((radio) => {
		radio.addEventListener("change", () => {
			document.documentElement.dataset.theme = radio.value
			localStorage.setItem(THEME_STORAGE_KEY, radio.value)
		})

		// Get theme from localstorage
		const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
		if (savedTheme === radio.value) {
			radio.checked = true
			// Programmatically setting `checked` doesn't trigger a change event,
			// so update the theme manually.
			document.documentElement.dataset.theme = radio.value
		}
	})
}
