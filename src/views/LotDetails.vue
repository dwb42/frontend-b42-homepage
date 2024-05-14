<template>
  <span class="text-caption"><router-link :to="`/lots/`">Lots</router-link></span>
  <h1 class="text-h4 mb-2"><b>{{ lotData.lotname }}</b> ({{ lotData.id }})</h1>
  <span class="text-body-1 mr-6">status: {{ lotData.status }}</span>
  <span class="text-body-1">created: {{ lotData.createdAt }}</span><br>
  <span class="text-body-1">
    <a :href="lotData.url_to_marketplace" class="v-link" target="_blank">marketplace</a>
    <v-icon icon="mdi-open-in-new" class="ml-1" size="smaller"></v-icon>
  </span><br>


  
  <v-row>
    <v-col cols="12" md="6" xl="4">
      <!--v-table>
          <tr>
            <td class="text-left"></td>
            <td class="text-left">id: </td>
            <td class="text-left">created at: {{ lotData.createdAt }}</td>
          </tr>
      </v-table-->
    </v-col>
  </v-row>
  <br /><br />



</template>

<script setup>
  import { ref, computed, watchEffect, onMounted } from 'vue';
  import axios from 'axios'; 
  import { format } from 'date-fns';
  
  //setup router
  import { useRoute } from 'vue-router'
  const route = useRoute();
  const routeParams = route.params;
  
  const thisLotId = ref(route.params.id);
  //console.log('thisLotId:', thisLotId.value)
  
  const lotData = ref({}); 

  
  async function fetchLot(id) {
    
    try {
    const response = await axios.get('https://5ba3ca6b-a813-4e07-89f3-afccbf84b282-00-38uju9xxxdxfz.riker.replit.dev/lots/' + id) ;
    lotData.value = response.data[0]; // Assuming the API returns the lots data directly
    console.log(lotData.value);
    } catch (error) {
    console.error('Error fetching lots:', error);  }
  }
    
  
  onMounted(() => {
    console.log('thisLotId: ', thisLotId.value)
    fetchLot(thisLotId.value);
  });
  
  const formatDateUsingDateFns = (date) => {
    return format(new Date(date), 'dd.MM.yyyy HH:mm');
  };

  

</script>
