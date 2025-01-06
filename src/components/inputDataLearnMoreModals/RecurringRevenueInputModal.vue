
<template>
  <div class="pa-4">
    <h2 class="text-h5 mb-4">Recurring Revenue</h2>
    <p class="mb-4">Enter only the revenue that comes from recurring sources, typically:</p>
    <ul class="mb-4">
      <li>Monthly subscription fees</li>
      <li>Annual subscription fees (divided by 12 for monthly ARR)</li>
      <li>Regular platform usage fees</li>
    </ul>
    <p class="mb-4">Do NOT include:</p>
    <ul class="mb-4">
      <li>One-time setup fees</li>
      <li>Professional services</li>
      <li>Training or consulting fees</li>
    </ul>
    <v-alert type="info" text="This value should be less than or equal to your total revenue." class="mb-4"></v-alert>
  </div>
</template>
