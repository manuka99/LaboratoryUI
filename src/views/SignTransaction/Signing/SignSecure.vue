<template>
  <div>
    <!-- select signer mode -->
    <div class="mt-2">
      <b-form-group
        id="fieldset-1"
        description="Enter the public key registered with your METASPECK acount. If the account has multiple signers then check the signer's risk level to select the most suitable public key."
        label="2) Account Signer's Public Key"
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
          list="sdsd3swe23de"
        ></b-form-input>

        <datalist id="sdsd3swe23de">
          <option
            :value="signingAccountOption.value"
            v-for="(signingAccountOption, i) in signingAccountOptions"
            :key="i"
            >{{ signingAccountOption.text }}</option
          >
        </datalist>
      </div>
    </div>
    <div v-if="selectedAccount" style="margin-top: 28px">
      <b-form-group
        id="fieldset-1"
        description="There are several signing modes in stellar, to get more information visit their official website or contact our team. METASPECK will allow you to sign the transaction using a registered account credential."
        label="3) Transaction Signing Mode"
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
    <div v-if="signingMode == 'metaspeck' && selectedAccount">
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
      <base-button
        class="mt-4 px-4 btn btn-primary btn-sm d-flex justify-content-center align-items-center font-16"
        type="submit"
        nativeType="submit"
        :loading="value.loading"
        :disabled="value.loading"
        @click="signWithMETASPECK"
      >
        Sign with METASPECK
      </base-button>
    </div>

    <!-- select secretKey mode any -->
    <div v-if="signingMode == 'secretKey' && selectedAccount">
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

    <div v-if="signingMode == 'secretKey' && selectedAccount && secretKey">
      <base-button
        class="mt-0 px-4 btn btn-primary btn-sm d-flex justify-content-center align-items-center font-16"
        type="submit"
        nativeType="submit"
        :loading="value.loading"
        @click="signWithSecretKeyFn"
        :disabled="value.loading"
      >
        Sign with Secret Key
      </base-button>
    </div>

    <!-- select hashx mode any -->
    <div v-if="signingMode == 'hashx' && selectedAccount">
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

    <div v-if="signingMode == 'hashx' && selectedAccount && hashxPreimage">
      <base-button
        class="mt-0 px-4 btn btn-primary btn-sm d-flex justify-content-center align-items-center font-16"
        type="submit"
        nativeType="submit"
        :loading="value.loading"
        @click="signWithHashXFn"
        :disabled="value.loading"
      >
        Sign with Hash Preimage
      </base-button>
    </div>

    <!-- select albedo mode offline -->
    <div v-if="signingMode == 'albedo' && selectedAccount">
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
        :loading="value.loading"
        @click="signWithAlbedoFn"
        :disabled="value.loading"
      >
        Sign with Albedo
      </base-button>
    </div>
  </div>
</template>

