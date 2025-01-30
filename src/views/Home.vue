<template>
  <v-app-bar color="primary" density="compact" :max-width="1280" class="mx-auto">
    <v-app-bar-title><router-link :to="{ name: 'Home' }" class="text-decoration-none text-white">B42 Capital</router-link></v-app-bar-title>
  </v-app-bar>
  
  <v-container class="d-flex align-center justify-center hero-container" fluid>


      <!-- Main Content -->
      <div class="w-100 w-md-75 text-center relative z-10">
      <!--v-chip border="thin opacity-25" color="surface" variant="flat">
        <span class="hidden-sm-and-down">Announcing our</span> <span class="hidden-md-and-up">Our&nbsp;</span> next round of funding. Click <a class="d-inline-block mx-1 text-decoration-none text-primary" href="#">here</a> to learn more.
      </v-chip-->

      <h1 class="text-h4 text-md-h2 font-weight-bold my-6">
        We help you grow and become efficient
      </h1>

      <div class="text-body-1 text-medium-emphasis mb-10">
        B42 Capital is a hands-on investor that supports founders to scale their business. We provide know how and capital for product development and revenue growth. 
      </div>

      <div class="d-flex ga-4 justify-center">
        <v-btn
          class="text-none"
          color="primary"
          flat
          rounded="lg"
          @click="scrollToSection"
        >
          Learn more
        </v-btn>

        <!--v-btn
          append-icon="mdi-chevron-right"
          class="text-none"
          flat
          rounded="lg"
          text="Learn more"
        /-->
      </div>
    </div>

  </v-container>

  <!-- WHAT -->
  <v-card :image="src" tile flat>
    <template #image>
      <v-img
        gradient="to bottom, rgba(var(--v-theme-surface), .8), rgba(var(--v-theme-surface), 1)"
      />
    </template>

    <v-container class="pa-6 pa-md-12 my-8" fluid>
      <v-responsive class="mb-8 mx-auto text-center" max-width="700">
        <p class="font-weight-bold text-md-h2 text-h4 mt-0" ref="whomWeInvest">Whom we invest in</p>

        <p class="mt-4 text-body-1 text-medium-emphasis">
          We work with earlier stage companies that have found product-markt-fit and need help in building a product and processes to scale efficiently into a large market. 
        </p>
      </v-responsive>

      <v-row align="stretch" class="mt-8">
        <v-col
          v-for="(item, i) in features"
          :key="i"
          class="d-flex flex-column"
          cols="12"
          md="4"
          sm="12"
        >
          <v-sheet
            border
            class="pa-6 flex-grow-1"
            rounded="lg"
            :style="$vuetify.theme.current.dark ? 'background-color: rgba(0, 0, 0, 0.4);' : 'background-color: rgba(255, 255, 255, 0.4);'"
          >
            <v-list-item rounded="lg" :subtitle="item.subtitle">
              <template #title>
                <p class="text-body-2 font-weight-bold pb-2">
                  <v-icon
                    class="mr-2"
                    color="primary"
                    :icon="item.icon"
                    size="small"
                  />

                  {{ item.title }}
                </p>
              </template>
            </v-list-item>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </v-card>

  <!--ABOUT -->
  <v-container class="pa-6 pa-md-12 my-0 about-b42-gradient" fluid>
    <v-responsive class="mb-8 mx-auto text-center" max-width="500">
      <p class="font-weight-bold text-md-h2 text-h4 mt-4">About B42 Capital</p>

      <p class="mt-4 text-body-1 text-medium-emphasis">
        We are not bankers but entrepreneurs who are in this for the love of building great companies. 
      </p>
    </v-responsive>

    <v-row align="center">
      <v-col
        class="pa-md-12 pa-6 text-center text-md-left"
        cols="12"
        md="6"
      >
        <v-responsive class="mx-auto" max-width="500">

          <p class="text-subtitle-2 text-medium-emphasis mb-6">
            B42 Capital is wholly owned by Dietrich Wedegärtner. Dietrich has been building tech businesses for over 20 years. In 2002 he built an online community for students - one year before facebook. In 2009 he founded adzLocal.de (now <a href="https://omergy.de" target="_blank">omergy.de</a>), a Lead Generation Service for German SMBs. He sold adzLocal in 2021 to <a href="https://www.pinovacapital.com" target="_blank">PINOVA Capital</a>. 
          </p>

          <p class="text-subtitle-2 text-medium-emphasis mb-6">
            Since 2023 Dietrich has been coaching startup founders on how to accelerate their growth as well as capital allocators on how to evaluate SaaS businesses. 
          </p>

          <p class="text-subtitle-2 text-medium-emphasis mb-6">
            In 2024 B42 launched the SaaS valuation calculator <a href="https://www.saas-valuation.com" target="_blank">www.saas-valuation.com</a> to help SaaS founders learn about how SaaS investors evaluate the worth of their business. 
          </p>

        </v-responsive>
      </v-col>

      <v-col
        cols="12"
        md="6"
      >

        <v-card
          class="d-flex flex-column align-center pa-2 mt-2"
          color="transparent"
          flat
          max-width="700"
          rounded="lg"
        >
          <!--v-img
            color="surface-light"
            cover
            height="200"
            rounded="lg"
            src="@/assets/headshot_dietrich.jpg"
            width="180"
          /-->

          <img 
            src="@/assets/headshot_dietrich.jpg" 
            alt="Dietrich Wedegartne" 
            class="responsive-image" 
            width="200"
            rounded="lg"
          />

          
          
          <div class="text-center mt-4">
            <v-list-item
              class="px-0 mt-0"
            >
              <template v-slot:title>
                <div class="font-weight-bold">Dietrich Wedegärtner</div>
              </template>
              <template v-slot:subtitle>
                <div>Founder & CEO</div>
              </template>
            </v-list-item>

            <div class="d-flex justify-center ga-3 mt-2">
              <v-btn
                icon="mdi-linkedin"
                size="x-small"
                href="https://www.linkedin.com/in/wedegaertner/"
                target="_blank"
                variant="text"
              />

              <!--v-btn
                icon="mdi-twitter"
                size="x-small"
                href="https://twitter.com/dietrichwedegar"
                target="_blank"
                variant="text"
              /-->
            </div>
          </div>
        </v-card>


      </v-col>
    </v-row>

    
  </v-container>

  <!-- CONTACT -->
  <v-container class="pa-6 pa-md-12 bg-primary" fluid>
    <v-responsive
      class="mx-auto text-center d-flex align-center"
      max-width="600"
      min-height="300"
    >
      <p class="font-weight-bold text-sm-h2 text-h4 mt-2'">
        Get in touch
      </p>

      <p class="mt-4 text-body-1 opacity-60">
        write Dietrich via <a :href="`mailto:${decodeEmail(encodedEmail)}`" style="color: inherit; text-decoration: none">{{ decodeEmail(encodedEmail) }}</a>
      </p>
    </v-responsive>
  </v-container>

  <!-- FOOTER  -->
  <v-footer class="d-flex justify-space-between align-center px-4 py-4 mt-0" color="surface-light">
    <v-row justify="center" no-gutters>
      <v-btn
        class="mx-2"
        size="x-small"
        rounded="xl"
        variant="text"
        @click="showDialog('imprint')"
      >
        IMPRINT & PRIVACY
      </v-btn>
    </v-row>
  </v-footer>

  <!-- imprint privacy content modal -->
  <v-dialog v-model="dialog" max-width="800px" @keydown.esc="closeDialog">
  <v-card>
    <v-card-text>
      <v-container>

        <h2>Imprint</h2>
        <p>B42.io</p>
        <br>

        <h3>Website Operator</h3>
        <p>B42 Internet GmbH<br>
           Am Born 6b<br>
           22765 Hamburg<br>
           Germany
        </p>
        <br>

        <h3>Contact Information</h3>
        <p><a :href="`mailto:${decodeEmail(encodedEmail)}`" style="color: inherit; text-decoration: none">{{ decodeEmail(encodedEmail) }}</a><br>
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
        <p>B42 Internet GmbH is committed to protecting the privacy and security of the visitors to our website, www.b42.io. This policy outlines what information we collect, how we use it, and the rights you have concerning your personal data.</p>
        <br>

        <h3>2. Data Collection and Processing</h3>
        <p>When you visit or use www.b42.io, we may collect the following personal data:</p><br>
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
        <!--p>Our website uses cookies to enhance user experience. You may disable cookies in your browser settings, though this may affect website functionality.</p-->
        <p>Our website does not use cookies.</p>
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
import { ref, computed, watchEffect, onMounted } from 'vue';
//import { useDisplay } from 'vuetify'
//import axios from 'axios'; 
//import { formatDateUsingDateFns, usdFormat, apiBaseURL } from '@/utils/index.js';

