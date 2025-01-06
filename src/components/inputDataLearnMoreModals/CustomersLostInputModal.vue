
<template>
  <p class="mb-4">Enter the number of customers who churned during this period:</p>
  <ul class="mb-4">
    <li>Cancelled subscriptions</li>
    <li>Non-renewed annual contracts</li>
    <li>Accounts closed by customer</li>
  </ul>
  <p class="mb-4">Do NOT include:</p>
  <ul class="mb-4">
    <li>Customers who downgraded but remained active</li>
    <li>Temporary suspensions</li>
    <li>Failed payments that were later recovered</li>
  </ul>
  <v-alert type="info" text="Count the customer as lost in the period when they actually stopped being a customer, not when they gave notice." class="mb-4"></v-alert>
</template>
