<template>
  <div>
    <!-- select signer mode -->
    <div>
      <b-form-group
        id="fieldset-1"
        description="There are several signing modes in stellar, to get more information visit their official website or contact our team. METASPECK will allow you to sign the transaction using a registered account credential."
        label="2) Transaction Signing Mode"
        class="font-16 font-weight-600 w-100 mt-2 max-width-500px"
        label-for="select-1"
      >
        <b-form-select
          id="select-1"
          class="w-auto min-width-300px"
          style="height: 40px"
          v-model="signingMode"
          :options="signingModeOptions"
          :disabled="value.loading"
        ></b-form-select>
      </b-form-group>
    </div>

    <!-- select metaspeck mode -->
    <div v-if="signingMode == 'metaspeck'">
      <b-form-group
        id="fieldset-1"
        description="Enter the public key registered with your METASPECK acount. If the account has multiple signers then check the signer's risk level to select the most suitable public key."
        label="Account Signer's Public Key"
        class="font-15 font-weight-600 w-100 mt-0 max-width-500px"
        label-for="input-0"
      >
      </b-form-group>
      <div class="max-width-500px">
        <b-form-input
          id="input-0"
          type="text"
          placeholder="Enter Signer's Public Key (Starting with G)"
          v-model="selectedAccount"
          :state="selectedAccountState.status"
          :disabled="value.loading"
          list="fsdf54dgvbvbv"
        ></b-form-input>

        <datalist id="fsdf54dgvbvbv">
          <option
            :value="signingAccountOption.value"
            v-for="(signingAccountOption, i) in signingAccountOptions"
            :key="i"
            >{{ signingAccountOption.text }}</option
          >
        </datalist>
      </div>

      <p
        v-if="selectedAccountState.status"
        class="text-success font-weight-bold mt-3 font-14 font-italic"
      >
        Transaction was signed successfully.
      </p>

      <p
        v-if="selectedAccountState.status == false"
        class="text-danger font-weight-bold mt-3 font-14 font-italic"
      >
        {{ selectedAccountState.message }}
      </p>
    </div>

    <div v-if="signingMode == 'metaspeck' && selectedAccount">
      <base-button
        class="mt-4 px-4 btn btn-primary btn-sm d-flex justify-content-center align-items-center font-16"
        type="submit"
        nativeType="submit"
        :disabled="value.loading"
        @click="signWithMETASPECK"
      >
        Sign with METASPECK
      </base-button>
    </div>

    <!-- select secretKey mode online -->
    <div v-if="signingMode == 'secretKey' && isOnline">
      <b-form-group
        id="fieldset-1"
        description="Enter the public key registered with your METASPECK acount. If the account has multiple signers then check the signer's risk level to select the most suitable public key."
        label="Account Signer's Public Key"
        class="font-15 font-weight-600 w-100 mt-0 max-width-500px"
        label-for="input-0"
      >
      </b-form-group>
      <div class="max-width-500px">
        <b-form-input
          id="input-0"
          type="text"
          placeholder="Enter Signer's Public Key (Starting with G)"
          v-model="selectedAccount"
          :state="selectedAccountState.status"
          :disabled="value.loading"
          list="fsdf54dgvbvbv"
        ></b-form-input>

        <datalist id="fsdf54dgvbvbv">
          <option
            :value="signingAccountOption.value"
            v-for="(signingAccountOption, i) in signingAccountOptions"
            :key="i"
            >{{ signingAccountOption.text }}</option
          >
        </datalist>
      </div>
    </div>

    <div v-if="signingMode == 'secretKey' && isOnline && selectedAccount">
      <b-form-group
        id="fieldset-1"
        description="Secret key is the your accounts's private key. If the account has multiple signers then check the signer's risk level to select the most suitable private key."
        label="Account Signer's Secret Key"
        class="font-15 font-weight-600 w-100 mt-3 max-width-500px"
        label-for="input-0"
      >
        <b-form-input
          id="input-0"
          type="password"
          placeholder="Enter Secret Key (Starting with S)"
          v-model="secretKey"
          :state="secretKeyState.status"
          :disabled="value.loading"
          trim
        ></b-form-input>
      </b-form-group>

      <p
        v-if="secretKeyState.status"
        class="text-success font-weight-bold font-14 font-italic"
      >
        Transaction was signed successfully.
      </p>

      <p
        v-if="secretKeyState.status == false"
        class="text-danger font-weight-bold font-14 font-italic"
      >
        {{ secretKeyState.message }}
      </p>
    </div>

    <div
      v-if="
        signingMode == 'secretKey' && isOnline && selectedAccount && secretKey
      "
    >
      <base-button
        class="mt-0 px-4 btn btn-primary btn-sm d-flex justify-content-center align-items-center font-16"
        type="submit"
        nativeType="submit"
        @click="signWithSecretKeyOnline"
        :disabled="value.loading"
      >
        Sign with Secret Key
      </base-button>
    </div>

    <!-- select secretKey mode offline -->
    <div v-if="signingMode == 'secretKey' && !isOnline">
      <b-form-group
        id="fieldset-1"
        description="Secret key is the your accounts's private key. If the account has multiple signers then check the signer's risk level to select the most suitable private key."
        label="Account Signer's Secret Key"
        class="font-15 font-weight-600 w-100 mt-0 max-width-500px"
        label-for="input-1"
        :state="secretKeyState.status"
      >
        <b-form-input
          id="input-1"
          type="password"
          placeholder="Enter Secret Key (Starting with S)"
          v-model="secretKey"
          :state="secretKeyState.status"
          :disabled="value.loading"
          trim
        ></b-form-input>
      </b-form-group>
      <p
        v-if="secretKeyState.status"
        class="text-success font-weight-bold font-14 font-italic"
      >
        Transaction was signed successfully.
      </p>

      <p
        v-if="secretKeyState.status == false"
        class="text-danger font-weight-bold font-14 font-italic"
      >
        {{ secretKeyState.message }}
      </p>
    </div>

    <div v-if="signingMode == 'secretKey' && !isOnline && secretKey">
      <base-button
        class="mt-0 px-4 btn btn-primary btn-sm d-flex justify-content-center align-items-center font-16"
        type="submit"
        nativeType="submit"
        @click="signWithSecretKeyOffline"
        :disabled="value.loading"
      >
        Sign with Secret Key
      </base-button>
    </div>

    <!-- select hashx mode offline -->
    <div v-if="signingMode == 'hashx' && !isOnline">
      <b-form-group
        id="fieldset-1"
        description="Hash Preimage (HEX) is the value of X where the hash of X is added as one of your accounts's signer. If the account has multiple signers then check the signer's risk level to select the most suitable key."
        label="Account's Hash Preimage"
        class="font-15 font-weight-600 w-100 mt-0 max-width-500px"
        label-for="input-2"
        :state="hashxPreimageState.status"
      >
        <b-form-input
          id="input-2"
          type="password"
          placeholder="Enter Hash Preimage (HEX)"
          v-model="hashxPreimage"
          :state="hashxPreimageState.status"
          :disabled="value.loading"
          trim
        ></b-form-input>
      </b-form-group>

      <p
        v-if="hashxPreimageState.status"
        class="text-success font-weight-bold font-14 font-italic"
      >
        Transaction was signed successfully.
      </p>

      <p
        v-if="hashxPreimageState.status == false"
        class="text-danger font-weight-bold font-14 font-italic"
      >
        {{ hashxPreimageState.message }}
      </p>
    </div>

    <div v-if="signingMode == 'hashx' && !isOnline && hashxPreimage">
      <base-button
        class="mt-0 px-4 btn btn-primary btn-sm d-flex justify-content-center align-items-center font-16"
        type="submit"
        nativeType="submit"
        @click="signWithHashX"
        :disabled="value.loading"
      >
        Sign with Hash Preimage
      </base-button>
    </div>

    <!-- select albedo mode offline -->
    <div v-if="signingMode == 'albedo' && !isOnline">
      <p
        v-if="albedoState.status"
        class="text-success font-weight-bold mb-3 font-14 font-italic"
      >
        Transaction was signed successfully.
      </p>
      <p
        v-if="albedoState.status == false"
        class="text-danger font-weight-bold mb-3 font-14 font-italic"
      >
        {{ albedoState.message }}
      </p>
      <base-button
        class="mt-0 px-4 btn btn-primary btn-sm d-flex justify-content-center align-items-center font-16"
        type="submit"
        nativeType="submit"
        @click="signWithAlbedoFn"
        :disabled="value.loading"
      >
        Sign with Albedo
      </base-button>
    </div>
  </div>