// Reference to the "Whom we invest in" section
const whomWeInvest = ref(null);

// Scroll function
  function scrollToSection() {
    if (whomWeInvest.value) {
      // Get the vertical position of the target element
      const elementPosition = whomWeInvest.value.getBoundingClientRect().top + window.scrollY;

      // Calculate the offset position
      const offsetPosition = elementPosition - 70;

      // Scroll to the calculated position
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    } else {
      console.log('whomWeInvest ref is not set');
    }
  }
  
const src = computed(() => `https://images.unsplash.com/photo-1533892743580-890e5b193113?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`)

  
const features = [
  {
    title: 'Hungry Entrepreneurs',
    subtitle:
      'You must be an entrepreneur who is passionate about his/her customers and product.',
    icon: 'mdi-rocket', // Emphasizes launch, ambition, and forward momentum
  },
  {
    title: 'Strong Demand',
    subtitle:
      'You must be able to show that there is a strong demand for what you are offering.',
    icon: 'mdi-trending-up', // Symbolizes growth and increasing demand
  },
  {
    title: 'Existing Revenue',
    subtitle:
      'You must be able to show first revenue with the product that you want to scale.',
    icon: 'mdi-cash', // Conveys money and revenue
  },
  {
    title: 'SaaS Business Models',
    subtitle:
      'We like SaaS businesses with an asset light recurring revenue model.',
    icon: 'mdi-server-network', // Represents servers and networks, hinting at cloud-based or SaaS offerings
  },
  {
    title: 'Traditional Businesses',
    subtitle:
      'We are also very interested in companies that want to use technology to gain a competitive advantage in a more traditional industry.',
    icon: 'mdi-domain', // Depicts a building, aligning with traditional or established industries
  },
  {
    title: 'Based in Europe',
    subtitle:
      'We mainly invest in businesses that are based in the European Union.',
    icon: 'mdi-earth', // Generic globe icon to indicate geographic location (Europe)
  },
]


  /** EMAIL ENCODING 
   * 1) We store the email in Base64 form in encodedEmail.
   *    'dw@b42.io' => 'ZHdAYjQyLmlv' (Base64)
   */
  const encodedEmail = ref('ZHdAYjQyLmlv');

  /**
   * 2) decodeEmail is a simple function that decodes the Base64 string
   *    and returns the original email.
   */
  function decodeEmail(encoded) {
    return atob(encoded); 
  }


  /* functions for footer modal */
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


<style scoped>
.responsive-image {
  max-width: 70%;
  height: auto;
  border-radius: 20px;
}



  
  /* Hero Container Styling */
  .hero-container {
    position: relative;
    overflow: visible; /* To contain the background shapes */
    background-color: #FAFAFA; 
    z-index: 0;
    height: 70vh;
    min-height:500px;
  }

  .hero-container h1 {
    position: relative;
    z-index: 1;
  }

  .hero-container h1::before {
    content: "";
    position: absolute;
    width: 400%;
    height: 170%;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: radial-gradient(
      circle,
      rgba(100, 255, 218, 0.4) 0%,
      rgba(100, 255, 218, 0) 40%
    );
    filter: blur(60px);
    z-index: -1;
  }

  @media (max-width: 768px) {
    .cloud-title::before {
      width: 300%;
      height: 200%;
      filter: blur(20px);
    }
  }
  
  /* Gradient background for "About B42 Capital" container */
  .about-b42-gradient {
    /* Teal lighten-4 (#80CBC4) to teal lighten-5 (#B2DFDB) */
    background: linear-gradient(to bottom, #B2DFDB, #E0F2F1);
  }



  </style>