import { reactive, watchEffect } from "vue";

export const store = reactive({
	countries: [],
});

watchEffect(() => console.log("store changed", store.countries));
