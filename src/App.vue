<template>
  <div id="app">
		<button @click="togglePopup()">Pay with Yapay</button>

		<div v-if="showPopup" id="popupBoxOnePosition">
			<div class="popupBoxWrapper">
				<div class="popupBoxContent">
					<div class="exit">
						<button v-on:click="togglePopup()">&times;</button>
					</div>
					<div v-if="!confirmed">
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
					<h2 v-if="confirmed">Confirmed!</h2>
				</div>
			</div>
		</div>
  </div>
</template>

<script>
import QrcodeVue from 'qrcode.vue'
import axios from 'axios'

// We store the reference to the SSE object out here
// so we can access it from other methods
let sseServer

export default {
  name: 'app',
  components: {
    QrcodeVue
  },
  data() {
  	return {
  		showPopup: false,
  		qrValue: "",
  		showQr: false,
  		confirmed: false
  	}
  },
  methods: {
  	togglePopup: function() {
  		this.showPopup = !this.showPopup
  		this.getQr()
  		if (this.confirmed) {
  			this.confirmed = false
  		}
  	},
  	getQr: function(id) {
  		const paymentUrl = "http://localhost:8080/payments"
  		let data = {
	    	"amt": 100,
	    	"cpn": "drimer",
	    	"cpp": "993321323",
		  }
		  let self = this
		  
		  axios.post(paymentUrl, data)
		  	.then(response => {
		  		console.log(JSON.stringify(response.data, null, 2))
					self.qrValue = response.data
					self.showQr = true
					self.openSseConnection(123)
		  	})
		  	.catch(error =>{
		  		console.log("error: " + error)
		  	})
		  
  	},
  	openSseConnection: function(id) {
  		let eventsEndpoint = "http://localhost:8080/confirmEvent/" + id.toString()
  		let self = this
	  	this.$sse(eventsEndpoint)
	  		.then(sse => {
	  			self.sseServer = sse

	  			sse.onError(error => {
	  				console.log("Lost connection. Trying to reconnect...", error)
	  				self.confirmed = false
	  				//sse.close()
	  			})

	  			sse.subscribe('yapay-confirm-payment', (signal) => {
	  				console.log("Received signal: " + signal)
	  				console.log("Closing connection...")
	  				self.confirmed = true
	  				sse.close()
	  			})
	  		})
	  		.catch(error => {
	  			// When this error is caught, it means the initial connection to the
	        // events server failed.  No automatic attempts to reconnect will be made.
	        console.log('Failed to connect to server', err);
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
