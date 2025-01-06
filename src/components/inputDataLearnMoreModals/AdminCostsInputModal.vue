
<template>
  <p class="mb-4">Enter all overhead and administrative costs:</p>
  
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

  <p>If you are unsure in which "bucket" to place a certain cost item, this is probably where you want to account for it. </p>
</template>

<script>
export default {
  data: () => ({
    costItems: [
      { text: 'Executive team salaries' },
      { text: 'Administrative staff costs' },
      { text: 'HR and recruitment costs' },
      { text: 'Office rent and utilities' },
      { text: 'Legal and accounting fees' },
      { text: 'Insurance' },
      { text: 'Office supplies and equipment' },
    ],
  }),
}
</script>
