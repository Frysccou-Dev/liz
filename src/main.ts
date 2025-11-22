import { createApp } from "vue";
import App from "./App.vue";
import "./main.css";
import router from "./router";

import { createPinia } from "pinia";
import { registerSW } from "virtual:pwa-register";

const app = createApp(App);

app.config.errorHandler = (err, instance, info) => {
  console.error("Global error:", err);
  console.error("Error info:", info);
  console.error("Component:", instance);
};

window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);
  event.preventDefault();
});

app.use(createPinia());
app.use(router);

app.mount("#app");

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("New version available. Update now?")) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log("App ready to work offline");
  },
});
