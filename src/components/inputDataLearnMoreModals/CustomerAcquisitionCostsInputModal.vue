
<template>
  <p class="mb-2">Enter all costs related to acquiring new customers:</p>
  
  <v-card class="mb-6">
    <v-list density="compact">
      <v-list-item 
        v-for="(item, i) in costItems" 
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

  <p>We need your Cost of Customer Acquisition to calculate your LTV-to-CAC Ratio.</p>
</template>

<script>
export default {
  data: () => ({
    costItems: [
      { text: 'Sales team salaries and commissions' },
      { text: 'Marketing expenses' },
      { text: 'Advertising costs' },
      { text: 'Sales tools and CRM costs' },
      { text: 'Events and trade shows' },
      { text: 'Content marketing expenses' }
    ],
  }),
}
</script>
