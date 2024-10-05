import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import { store } from "@/store";
import CountryView from "@/views/CountryView.vue";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			beforeEnter: async (from, to, next) => {
				console.log({ from, to, next });
				const response = await fetch("/data.json");
				const countries = await response.json();
				store.countries = countries.sort((a, b) =>
					a.name.localeCompare(b.name)
				);
				console.log(store.countries);
				next();
			},
			children: [
				{
					path: "",
					component: HomeView,
				},
				{
					path: ":code",
					component: CountryView,
				},
			],
		},
	],
});

export default router;
