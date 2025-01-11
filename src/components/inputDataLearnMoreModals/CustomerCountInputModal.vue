
<template>
  <p class="mb-2">Enter the total number of paying customers at the start of the period:</p>
  
  <v-card class="mb-6">
    <v-list density="compact">
      <v-list-item 
        v-for="(item, i) in includeItems" 
        :key="i"
        :value="item"
        color="primary"
      >
        <template v-slot:prepend>
          <v-icon icon="mdi-check"></v-icon>
        </template>
        <v-list-item-title v-text="item.text"></v-list-item-title>
      </v-list-item>
    </v-list>
  </v-card>

  <p class="mb-2">Do not include:</p>
  
  <v-card class="mb-6">
    <v-list density="compact">
      <v-list-item 
        v-for="(item, i) in excludeItems" 
        :key="i"
        :value="item"
        color="error"
      >
        <template v-slot:prepend>
          <v-icon icon="mdi-close"></v-icon>
        </template>
        <v-list-item-title v-text="item.text"></v-list-item-title>
      </v-list-item>
    </v-list>
  </v-card>

  <p>E.g. if you are inputing the data for 2024, you want to count the number of active customers on 1.1.2024. </p>
</template>

<script>
export default {
  data: () => ({
    includeItems: [
      { text: 'Count each unique customer organization once' },
      { text: 'Include all subscription tiers' },
      { text: 'Only count active, paying customers' }
    ],
    excludeItems: [
      { text: 'Free trial users' },
      { text: 'Cancelled/churned customers' },
      { text: 'Internal test accounts' }
    ],
  }),
}
</script>
