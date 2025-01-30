<template>
  <v-container class="d-flex align-center justify-center hero-container" style="height: 70vh; min-height:400px">
    <!-- Background Shapes -->
    <div class="background-shape shape1" aria-hidden="true"></div>
    <div class="background-shape shape2" aria-hidden="true"></div>

    
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
          text="Learn more"
        />

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


  <v-card :image="src">
    <template #image>
      <v-img
        gradient="to bottom, rgba(var(--v-theme-surface), .8), rgba(var(--v-theme-surface), 1)"
      />
    </template>

    <v-container class="pa-6 pa-md-12 my-8" fluid>
      <v-responsive class="mb-8 mx-auto text-center" max-width="700">
        <p class="font-weight-bold text-md-h2 text-h4 mt-0">Whom we invest in</p>

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

  <v-container class="pa-6 pa-md-12 my-8" fluid>
    <v-responsive class="mb-8 mx-auto text-center" max-width="500">
      <p class="font-weight-bold text-md-h2 text-h4 mt-0">About B42 Capital</p>

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
          <v-img
            color="surface-light"
            cover
            height="200"
            rounded="lg"
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            width="180"
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


  <v-footer class="d-flex justify-space-between align-center px-4 py-4 mt-7" color="surface-light">
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
  

</template>

<script setup>
import { ref, computed, watchEffect, onMounted } from 'vue';
import { useDisplay } from 'vuetify'
import axios from 'axios'; 
import { formatDateUsingDateFns, usdFormat, apiBaseURL } from '@/utils/index.js';



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



  /**
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

</script>


<style scoped>
.responsive-image {
  max-width: 70%;
  height: auto;
  margin-left: 64px; /* To ensure some space around the image */
  border-radius: 30px;
}

  /* Hero Container Styling */
  .hero-container {
    position: relative;
    overflow: visible; /* To contain the background shapes */
    background-color: none; /* Optional: Background color for the hero section. #f0f4f8 */ 
    z-index: 0;
  }

  /* Background Shape Common Styles */
  .background-shape {
    position: absolute;
    width: 36.125rem; /* 576px */
    height: 36.125rem; /* 576px */
    background: linear-gradient(135deg, rgba(255, 128, 181, 0.4), rgba(144, 137, 252, 0.4));
    border-radius: 50%;
    filter: blur(100px);
    opacity: 0.3;
    transform: rotate(30deg);
    clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%);
    z-index: -1; /* Ensure it stays behind the content */
  }

  /* Specific Positioning for Shape1 */
  .shape1 {
    top: -10%;
    left: -10%;
    transform: rotate(30deg) scale(1);
  }

  @media (max-width: 768px) {
    .shape1 {
      width: 24rem;
      height: 24rem;
      top: -20%;
      left: -20%;
    }
  }


  /* Specific Positioning for Shape2 */
  .shape2 {
    bottom: -20%;
    right: -15%;
    background: linear-gradient(225deg, rgba(255, 128, 181, 0.4), rgba(144, 137, 252, 0.4));
    transform: rotate(-30deg) scale(1.2);
  }
 
  @media (max-width: 768px) {
    .shape2 {
    width: 24rem; /* 384px */
    height: 24rem; /* 384px */
    bottom: -25%;
    right: -25%;
    }
  }

</style>