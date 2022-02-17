import Vue from "vue";
import GlobalComponents from "./plugins/globalComponents";
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import App from "./App.vue";

// router setup
import router from "./routes/router";

// store
import store from "./store";

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'


/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import specific icons */
import {  faUnlockKeyhole } from '@fortawesome/free-solid-svg-icons'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* add icons to the library */
library.add(faUnlockKeyhole)


// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

/* add font awesome icon component */
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

// import "./assets/vendors/mdi/css/materialdesignicons.min.css";
// import "./assets/vendors/flag-icon-css/css/flag-icon.min.css";
// import "./assets/vendors/css/vendor.bundle.base.css";
// import "./assets/vendors/jquery-bar-rating/css-stars.css";
// import "./assets/vendors/font-awesome/css/font-awesome.min.css";
// import "./assets/css/demo_2/style.css";
// import "./assets/images/favicon.png";

// import "@/assets/css/layout.css"
import "@/assets/css/layout_a.css"
import "@/assets/css/main.css"

// plugin setup
Vue.use(GlobalComponents);

/* eslint-disable no-new */
new Vue({
  el: "#app",
  render: h => h(App),
  router,
  store
});
