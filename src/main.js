import Vue from 'vue'
import App from './App.vue'
import 'document-register-element/build/document-register-element'

import vueCustomElement from 'vue-custom-element'
import VueSSE from 'vue-sse';
import VueJwtDecode from 'vue-jwt-decode'

Vue.use(vueCustomElement);
Vue.use(VueJwtDecode)

Vue.customElement('yapay-widget', App);
Vue.use(VueSSE);