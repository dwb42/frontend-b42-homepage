<template>
  <v-container class="fill-height">
    <!--img src="@/assets/saas-valuation-logo.png" alt="SaaS Valuation Logo" class="logo-image" /-->
    <v-row no-gutters>
      <v-col cols="12" sm="12" md="6" class="d-flex align-center justify-center">
        <v-responsive class="align-left text-left fill-height">
          
          <div v-if="!isSubmitted">
            <!--div class="text-body-2 font-weight-light mb-3">free service</div-->
      
            <h1 class="text-h3 font-weight-bold">What is your SaaS business worth?</h1>
      
            <div class="py-4"/>
      
            <div class="text-body-1"> 
              Find out how investors value your SaaS business. 
              <!--Receive our valuation guide including questions every SaaS investor will ask along with answers they like to see. -->
              Use our SaaS valuation calculator to enter your business details in order to get a valuation estimate. 
              
            </div>
            
            <div class="py-4"/>
  
            <v-form @submit.prevent="register">
              <!--v-text-field v-model="email" id="email" label="Your Email Address*" required hide-details class="mb-4"-->
              <v-text-field 
                v-model="email" 
                id="email" 
                label="Your Email Address*" 
                :rules="emailRules"
                :append-icon="isEmailValid ? 'mdi-check-circle' : ''"
                :append-icon-color="isEmailValid ? 'success' : ''"
                class="mb-4"
                validate-on="input"
                required
              >
                
              </v-text-field>
              <v-btn color="primary" size="large" type="submit">Register for free</v-btn>
            </v-form>
      
            <div class="py-2 text-body-2 font-weight-light">
              we will never share your email address with anyone
            </div>
          </div>
          
          <div v-else>
            <h1 class="text-h3 font-weight-bold">Check your mail </h1>
            <div class="py-4"/>

            <div class="text-body-1"> 
              A Login Link has been sent. 
            </div>
          </div>
    
        </v-responsive>
        
      </v-col>
      <v-col cols="12" md="6" >
        <div class="d-flex align-center justify-center">
          <img src="@/assets/saas_scale.jpeg" alt="SaaS Scale" class="responsive-image d-none d-md-flex" />
        </div>
      </v-col>
    </v-row>

  </v-container>

</template>

<script setup>
import { ref, computed, watchEffect, onMounted } from 'vue';
import { useDisplay } from 'vuetify'
import axios from 'axios'; 
import { formatDateUsingDateFns, usdFormat, apiBaseURL } from '@/utils/index.js';

const email = ref('');
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isSubmitted = ref(false);

const dialog = ref(false)
const currentContent = ref('') // 'imprint' or 'privacy'
function showDialog(content) {
  currentContent.value = content
  dialog.value = true
}

const closeDialog = () => {
  dialog.value = false;
  console.log('closeDialog')
};

// Add computed property for email validation
const isEmailValid = computed(() => {
  return email.value && emailPattern.test(email.value);
});

// Validation rule function
const emailRules = [
  v => !!v || 'Email is required',
  v => emailPattern.test(v) || 'Enter valid email'
];

async function register() {
  try {
  const formData = {
      email: email.value
  };
  console.log('Registering email at:', apiBaseURL);
  const response = await axios.post(`${apiBaseURL}/auth/register`, formData);
  console.log('Email registered:', response.data);
  isSubmitted.value = true; 

  // Call the conversion tracking function after a successful registration
  //gtag_report_conversion(); 

  } catch (error) {
  console.error('Error registering:', error);
  }
}

</script>


<style scoped>
.responsive-image {
  max-width: 70%;
  height: auto;
  margin-left: 64px; /* To ensure some space around the image */
  border-radius: 30px;
}
</style>