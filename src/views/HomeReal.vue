<template>
  <v-container class="fill-height">
    <!--img src="@/assets/saas-valuation-logo.png" alt="SaaS Valuation Logo" class="logo-image" /-->
    <v-row no-gutters>
      <v-col cols="12" sm="12" md="6" class="d-flex align-center justify-center">
        <v-responsive class="align-left text-left fill-height">
          
          <div v-if="!isSubmitted">
            <!--div class="text-body-2 font-weight-light mb-3">free service</div-->
      
            <h1 class="text-h3 font-weight-bold">REAL What is your SaaS business worth?</h1>
      
            <div class="py-4"/>
      
            <div class="text-body-1"> 
              Find out how investors value your SaaS business. 
              Receive our valuation guide including questions every SaaS investor will ask along with answers they like to see. 
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
            <h1 class="text-h3 font-weight-bold">You are registered</h1>
            <div class="py-4"/>

            <div class="text-body-1"> 
              We are still fine tuning our SaaS valuation service and will notify you when it is ready. 
              <br><br>
              If you want to be first in line to test our SaaS Valuation calculator, drop me a quick line at <a href="mailto:dw@b42.io" class="text-decoration-none text-primary">dw@b42.io</a>. 
              <br><br>
              Thanks<br>
              Dietrich 
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

    <footer class="pa-0 text-body-2 font-weight-light text-center mb-2">
      <a href="#" @click.prevent="showDialog('imprint')" class="mr-2 text-grey">Imprint</a>
      <a href="#" @click.prevent="showDialog('privacy')" class="text-grey">Privacy Policy</a>
    </footer>
  </v-container>


  <!-- imprint privacy content modal -->
  <v-dialog v-model="dialog" persistent max-width="600px" @keydown.esc="closeDialog">
  <v-card>
    <v-card-text>
      <v-container>
        
        <h2>Imprint</h2>
        <br>
        <p>www.saas-valuation.com</p>
        <br>
        
        <h3>Website Operator</h3>
        <p>B42 Internet GmbH<br>
           Am Born 6b<br>
           22765 Hamburg<br>
           Germany
        </p>
        <br>
        
        <h3>Contact Information</h3>
        <p>dw-at-b42.io<br>
        </p>
        <br>

        <h3>Authorized Representative</h3>
        <p>Name of the Representative: D. Wedegaertner<br>
           Position of the representative: Managing Director
        </p>
        <br>

        <h3>Commercial Register Information</h3>
        <p>Registered at: Hamburg<br>
           Commercial Register Number: HRB 115840
        </p>
        
        <br><hr><br>
        

        <h2>Privacy Policy</h2>
        <br>
        <h3>1. Introduction</h3>
        <p>B42 Internet GmbH is committed to protecting the privacy and security of the visitors to our website, www.saas-valuation.com. This policy outlines what information we collect, how we use it, and the rights you have concerning your personal data.</p>
        <br>
        
        <h3>2. Data Collection and Processing</h3>
        <p>When you visit or use www.saas-valuation.com, we may collect the following personal data:</p><br>
        Contact Information: Name and email address when you voluntarily provide it to us (e.g., for newsletter subscriptions or inquiries).<br><br>
        Usage Data: Information automatically collected by our website (e.g., IP addresses, browser type, and access time).
        
        <br><br>
        
        <h3>3. Use of Data</h3>
        <p>We use your personal data for the following purposes:</p>
        <br>
        Communication: To respond to inquiries, provide information about our services, and send newsletters if you have subscribed.<br><br>
        Website Improvement: Analyzing website usage to improve functionality, usability, and user experience.
        
        <br><br>

        <h3>4. Data Sharing</h3>
        <p>Your personal data is not shared with third parties except as necessary for the purposes outlined above or to comply with legal obligations.</p>
        <br>

        <h3>5. Data Security</h3>
        <p>We employ security measures to protect your data from unauthorized access, alteration, or destruction.</p>
        <br>

        <h3>6. Cookies</h3>
        <p>Our website uses cookies to enhance user experience. You may disable cookies in your browser settings, though this may affect website functionality.</p>
        <br>

        <h3>7. User Rights</h3>
        <p>As a user, you have the right to:</p>
        <br>
          Access: Request a copy of the data we have on file about you.<br><br>
          Correction: Request corrections to any inaccurate data.<br><br>
          Deletion: Request deletion of your personal data, provided it is not required for legal reasons.<br>
          Withdraw Consent: Withdraw any previously given consent for data processing.<br>
        <br>

        <h3>8. Contact Information</h3>
        <p>For questions regarding this privacy policy or to exercise your rights, please contact:</p>
        <address>
          Data Protection Officer<br>
          B42 Internet GmbH<br>
          Am Born 6b<br>
          22765 Hamburg<br>
        </address>
        <br>

        <h3>9. Policy Updates</h3>
        <p>This privacy policy is subject to change. Please check back periodically for updates. The last update was on 15.10.2024.</p>
        <br>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary"  @click="dialog = false">close</v-btn>
    </v-card-actions>
  </v-card>
  </v-dialog>

  

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
  gtag_report_conversion(); 

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