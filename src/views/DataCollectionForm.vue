<template>
  <!-- <v-layout> -->
  <!-- <v-main class="ma-6"> -->
  <h1 class="text-h3 mb-6">Data Input Form</h1>

  <v-form @submit.prevent="submit">
      <!-- <v-container> -->
      <v-row>
          <v-col cols="12" md="6" xl="4">
              <v-text-field v-model="firstName" label="Vorname" required hide-details class="mb-6"></v-text-field>
              <v-text-field v-model="lastName" label="Nachname" required hide-details class="mb-6"></v-text-field>
              <v-text-field v-model="street" label="Strasse" required hide-details class="mb-6"></v-text-field>
              <v-text-field v-model="housenr" label="Hausnr." required hide-details class="mb-6"></v-text-field>
              <v-text-field v-model="zipcode" label="PLZ" required hide-details class="mb-6"></v-text-field>
              <v-text-field v-model="city" label="Stadt" required hide-details class="mb-6"></v-text-field>

          </v-col>
      </v-row>


      <v-row>
          <v-col cols="12" md="8" xl="4">
              <v-btn color="primary" type="submit">infos anfordern</v-btn>
          </v-col>
      </v-row>
      <br /><br />

      <v-row>
          <v-col cols="12" md="6" xl="4">
              <v-card v-if="responseCardStatus == 'gettingResponse'" loading variant="tonal" color=blue-lighten-3
 class="pa-3">
                  <div>We are submitting your information.</div>
              </v-card>

              <v-card v-if="responseCardStatus === 'showResponse'" variant="tonal" color=success class="pa-3">
                  <div>Your information has been submitted.</div>
              </v-card>
          </v-col>
      </v-row>

  </v-form>
</template>


<script setup>
import { ref, computed, watchEffect } from 'vue';

//setup router
import { useRoute } from 'vue-router'
const route = useRoute();
const routeParams = route.params;

//import date-fns
import { format } from 'date-fns';

//import firestore instance and relevant functions
//temp import { db } from '../firebase/init.js';


//temp import { collection, addDoc, Timestamp, getDocs, query, orderBy, where, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";


//variables
const firstName = ref('Brutus');
const lastName = ref('Bachmann');
const street = ref('');
const housenr = ref('');
const city = ref('');
const zipcode = ref('');
const responseCardStatus = ref('');
const poemsFirestore = ref([]);
let tempPoems = [];
const showPoemDetails = ref([]);
let confirmDelete = ref([])

//delay function 
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));



const host = window.location.host


//function after submit of form 
const submit = async (event) => {
  //console.log(event, nameOfLovedOne.value);

  const dataObj = {
      firstName: firstName.value,
      lastName: lastName.value,
      street: street.value,
      housenr: housenr.value,
      zipcode: zipcode.value,
      city: city.value
  }

  responseCardStatus.value = 'gettingResponse'
  //await delay(1500)

  // send data to python selenium script   
  let url = `https://be4b45e0-8498-4992-b144-8429a4fea2c0-00-pvcaydqmrsjs.kirk.replit.dev/post`;
  console.log(dataObj)  
  
  fetch(url, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataObj),
  })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          console.log(response)  
          responseCardStatus.value = 'showResponse'
          //return response.json(); // This returns another promise
      })
      .catch(error => console.log('ERROR 47'));

};



const formatDateUsingDateFns = (date) => {
  return format(new Date(date), 'dd.MM.yyyy HH:mm');
};
</script>


<style></style>