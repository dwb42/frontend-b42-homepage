
<template>
  <p class="mb-4">Enter the number of customers who churned during this period:</p>
  
  <v-card class="mb-4">
    <v-list density="compact">
      <v-list-item 
        v-for="(item, i) in includeItems" 
        :key="i"
        :value="item"
        color="primary"
      >
        <template v-slot:prepend>
          <v-icon icon="mdi-account-remove"></v-icon>
        </template>
        <v-list-item-title v-text="item.text"></v-list-item-title>
      </v-list-item>
    </v-list>
  </v-card>

  <p class="mb-4">Do NOT include:</p>
  
  <v-card class="mb-4">
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

  <v-alert type="info" text="Count the customer as lost in the period when they actually stopped being a customer, not when they gave notice." class="mb-4"></v-alert>
</template>

<script>
export default {
  data: () => ({
    includeItems: [
      { text: 'Cancelled subscriptions' },
      { text: 'Non-renewed annual contracts' },
      { text: 'Accounts closed by customer' }
    ],
    excludeItems: [
      { text: 'Customers who downgraded but remained active' },
      { text: 'Temporary suspensions' },
      { text: 'Failed payments that were later recovered' }
    ],
  }),
}
</script>
