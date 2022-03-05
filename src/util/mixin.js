import copy from "copy-text-to-clipboard";
import { BToast } from "bootstrap-vue";

export const mixin = {
  methods: {
    capitalizeFirstLetter: str => str.charAt(0).toUpperCase() + str.slice(1),
    copyToClipboad: text => {
      copy(text);
      let bootStrapToaster = new BToast();
      bootStrapToaster.$bvToast.toast("Copied successfully", {
        title: "SUCCESS! Task was completed.",
        autoHideDelay: 4000,
        appendToast: false,
        variant: "success",
        solid: true,
        toaster: "b-toaster-bottom-right"
      });
    },
    scrollTo: query => {
      let els = document.querySelectorAll(query);
      if (els && els.length > 0) {
        els[0].scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "start"
        });
      }
    }
  }
};
