import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routes";
import { PermissionedRouting } from "./permission";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  routes,
  linkActiveClass: "active",
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition;
    }
    if (to.hash) {
      return { selector: to.hash };
    }
    return { x: 0, y: 0 };
  }
});

router.beforeEach(PermissionedRouting);

export default router;
