import copy from "copy-text-to-clipboard";

export const mixin = {
  methods: {
    capitalizeFirstLetter: str => str.charAt(0).toUpperCase() + str.slice(1),
    copyToClipboad: text => copy(text)
  }
};