</template>

<script>
import { TransactionBuilder, Keypair } from "stellar-sdk";
import albedo from "@albedo-link/intent";
import { BLOCKCHAIN_NETWORK_NAME } from "@/services/config";
import { SignTransactionAPI } from "@/services/transaction.service";
export default {
  data() {
    return {
      signingMode: null,
      selectedAccount: null,
      selectedAccountState: {
        status: null,
        message: null
      },
      secretKey: null,
      secretKeyState: {
        status: null,
        message: null
      },
      hashxPreimage: null,
      hashxPreimageState: {
        status: null,
        message: null
      },
      albedoState: {
        status: null,
        message: null
      }
    };
  },
  props: {
    xdr: String,
    isOnline: Boolean,
    signatureInfo: Array,
    value: {
      type: Object,
      default: function() {
        return {
          loading: false
        };
      }
    }
  },
  watch: {
    signingMode() {
      this.selectedAccount = null;
      this.secretKey = null;
      this.secretKeyState = {
        status: null,
        message: null
      };
      this.hashxPreimage = null;
      this.hashxPreimageState = {
        status: null,
        message: null
      };
    },
    selectedAccount() {
      this.selectedAccountState.status = null;
      this.secretKey = null;
      this.secretKeyState = {
        status: null,
        message: null
      };
      this.hashxPreimage = null;
      this.hashxPreimageState = {
        status: null,
        message: null
      };
    },
    secretKey() {
      this.secretKeyState.status = null;
    },
    hashxPreimage() {
      this.hashxPreimageState.status = null;
    }
  },
  computed: {
    signingModeOptions() {
      var options = [
        {
          value: null,
          text: "Select Signing Mode"
        },
        {
          value: "metaspeck",
          text: "METASPECK"
        },
        {
          value: "secretKey",
          text: "Secret Key"
        }
      ];
      if (!this.isOnline) {
        options.push({
          value: "hashx",
          text: "Hash X"
        });
        options.push({
          value: "albedo",
          text: "ALBEDO"
        });
      }
      return options;
    },
    signingAccountOptions() {
      if (!this.signatureInfo) return null;
      return this.signatureInfo.map(signatureInfo => {
        return {
          value: signatureInfo.accountID,
          text: signatureInfo.shortPublicKey
        };
      });
    }
  },
  methods: {
    signWithMETASPECK() {
      this.value.loading = true;
      let payload = {
        isOnline: this.isOnline,
        accountID: this.selectedAccount,
        xdr: this.xdr,
        network: BLOCKCHAIN_NETWORK_NAME
      };
      SignTransactionAPI(payload)
        .then(res => {
          this.selectedAccountState.status = true;
          setTimeout(() => {
            this.selectedAccount = null;
            this.selectedAccountState.status = null;
          }, 4000);
          this.emitSignedDataFn(res.data.data.signature);
        })
        .catch(error => {
          this.selectedAccountState.message = error.message;
          if (
            error.response &&
            error.response.data &&
            error.response.data.data
          ) {
            this.selectedAccountState.message =
              error.response.data.data.message;
          }
          this.selectedAccountState.status = false;
        })
        .finally(() => (this.value.loading = false));
    },
    async signWithSecretKeyOnline() {
      try {
        this.value.loading = true;
        const tx = TransactionBuilder.fromXDR(
          this.xdr,
          BLOCKCHAIN_NETWORK_NAME
        );
        var keypair = Keypair.fromSecret(this.secretKey);
        const sig = tx.getKeypairSignature(keypair);
        this.secretKeyState.status = true;
        setTimeout(() => {
          this.secretKey = null;
          this.secretKeyState.status = null;
        }, 4000);
        this.emitSignedDataFn(sig);
      } catch (error) {
        this.secretKeyState.message = "Invalid private key";
        this.secretKeyState.status = false;
      } finally {
        this.value.loading = false;
      }
    },
    signWithSecretKeyOffline() {
      try {
        this.value.loading = true;
        const tx = TransactionBuilder.fromXDR(
          this.xdr,
          BLOCKCHAIN_NETWORK_NAME
        );
        var keypair = Keypair.fromSecret(this.secretKey);
        tx.sign(keypair);
        this.secretKeyState.status = true;
        setTimeout(() => {
          this.secretKey = null;
          this.secretKeyState.status = null;
        }, 4000);
        this.emitSignedDataFn(tx.toXDR());
      } catch (error) {
        this.secretKeyState.message = "Invalid private key";
        this.secretKeyState.status = false;
      } finally {
        this.value.loading = false;
      }
    },
    signWithHashX() {
      try {
        this.value.loading = true;
        const tx = TransactionBuilder.fromXDR(
          this.xdr,
          BLOCKCHAIN_NETWORK_NAME
        );
        tx.signHashX(this.hashxPreimage);
        this.hashxPreimageState.status = true;
        setTimeout(() => {
          this.hashxPreimage = null;
          this.hashxPreimageState.status = null;
        }, 4000);
        this.emitSignedDataFn(tx.toXDR());
      } catch (error) {
        this.hashxPreimageState.message = "Invalid value of Hash X";
        this.hashxPreimageState.status = false;
      } finally {
        this.value.loading = false;
      }
    },
    signWithAlbedoFn() {
      this.value.loading = true;
      var xdr = this.xdr;
      if (this.signingType == "secure") xdr = this.getPreAuthTxnHashXdr();
      let txIntentParams = {
        xdr,
        network: BLOCKCHAIN_NETWORK_NAME,
        submit: false
      };
      albedo
        .tx(txIntentParams)
        .then(res => {
          this.emitSignedDataFn(res.signed_envelope_xdr);
          this.albedoState.status = true;
          setTimeout(() => {
            this.albedoState.status = null;
          }, 4000);
        })
        .catch(e => {
          this.albedoState.message = e.message;
          this.albedoState.status = false;
          setTimeout(() => {
            this.albedoState.status = null;
          }, 4000);
        })
        .finally(() => (this.value.loading = false));
    },
    getPreAuthTxnHashXdr() {
      var tx = new TransactionBuilder();
    },
    emitSignedDataFn(signature) {
      this.$emit("signed", {
        type: "general",
        mode: this.signingMode,
        accountID: this.selectedAccount,
        signature
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
