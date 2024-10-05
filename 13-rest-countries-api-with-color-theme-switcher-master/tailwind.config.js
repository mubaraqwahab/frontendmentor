import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
	theme: {
		extend: {
			container: {
				center: true,
				padding: "1rem",
			},
		},
	},
	plugins: [forms],
};
