<template>
  <v-footer class="bg-grey-lighten-1"  >
    <v-row justify="center" no-gutters>
      <v-btn
        class="mx-2"
        size="x-small"
        color="white"
        rounded="xl"
        variant="text"
        @click="showDialog('imprint')"
      >
        IMPRINT & PRIVACY
      </v-btn>
      <!--v-col class="text-center mt-4" cols="12">
        {{ new Date().getFullYear() }} — <strong>saas-valuation.com</strong>
      </v-col-->
    </v-row>
  </v-footer>


  <!-- imprint privacy content modal -->
  <v-dialog v-model="dialog" max-width="800px" @keydown.esc="closeDialog">
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
        Usage Data: Information automatically collected by our website: IP addresses, browser type, and access time.

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
          Deletion: Request deletion of your personal data, provided it is not required for legal reasons.<br><br>
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
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  import { useRouter } from 'vue-router'
  import { apiBaseURL } from '@/utils/index.js';
  
  const router = useRouter()
  
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

</script>  