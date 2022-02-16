<template>
  <div>
    <!-- Header -->
    <div class="header bg-gradient-info py-7 py-lg-8 pt-lg-9 h-100">
      <b-container>
        <div class="header-body text-center mb-7">
          <b-row class="justify-content-center">
            <b-col xl="6" lg="7" md="7" class="px-5">
              <h1 class="text-light">Ooops!</h1>
              <p class="text-lead text-white">  
                This happens when you're trying to open a resource that you're not
                allowed to access. You either tried some shady route or you came here by
                mistake.
              </p>
            </b-col>
          </b-row>
        </div>
      </b-container>
      <div class="separator separator-bottom separator-skew zindex-100">
        <svg x="0" y="0" viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <polygon class="fill-default" points="2560 0 2560 100 0 100"></polygon>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'not-found'
};
</script>
