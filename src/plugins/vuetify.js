/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
// https://vuetifyjs.com/en/styles/colors/#material-colors
export default createVuetify({
  theme: {
    themes: {
      light: {
        colors: {
          //primary: '#1867C0',   // indigo
          primary: '#00695C',   // teal 
          //secondary: '#5CBBF6', 
          secondary: '#26A69A', 
        },
      },
    },
  },
})
