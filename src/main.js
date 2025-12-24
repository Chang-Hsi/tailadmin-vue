// main.js
import { createApp } from "vue";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import { definePreset } from "@primeuix/themes";

import App from "./App.vue";
import router from "./router";
import Tooltip from "primevue/tooltip";
import "./assets/style.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);

const AuraPurple = definePreset(Aura, {
  semantic: {
    primary: {
      50: "{indigo.50}",
      100: "{indigo.100}",
      200: "{indigo.200}",
      300: "{indigo.300}",
      400: "{indigo.400}",
      500: "{indigo.500}",
      600: "{indigo.600}",
      700: "{indigo.700}",
      800: "{indigo.800}",
      900: "{indigo.900}",
      950: "{indigo.950}",
    },
  },
});

app.use(PrimeVue, {
  theme: {
    preset: AuraPurple,
    options: {
      darkModeSelector: "system",
      cssLayer: false,
    },
  },
});

app.directive("tooltip", Tooltip);

app.mount("#app");
