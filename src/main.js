import Vue from 'vue'
import App from './App.vue'
import 'document-register-element/build/document-register-element'

import vueCustomElement from 'vue-custom-element'
import VueSSE from 'vue-sse';

Vue.use(vueCustomElement);

Vue.customElement('yapay-widget', App);
Vue.use(VueSSE);