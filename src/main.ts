import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import Dialog from "primevue/dialog";
import Button from "primevue/button";

import "primevue/resources/primevue.min.css";
import "primevue/resources/themes/saga-blue/theme.css";
import Dropdown from "primevue/dropdown";
import Textarea from "primevue/textarea";

createApp(App)
    .use(router)
    .use(PrimeVue)
    .component('Dialog', Dialog)
    .component('Button', Button)
    .component('Dropdown', Dropdown)
    .component('Textarea', Textarea)
    .mount('#app')
