@import url('https://fonts.googleapis.com/css?family=Roboto+Condensed');

<template>
  <div id="app">
		<button @click="openPopup()">Yapay</button>

		<div v-if="showPopup" id="popupBoxOnePosition">
			<div class="popupBoxContent">
				<div v-if="!confirmed">
				<div style="background: #00d0b6; width: 50%; float: right; padding: 10px;">
					<div class="exit">
						<a href="#" style="text-decoration: none; color: black;" v-on:click="closePopup()">&times;</a>
					</div>
				</div>
				
					<div class="column" style="background: #00d0b6">
						<img src="@/assets/yape_logo.png" style="display: block; margin-left: auto; margin-right: auto; width: 25%;">
						<div style="display:inline-block; padding: 30px">
							<div>1. Entra a Yape desde tu smartphone</div>
							<div>2. Ingresa a Yape con tu clave de 6 d&iacutegitos</div>
							<div>3. Haz click en el bot&oacuten con el s&iacutembolo QR</div>
							<div>4. Alinea el c&oacutedigo QR con el cuadrado</div>
							<div>5. Confirma tu pedido</div>
						</div>
					</div>

					<div style="padding-left: 20px; padding-top: 20px">
						<div style="display: inline-block;">
							<qrcode-vue
								v-if="showQr"
								:value="qrValue"
								:size="200">
							</qrcode-vue>
							<div>
								
							</div>
							<img
								v-if="!showQr" 
								src="@/assets/loading.gif"
								alt="QR Placeholder"
								height="200px"
							/>
						</div>
						<div>
							<p>Yape disponible en:</p>
							<a target="_blank" href="https://itunes.apple.com/pe/app/yape/id1147249919">
								<img src="@/assets/app_store.png" alt="App Store on" width="100px"/>
							</a>
							<a target="_blank" href="https://play.google.com/store/apps/details?id=com.bcp.innovacxion.yapeapp">
								<img src="@/assets/google_play.png" alt="Google Play on" width="100px"/>
							</a>
						</div>
					</div>
				</div>
				<a :href="confirmationpage" v-if="confirmed">Confirmed, click to continue</a>
			</div>
		</div>
  </div>
</template>

<script>
//../dummy_ecommerce/templates/confirmation.html

import QrcodeVue from 'qrcode.vue'
import axios from 'axios'
import VueJwtDecode from 'vue-jwt-decode'
import company_info from '../new_company.json'

// We store the reference to the SSE object out here
// so we can access it from other methods
let sseServer

export default {
  props: ['paymentjwt', 'confirmationpage'],
  name: 'app',
  components: {
    QrcodeVue
	},
  data() {
  	return {
  		showPopup: false,
  		qrValue: "",
  		showQr: false,
		confirmed: false, //change to true later
		decoded: null,
		refreshQrTimer: null
  	}
  },
  methods: {
  	openPopup: function() {
  		this.showPopup = true
  		console.log("openpopup start")
  		this.getQr()
  	},
  	closePopup: function() {
  		this.showPopup = false
  		console.log(sseServer)
  		sseServer.close()
  	},
  	getQr: function() {
		this.qrValue = this.paymentjwt
		this.showQr = true
		this.decoded = VueJwtDecode.decode(this.paymentjwt)
		console.log(this.decoded)
		this.openSseConnection(this.decoded.pid)
		this.refreshQrTimer = setInterval(this.updateQr, 60000)
  	},
  	openSseConnection: function(id) {
  		console.log("openSseConnection start")
  		let eventsEndpoint = "http://localhost:8080/confirmEvent/" + id.toString()
  		let self = this
	  	this.$sse(eventsEndpoint)
	  		.then(sse => {
	  			sseServer = sse
	  			console.log("sse asigned")

	  			sse.onError(error => {
	  				console.log("Lost connection. Trying to reconnect...", error)
	  				self.confirmed = false
	  			})

	  			sse.subscribe('yapay-confirm-payment', (signal) => {
	  				console.log("Received signal: " + signal)
	  				console.log("Closing connection...")
	  				self.confirmed = true
	  				// Stop refreshing the QR
	  				clearInterval(self.refreshQrTimer)
	  				sse.close()
	  			})
	  		})
	  		.catch(error => {
	  		// When this error is caught, it means the initial connection to the
	        // events server failed.  No automatic attempts to reconnect will be made.
	        console.log('Failed to connect to server', err);
	  		})
  	},
  	updateQr: function() {
  		console.log("Grabbing new qr")
  		let url = "http://localhost:8080/payments/jwt"

  		let self = this
  		let myHeaders = { pid: this.decoded.pid }
  		axios.get(url, { headers: myHeaders })
  			.then(newJwt => {
  				console.log(newJwt.data)
  				self.qrValue = newJwt.data
  				console.log("QrValue")
  				console.log(self.qrValue)
  				self.decoded = VueJwtDecode.decode(newJwt.data)
  				console.log("Decoded")
  				console.log(self.decoded)
  			})
  			.catch(error => {
  				console.log(error)
  			})
  	}
  },
  beforeDestroy() {
  	// Make sure to close the connection with the events server
    // when the component is destroyed, or we'll have ghost connections!
    sseServer.close();
  }
}
</script>
<style>
*{
		font-family: 'Roboto', sans-serif;
}
						
#popupBoxOnePosition{
    top: 0; left: 0; position: fixed; width: 100%; height: 120%;
    background-color: rgba(0,0,0,0.7);
}
.popupBoxContent{
		background-color: #FFF;
		width: 750px; margin: 50px auto;
}
.exit {
    text-align: right;
    font-size: 25px;
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
.column{
		float: right;
		width: 50%;
		padding: 10px;
		height: 220px;
}
</style>