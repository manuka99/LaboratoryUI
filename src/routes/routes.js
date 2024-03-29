import MainPage from "@/views/MainPage.vue";
import SignIn from "@/views/SignIn.vue";
import Authorize2FA from "@/views/Authorize2FA.vue";
import ActivatePhone from "@/views/ActivatePhone.vue";
import RecoverAccount from "@/views/RecoverAccount.vue";
import ResetPassword from "@/views/ResetPassword.vue";
import AccountMainLayout from "@/views/Account/Main.vue";
import SignTransactionView from "@/views/SignTransactionView.vue";
import SubmitTransaction from "@/views/SubmitTransaction.vue";
import Error401 from "@/views/Errors/Error401.vue";
import Error403 from "@/views/Errors/Error403.vue";
import Error404 from "@/views/Errors/Error404.vue";
import Error406 from "@/views/Errors/Error406.vue";

const routes = [
  { path: "/", name: "Introduction", component: MainPage },
  { path: "/sign-in", name: "Sign In", component: SignIn },
  {
    path: "/two-factor-challenge",
    name: "Authorize 2FA",
    component: Authorize2FA
  },
  { path: "/activate-phone", name: "Activate Phone", component: ActivatePhone },
  {
    path: "/recover-account",
    name: "Recover Account",
    component: RecoverAccount
  },
  {
    path: "/reset-password/:nic",
    name: "Reset Password",
    component: ResetPassword
  },
  // account management
  {
    path: "/account-management",
    name: "Account Management",
    component: AccountMainLayout
  },
  // sign-transaction
  {
    path: "/txsigner",
    name: "Sign Transaction",
    component: SignTransactionView
  },
  // submit-transaction
  {
    path: "/submit",
    name: "Submit Transaction",
    component: SubmitTransaction
  },
  // errors
  { path: "/401", name: "No Authorization Found", component: Error401 },
  { path: "/403", name: "No Required Permissions", component: Error403 },
  { path: "/406", name: "Already Authorized", component: Error406 },
  { path: "/:pathMatch(.*)*", name: "NOTFOUND", component: Error404 }
];

export default routes;
