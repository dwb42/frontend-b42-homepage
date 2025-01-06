
<template>
  <p class="mb-4">Enter only the revenue that comes from recurring sources, typically:</p>
  
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

  <p class="mb-2 mt-6">Do not include:</p>
  
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
  <p>We need your Recurring Revenue to calculate your Recurring Revenue Ratio.</p>
</template>

<script>
export default {
  data: () => ({
    includeItems: [
      { text: 'Monthly subscription fees' },
      { text: 'Annual subscription fees (divided by 12 for monthly ARR)' },
      { text: 'Regular platform usage fees' }
    ],
    excludeItems: [
      { text: 'One-time setup fees' },
      { text: 'Professional services' },
      { text: 'Training or consulting fees' }
    ],
  }),
}
</script>
