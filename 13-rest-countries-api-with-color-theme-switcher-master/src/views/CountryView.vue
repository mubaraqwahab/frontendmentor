<script setup>
import { computed, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { store } from "@/store";

const route = useRoute();

const country = computed(() => {
	return store.countries.find((c) => c.alpha3Code === route.params.code);
});

const borderCountries = computed(() => {
	const borders = country.value?.borders;
	if (borders) {
		return store.countries.filter((c) => borders.includes(c.alpha3Code));
	} else {
		return [];
	}
});

watchEffect(
	() => (console.log("s", store.countries), console.log("c", country.value))
);
watchEffect(() => console.log(borderCountries.value));

function formatNum(num) {
	return new Intl.NumberFormat().format(num);
}
</script>

<template>
	<div class="px-2 py-6">
		<div class="mb-8">
			<RouterLink to="-1" @click.prevent="() => $router.go(-1)" class="btn">
				&leftarrow; Back
			</RouterLink>
		</div>

		<template v-if="country">
			<img :src="country.flag" alt="" class="mb-8" />

			<h1 class="text-2xl font-bold mb-6">{{ country.name }}</h1>

			<dl class="space-y-2 mb-8">
				<div class="flex gap-1">
					<dt>Native Name:</dt>
					<dd></dd>
				</div>
				<div>
					<dt>Population:</dt>
					<dd>{{ formatNum(country.population) }}</dd>
				</div>
				<div>
					<dt>Region:</dt>
					<dd>{{ country.region }}</dd>
				</div>
				<div>
					<dt>Sub Region:</dt>
					<dd>{{ country.subregion }}</dd>
				</div>
				<div class="!mb-8">
					<dt>Capital:</dt>
					<dd>{{ country.capital }}</dd>
				</div>

				<div>
					<dt>Top Level Domain:</dt>
					<dd>{{ country.topLevelDomain.join(", ") }}</dd>
				</div>
				<div>
					<dt>Currencies:</dt>
					<dd>{{ country.currencies.map((c) => c.name).join(", ") }}</dd>
				</div>
				<div>
					<dt>Languages:</dt>
					<dd>{{ country.languages.map((l) => l.name).join(", ") }}</dd>
				</div>
			</dl>

			<div v-if="borderCountries.length">
				<h2 class="text-lg font-medium">Border Countries:</h2>
				<ul class="grid grid-cols-3 gap-3">
					<li
						v-for="borderCountry in borderCountries"
						:key="borderCountry.alpha3Code"
					>
						<RouterLink :to="`/${borderCountry.alpha3Code}`" class="btn">
							{{ borderCountry.name }}
						</RouterLink>
					</li>
				</ul>
			</div>
		</template>
		<template v-else>
			Country not found
		</template>
	</div>
</template>

<style scoped>
dl > div {
	@apply flex gap-1;
}

dl dt {
	@apply font-medium;
}

.btn {
	@apply border rounded shadow px-6 py-2;
}
</style>
