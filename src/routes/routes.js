import MainPage from "@/views/MainPage.vue";
import NotFound from "@/views/NotFoundPage.vue";
import SignIn from "@/views/SignIn.vue";
import Authorize2FA from "@/views/Authorize2FA.vue";
import Setup2FA from "@/views/Setup2FA.vue";
import Activate2FA from "@/views/Activate2FA.vue";
import RecoverAccount from "@/views/RecoverAccount.vue";
import ResetPassword from "@/views/ResetPassword.vue";

const routes = [
  { path: "/", name: "Dashboard", component: MainPage },
  { path: "/sign-in", name: "Sign In", component: SignIn },
  { path: "/two-factor-challenge", name: "Authorize 2FA", component: Authorize2FA },
  { path: "/setup-2fa", name: "Setup 2FA", component: Setup2FA },
  { path: "/activate-2fa", name: "Activate 2FA", component: Activate2FA },
  { path: "/recover-account", name: "Recover Account", component: RecoverAccount },
  { path: "/reset-password", name: "Reset Password", component: ResetPassword },
  { path: "/:pathMatch(.*)*", name: "NOTFOUND", component: NotFound }
];

export default routes;
