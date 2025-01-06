
<template>
  <p class="mb-4">Enter the direct costs associated with delivering your service, including:</p>
  
  <v-card class="mb-6">
    <v-list density="compact">
      <v-list-item 
        v-for="(item, i) in includeItems" 
        :key="i"
        :value="item"
        color="primary"
      >
        <template v-slot:prepend>
          <v-icon icon="mdi-currency-usd"></v-icon>
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

  <p>We need your Cost of Goods Sold to calculate your Gross Margin.</p>
</template>

<script>
export default {
  data: () => ({
    includeItems: [
      { text: 'Cloud hosting & data storage costs' },
      { text: 'Third-party API fees' },
      { text: 'Software licenses directly used in service delivery' },
      { text: 'Customer support personnel costs' }
    ],
    excludeItems: [
      { text: 'Sales and marketing costs' },
      { text: 'R&D costs' },
      { text: 'Administrative overhead' }
    ],
  }),
}
</script>
