<template>
  <v-container class="h-50 d-flex align-center justify-center">
    <div class="w-100 w-md-75 text-center">
      <!--v-chip border="thin opacity-25" color="surface" variant="flat">
        <span class="hidden-sm-and-down">Announcing our</span> <span class="hidden-md-and-up">Our&nbsp;</span> next round of funding. Click <a class="d-inline-block mx-1 text-decoration-none text-primary" href="#">here</a> to learn more.
      </v-chip-->

      <h1 class="text-h4 text-md-h2 font-weight-bold my-6">
        Your Scale-Up Investor
      </h1>

      <div class="text-body-1 text-medium-emphasis mb-10">
        B42 Capital is a hands-on investor that supports founders to scale their business. We provide capital to grow your revenue and to improve your product. We work with founders who are curious and open to new ideas.
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

    <div class="v-bg position-absolute top-0 right-0 left-0 bottom-0">
      <div aria-hidden="true" class="overflow-hidden opacity-20 w-100 h-100" />
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
          Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem
          cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat
          aliqua.
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
            B42 Capital is wholly owned by Dietrich Wedegärtner. Dietrich has been building .com Businesses for over 20 years. In 2002 he built an online community for students - one year before facebook. In 2009 he founded adzLocal.de (now <a href="https://omergy.com" target="_blank">omergy.com</a>), a Lead Generation Service for German SMBs. He sold adzLocal in 2021 to <a href="https://www.pinovacapital.com" target="_blank">PINOVA Capital</a>. 
          </p>

          <p class="text-subtitle-2 text-medium-emphasis mb-6">
            Since 2022 Dietrich has been coaching startup founders on how to accelerate their growth as well as capital allocators on how to evaluate SaaS businesses. 
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
              <template v-slot:default>
                <p class="text-caption text-medium-emphasis mt-2">
                  20+ years experience building and scaling .com businesses
                </p>
              </template>
            </v-list-item>

            <div class="d-flex justify-center ga-3 mt-2">
              <v-btn
                icon="mdi-linkedin"
                size="x-small"
                href="https://www.linkedin.com/in/dietrich-wedegaertner/"
                target="_blank"
                variant="text"
              />

              <v-btn
                icon="mdi-twitter"
                size="x-small"
                href="https://twitter.com/dietrichwedegar"
                target="_blank"
                variant="text"
              />
            </div>
          </div>
        </v-card>

        
      </v-col>
    </v-row>

  </v-container>
  
  
  <!--v-container class="fill-height">
    <v-row no-gutters>
      <v-col cols="12" sm="12" md="6" class="d-flex align-center justify-center">
        <v-responsive class="align-left text-left fill-height">
          
    
      
            <h1 class="text-h3 font-weight-bold">Your Scale-Up Investor</h1>
      
            <div class="py-4"/>
      
            <div class="text-body-1"> 
              B42 Capital is a hands-on investor that supports founders to scale their business. We love building systems and software to automate day-to-day business operations. We are curious, honest and fair.
            </div>
            
            <div class="py-4"/>
  

    
        </v-responsive>
        
      </v-col>
      <v-col cols="12" md="6" >
        <div class="d-flex align-center justify-center">
          <img src="@/assets/saas_scale.jpeg" alt="SaaS Scale" class="responsive-image d-none d-md-flex" />
        </div>
      </v-col>
    </v-row>

  </v-container-->

</template>

<script setup>
import { ref, computed, watchEffect, onMounted } from 'vue';
import { useDisplay } from 'vuetify'
import axios from 'axios'; 
import { formatDateUsingDateFns, usdFormat, apiBaseURL } from '@/utils/index.js';

const src = computed(() => `https://images.unsplash.com/photo-1533892743580-890e5b193113?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`)

const features = [
  {
    title: 'Builders',
    subtitle:
      'We are looking for entrepreneurs that are passionate about building amazing products.',
    icon: 'mdi-cloud-upload',
  },
  {
    title: 'Existing Revenue',
    subtitle:
      'You must already be generating revenue.',
    icon: 'mdi-lock',
  },
  {
    title: 'Post Product-Market-Fit',
    subtitle:
      'You must have reached product-market-fit.',
    icon: 'mdi-sync',
  },
  {
    title: 'Recurring Revenue Model',
    subtitle:
      'We focus on businesses with SaaS characteristics, i.e. recurring revenue streams such as subscription, license or membership models.',
    icon: 'mdi-sync',
  },
  {
    title: 'Based in Europe',
    subtitle:
      'We invest in businesses that are based in the European Union. ',
    icon: 'mdi-sync',
  },
  {
    title: 'We do not invest in',
    subtitle:
      'Commerce, entertainment, hospitality, healthcare and manufacturing businesses. ',
    icon: 'mdi-sync',
  },
]

</script>


<style scoped>
.responsive-image {
  max-width: 70%;
  height: auto;
  margin-left: 64px; /* To ensure some space around the image */
  border-radius: 30px;
}
</style>