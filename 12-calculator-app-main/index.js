// @ts-check

/**
 * @type {NodeListOf<HTMLInputElement>}
 */
const themeSwitch = document.querySelectorAll("input[name='themeSwitch']")
themeSwitch.forEach((radio) => {
	radio.addEventListener("change", () => {
		document.documentElement.dataset.theme = radio.value
	})
})

const view = document.querySelector("[data-view]")
const keys = document.querySelectorAll(".Key")
keys.forEach((key) => {
	key.addEventListener("click", (e) => {
		e.preventDefault()
		view.textContent = [...view.textContent.split(" "), key.textContent.trim()].join(" ")
		// console.log(key.textContent.trim())
	})
})

/**
 * Format a numeric string into a comma-separated one.
 * @param {string} numStr
 */
function formatNum(numStr) {
	let formatted = ""

	// TODO: what if the numstr begins with a sign or is a float?

	const len = numStr.length
	for (let i = 1; i <= len; i++) {
		const nextDigit = numStr[len - i]
		// Add a comma if i is a multiple of 3 and there's more digits in front
		formatted = (i % 3 === 0 && i < len ? "," : "") + nextDigit + formatted
	}

	return formatted
}

window.play = function (num) {
	const fmtted = formatNum(num)
	const pattern = /^(\d{1,3})(,\d{3})*$/
	console.log(fmtted)
	console.log(pattern.test(fmtted))
}
