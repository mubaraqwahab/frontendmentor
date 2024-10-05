<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
	<header class="">
		<div
			class="container flex items-center justify-between py-6 border-b shadow-md"
		>
			<RouterLink to="/" class="font-bold">Where in the world?</RouterLink>
			<button>Dark Mode</button>
		</div>
	</header>

	<main>
		<div class="container py-6">
			<RouterView />
		</div>
	</main>
</template>
