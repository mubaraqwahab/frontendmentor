<script setup>
import { onMounted, ref, watchEffect, computed } from "vue";
import { store } from "@/store";

const countryFilter = ref("");
const regionFilter = ref("");

const filteredCountries = computed(() => {
	let filtered = store.countries;
	if (regionFilter.value) {
		filtered = filtered.filter((c) => c.region === regionFilter.value);
	}
	if (countryFilter.value) {
		filtered = filtered.filter((c) =>
			c.name.toLowerCase().includes(countryFilter.value.toLowerCase())
		);
	}
	return filtered;
});

function formatNum(num) {
	return new Intl.NumberFormat().format(num);
}
</script>

<template>
	<form class="mb-8">
		<div class="mb-8">
			<label for="country" class="sr-only">Search for a country...</label>
			<input
				type="text"
				id="country"
				placeholder="Search for a country..."
				v-model="countryFilter"
				class="rounded-md block w-full"
			/>
		</div>

		<div>
			<label for="region" class="sr-only">Filter by Region</label>
			<select
				name="region"
				id="region"
				v-model="regionFilter"
				class="rounded-md w-1/2"
			>
				<option value="" selected>Filter by Region</option>
				<option value="Africa">Africa</option>
				<option value="America">America</option>
				<option value="Asia">Asia</option>
				<option value="Europe">Europe</option>
				<option value="Oceania">Oceania</option>
			</select>
		</div>
	</form>

	<ul class="grid gap-8 px-8">
		<li v-for="country in filteredCountries" :key="country.alpha3Code">
			<RouterLink
				:to="`/${country.alpha3Code}`"
				class="border block rounded-md overflow-hidden"
			>
				<img :src="country.flag" alt="" />
				<div class="p-6">
					<strong class="block mb-3 text-lg">{{ country.name }}</strong>
					<p><span>Population:</span> {{ formatNum(country.population) }}</p>
					<p><span>Region:</span> {{ country.region }}</p>
					<p><span>Capital:</span> {{ country.capital }}</p>
				</div>
			</RouterLink>
		</li>
	</ul>
</template>
