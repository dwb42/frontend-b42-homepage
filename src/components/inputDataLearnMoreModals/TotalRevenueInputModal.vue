
<template>
  <p class="mb-4">Enter the total amount of revenue your company generated in the given period. This should include:</p>
  
  <v-card class="mb-4">
    <v-list density="compact">
      <v-list-item
        v-for="(item, i) in revenueItems"
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

  <p class="mb-4">Enter the gross amount before any deductions, taxes, or costs.</p>
</template>

<script>
export default {
  data: () => ({
    revenueItems: [
      { text: 'All recurring revenue (e.g., subscriptions)' },
      { text: 'One-time revenue (e.g., setup fees)' },
      { text: 'Service revenue (e.g., consulting)' },
      { text: 'Other revenue streams' }
    ],
  }),
}
</script>
