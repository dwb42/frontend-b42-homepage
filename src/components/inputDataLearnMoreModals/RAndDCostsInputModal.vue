
<template>
  <p class="mb-2">Enter all costs related to product development:</p>
  
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

  <p>We ask for your R&D Costs to see how heavily you are investing in your product.</p>
</template>

<script>
export default {
  data: () => ({
    costItems: [
      { text: 'Developer salaries and benefits' },
      { text: 'Product management team costs' },
      { text: 'Development tools and licenses' },
      { text: 'Testing and QA costs' },
      { text: 'Research expenses' },
      { text: 'Design team costs' }
    ],
  }),
}
</script>