<script>
import {
  TransactionBuilder,
  Keypair,
  Memo,
  Operation,
  TimeoutInfinite
} from "stellar-sdk";
import albedo from "@albedo-link/intent";
import {
  BLOCKCHAIN_NETWORK_NAME,
  BLOCKCHAIN_NETWORK_BASE_FEE_VALUE
} from "@/services/config";
import { GetAccount, SubmitXdr } from "@/services/stellar.service";
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
    selectedAccount() {
      this.selectedAccountState.status = null;
      this.signingMode = null;
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
    signingMode() {
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
    async signWithMETASPECK() {
      this.value.loading = true;
      var preTxXdr = await this.getPreAuthTxnHashXdr();
      if (!preTxXdr) {
        this.selectedAccountState.message =
          "Account does not exist, make sure you select a funded account.";
        this.selectedAccountState.status = false;
        this.value.loading = false;
        return;
      }
      let payload = {
        isOnline: false,
        accountID: this.selectedAccount,
        xdr: preTxXdr,
        network: BLOCKCHAIN_NETWORK_NAME
      };
      SignTransactionAPI(payload)
        .then(res => {
          const signed_xdr = res.data.data.signature;
          SubmitXdr(signed_xdr)
            .then(() => {
              this.selectedAccountState.status = true;
              setTimeout(() => {
                this.selectedAccount = null;
                this.selectedAccountState.status = null;
              }, 4000);
              this.emitSignedDataFn(signed_xdr);
            })
            .catch(e => {
              this.selectedAccountState.message = e.message;
              this.selectedAccountState.status = false;
            })
            .finally(() => (this.value.loading = false));
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
          this.value.loading = false;
        });
    },
    async signWithSecretKeyFn() {
      try {
        this.value.loading = true;
        var preTxXdr = await this.getPreAuthTxnHashXdr();
        if (!preTxXdr) {
          this.secretKeyState.message =
            "Account does not exist, make sure you select a funded account.";
          this.secretKeyState.status = false;
          this.value.loading = false;
          return;
        }
        const tx = TransactionBuilder.fromXDR(
          preTxXdr,
          BLOCKCHAIN_NETWORK_NAME
        );
        var keypair = Keypair.fromSecret(this.secretKey);
        tx.sign(keypair);
        var signed_xdr = tx.toXDR();
        SubmitXdr(signed_xdr)
          .then(() => {
            this.secretKeyState.status = true;
            setTimeout(() => {
              this.secretKey = null;
              this.secretKeyState.status = null;
            }, 4000);
            this.emitSignedDataFn(signed_xdr);
          })
          .catch(e => {
            this.secretKeyState.message = e.message;
            this.secretKeyState.status = false;
          })
          .finally(() => (this.value.loading = false));
      } catch (error) {
        this.secretKeyState.message = "Invalid private key";
        this.secretKeyState.status = false;
        this.value.loading = false;
      }
    },
    async signWithHashXFn() {
      try {
        this.value.loading = true;
        var preTxXdr = await this.getPreAuthTxnHashXdr();
        if (!preTxXdr) {
          this.hashxPreimageState.message =
            "Account does not exist, make sure you select a funded account.";
          this.hashxPreimageState.status = false;
          this.value.loading = false;
          return;
        }
        const tx = TransactionBuilder.fromXDR(
          preTxXdr,
          BLOCKCHAIN_NETWORK_NAME
        );
        tx.signHashX(this.hashxPreimage);
        var signed_xdr = tx.toXDR();
        SubmitXdr(signed_xdr)
          .then(() => {
            this.hashxPreimageState.status = true;
            setTimeout(() => {
              this.hashxPreimage = null;
              this.hashxPreimageState.status = null;
            }, 4000);
            this.emitSignedDataFn(signed_xdr);
          })
          .catch(e => {
            this.hashxPreimageState.message = e.message;
            this.hashxPreimageState.status = false;
          })
          .finally(() => (this.value.loading = false));
      } catch (error) {
        this.hashxPreimageState.message = "Invalid value of Hash X";
        this.hashxPreimageState.status = false;
        this.value.loading = false;
      }
    },
    async signWithAlbedoFn() {
      this.value.loading = true;
      const xdr = await this.getPreAuthTxnHashXdr();
      if (!xdr) {
        this.albedoState.message =
          "Account does not exist, make sure you select a funded account.";
        this.albedoState.status = false;
        this.value.loading = false;
        return;
      }
      let txIntentParams = {
        xdr,
        network: BLOCKCHAIN_NETWORK_NAME,
        submit: false
      };
      albedo
        .tx(txIntentParams)
        .then(res => {
          SubmitXdr(res.signed_envelope_xdr)
            .then(() => {
              this.albedoState.status = true;
              setTimeout(() => {
                this.albedoState.status = null;
              }, 4000);
              this.emitSignedDataFn(res.signed_envelope_xdr);
            })
            .catch(e => {
              this.albedoState.message = e.message;
              this.albedoState.status = false;
            })
            .finally(() => (this.value.loading = false));
        })
        .catch(e => {
          this.albedoState.message = e.message;
          this.albedoState.status = false;
          setTimeout(() => {
            this.albedoState.status = null;
          }, 4000);
          this.value.loading = false;
        });
    },
    async getPreAuthTxnHashXdr() {
      const preAuthTx = this.getTxHash(this.xdr);
      const sourceAccount = await GetAccount(this.selectedAccount);
      if (!sourceAccount) return null;
      var transaction = new TransactionBuilder(sourceAccount, {
        fee: BLOCKCHAIN_NETWORK_BASE_FEE_VALUE,
        networkPassphrase: BLOCKCHAIN_NETWORK_NAME
      });

      transaction.addMemo(Memo.hash(preAuthTx));
      transaction.setTimeout(TimeoutInfinite);
      transaction.addOperation(
        Operation.setOptions({
          signer: {
            preAuthTx,
            weight:
              sourceAccount.thresholds.high_threshold == 0
                ? 1
                : sourceAccount.thresholds.high_threshold
          }
        })
      );

      return transaction.build().toXDR();
    },
    getTxHash(xdr) {
      const tx = TransactionBuilder.fromXDR(xdr, BLOCKCHAIN_NETWORK_NAME);
      return tx.hash().toString("hex");
    },
    emitSignedDataFn(signature) {
      this.$emit("signed", {
        type: "secure",
        mode: this.signingMode,
        accountID: this.selectedAccount,
        signature
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
