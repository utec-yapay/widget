<template>
  <div id="app">
		<button @click="togglePopup()">Pay with Yapay</button>

		<div v-if="showPopup" id="popupBoxOnePosition">
			<div class="popupBoxWrapper">
				<div class="popupBoxContent">
					<div class="exit">
						<button v-on:click="togglePopup()">&times;</button>
					</div>
					<div class="payWithYape">Pay With Yape</div>
					<div style="display:inline-block; vertical-align:top;">
						<qrcode-vue
							v-if="showQr"
							:value="qrValue"
							:size="200">
						</qrcode-vue>
						<img
							v-if="!showQr" 
							src="@/assets/loading.gif"
							alt="QR Placeholder"
							height="200px"
						/>
					</div>
					<div style="display:inline-block; padding: 30px">
						<div>1. Entra a Yape desde tu smartphone</div>
						<div>2. Ingresa a Yape con tu clave de 6 d&iacutegitos</div>
						<div>3. Haz click en el bot&oacuten con el s&iacutembolo QR</div>
						<div>4. Alinea el c&oacutedigo QR con el cuadrado</div>
						<div>5. Confirma tu pedido</div>
					</div>

					<div>
						<p>Yape disponible en:</p>
						<a target="_blank" href="https://itunes.apple.com/pe/app/yape/id1147249919">
							<img src="@/assets/app_store.png" alt="App Store Button" width="100px"/>
						</a>
						<a target="_blank" href="https://play.google.com/store/apps/details?id=com.bcp.innovacxion.yapeapp">
							<img src="@/assets/google_play.png" alt="Google Play Button" width="100px"/>
						</a>
					</div>
				</div>
			</div>
		</div>
  </div>
</template>

<script>
import QrcodeVue from 'qrcode.vue'
import axios from 'axios'

export default {
  name: 'app',
  components: {
    QrcodeVue
  },
  data() {
  	return {
  		showPopup: false,
  		qrValue: ""
  	}
  },
  methods: {
  	togglePopup: function() {
  		console.log("showPopup: " + this.showPopup)
  		console.log("qrValue: " + this.qrValue)
  		this.showPopup = !this.showPopup
  		this.getQr()
  		console.log("showPopup: " + this.showPopup)
  		console.log("qrValue: " + this.qrValue)
  	},
  	getQr: function(id) {
  		const paymentUrl = "http://localhost:8080/payments"
  		let data = {
	    	"amount": 100,
	    	"companyName": "drimer",
	    	"companyPhone": "993321323",
		  }
		  let self = this
		  self.qrValue = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
			self.showQr = true
		  /*axios.post(paymentUrl, data)
		  	.then(response => {
		  		console.log(JSON.stringify(response.data, null, 2))
					self.qrValue = response.jwt
					self.showQr = true
		  	})
		  	.catch(error =>{
		  		console.log(JSON.stringify(error.response, null, 2))
		  	})*/
  	}
  }
}
</script>
<style>
#popupBoxOnePosition{
    top: 0; left: 0; position: fixed; width: 100%; height: 120%;
    background-color: rgba(0,0,0,0.7);
}
.popupBoxWrapper{
    width: 750px; margin: 50px auto;
}
.popupBoxContent{
    background-color: #FFF; padding: 15px;
}
.exit {
    text-align: right;
    font-size: 20px;
}
.payWithYape{
    text-align: center;
}
.first {
    float: left;
    display: flex;
    align-items: center;
    justify-content: center;
}
.second {
    float: right;
    display: flex;
    align-items: center;
    justify-content: center;
}
.img{
    height: auto;
    width: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
