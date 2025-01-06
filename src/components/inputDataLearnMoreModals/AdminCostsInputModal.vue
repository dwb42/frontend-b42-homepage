
<template>
  <p class="mb-4">Enter all overhead and administrative costs:</p>
  
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

  <v-alert type="info" text="Only include costs not already counted in other categories." class="mb-4"></v-alert>
</template>

<script>
export default {
  data: () => ({
    costItems: [
      { text: 'Executive team salaries' },
      { text: 'Office rent and utilities' },
      { text: 'Administrative staff costs' },
      { text: 'Legal and accounting fees' },
      { text: 'Insurance' },
      { text: 'Office supplies and equipment' },
      { text: 'HR and recruitment costs' }
    ],
  }),
}
</script>
