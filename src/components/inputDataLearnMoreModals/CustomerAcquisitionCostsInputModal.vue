
<template>
  <p class="mb-4">Enter all costs related to acquiring new customers:</p>
  
  <v-card class="mb-4">
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

  <v-alert type="info" text="Include both successful and unsuccessful acquisition efforts." class="mb-4"></v-alert>
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
