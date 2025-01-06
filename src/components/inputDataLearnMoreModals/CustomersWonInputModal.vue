
<template>
  <p class="mb-4">Enter the number of new paying customers acquired during this period:</p>
  
  <v-card class="mb-4">
    <v-list density="compact">
      <v-list-item 
        v-for="(item, i) in includeItems" 
        :key="i"
        :value="item"
        color="primary"
      >
        <template v-slot:prepend>
          <v-icon icon="mdi-account-plus"></v-icon>
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
</template>

<script>
export default {
  data: () => ({
    includeItems: [
      { text: 'New customers who started paying in this period' },
      { text: 'Free trial conversions to paid' },
      { text: 'Reactivated customers who were previously churned' }
    ],
    excludeItems: [
      { text: 'Customers who only signed up for trials' },
      { text: 'Upgrades from existing customers' },
      { text: 'Plan changes from existing customers' }
    ],
  }),
}
</script>
