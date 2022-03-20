<template>
  <div>
    <!-- select signer type -->
    <div>
      <b-form-group
        id="fieldset-1"
        description="Transaction signer's signature can be placed directly or can be authorized. If the transaction was authorized it can be revoked at any time if the transaction is not yet submitted. Authorizing a transaction will increase the account reserves by 0.5 XLM. This reserve will only be held until the transaction is submited or authorization is not revoked."
        label="1) Transaction Signer Type"
        class="font-16 font-weight-600 w-100 mt-4 max-width-500px"
        label-for="select-0"
      >
        <b-form-select
          id="select-0"
          class="w-auto min-width-300px"
          style="height: 40px"
          v-model="signingType"
          :options="signingTypeOptions"
          :disabled="loading"
        ></b-form-select>
      </b-form-group>
    </div>

    <!-- select signer mode -->
    <div v-if="signingType">
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
          :disabled="loading"
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
        :invalid-feedback="selectedAccountState.message"
        :state="selectedAccountState.status"
      >
      </b-form-group>
      <div class="max-width-500px">
        <b-form-input
          id="input-0"
          type="text"
          placeholder="Enter Signer's Public Key (Starting with G)"
          v-model="selectedAccount"
          :state="selectedAccountState.status"
          :disabled="loading"
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

    <div v-if="signingMode == 'metaspeck' && selectedAccount">
      <base-button
        class="mt-4 px-4 btn btn-primary btn-sm d-flex justify-content-center align-items-center font-16"
        type="submit"
        nativeType="submit"
        :disabled="loading"
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
        :invalid-feedback="selectedAccountState.message"
        :state="selectedAccountState.status"
      >
      </b-form-group>
      <div class="max-width-500px">
        <b-form-input
          id="input-0"
          type="text"
          placeholder="Enter Signer's Public Key (Starting with G)"
          v-model="selectedAccount"
          :state="selectedAccountState.status"
          :disabled="loading"
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
        :invalid-feedback="secretKeyState.message"
        :state="secretKeyState.status"
      >
        <b-form-input
          id="input-0"
          type="password"
          placeholder="Enter Secret Key (Starting with S)"
          v-model="secretKey"
          :state="secretKeyState.status"
          :disabled="loading"
          trim
        ></b-form-input>
      </b-form-group>

      <p
        v-if="secretKeyState.status"
        class="text-success font-weight-bold font-14 font-italic"
      >
        Transaction was signed successfully.
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
        :disabled="loading"
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
        :invalid-feedback="secretKeyState.message"
        :state="secretKeyState.status"
      >
        <b-form-input
          id="input-1"
          type="password"
          placeholder="Enter Secret Key (Starting with S)"
          v-model="secretKey"
          :state="secretKeyState.status"
          :disabled="loading"
          trim
        ></b-form-input>
      </b-form-group>
      <p
        v-if="secretKeyState.status"
        class="text-success font-weight-bold font-14 font-italic"
      >
        Transaction was signed successfully.
      </p>
    </div>

    <div v-if="signingMode == 'secretKey' && !isOnline && secretKey">
      <base-button
        class="mt-0 px-4 btn btn-primary btn-sm d-flex justify-content-center align-items-center font-16"
        type="submit"
        nativeType="submit"
        @click="signWithSecretKeyOffline"
        :disabled="loading"
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
        :invalid-feedback="hashxPreimageState.message"
        :state="hashxPreimageState.status"
      >
        <b-form-input
          id="input-2"
          type="password"
          placeholder="Enter Hash Preimage (HEX)"
          v-model="hashxPreimage"
          :state="hashxPreimageState.status"
          :disabled="loading"
          trim
        ></b-form-input>
      </b-form-group>

      <p
        v-if="hashxPreimageState.status"
        class="text-success font-weight-bold font-14 font-italic"
      >
        Transaction was signed successfully.
      </p>
    </div>

    <div v-if="signingMode == 'hashx' && !isOnline && hashxPreimage">
      <base-button
        class="mt-0 px-4 btn btn-primary btn-sm d-flex justify-content-center align-items-center font-16"
        type="submit"
        nativeType="submit"
        @click="signWithHashX"
        :disabled="loading"
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
        :disabled="loading"
      >
        Sign with Albedo
      </base-button>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped></style>
