<template>
<!-- Modal -->
<div class="modal fade" :id="'sendTipModal'+componentId" tabindex="-1" :aria-labelledby="'sendTipModalLabel'+componentId" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" :id="'sendTipModalLabel'+componentId">Send a ${{ tokenSymbol }} tip</h1>
        <button :id="'closeSendTipModal'+componentId" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <div class="modal-body">

        <p>Send a {{ tokenName }} tip to <strong>{{ recipientName }}</strong>:</p>

        <div class="row">
          <div class="input-group input-group-lg col-md-4">
            <input 
              v-model="amount" 
              type="number" 
              pattern="[0-9]*" 
              inputmode="numeric" 
              class="form-control" 
              placeholder="Enter amount to tip" 
              aria-label="Recipient's username" aria-describedby="basic-addon2"
            />
            <span class="input-group-text" id="basic-addon2">{{ tokenSymbol }}</span>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>

        <button 
          class="btn btn-primary" 
          @click="sendTokens"
          :disabled="!amount || waiting"
        >
          <span v-if="waiting" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Send tip
        </button>
      </div>

    </div>
  </div>
</div>
</template>

<script>
import { ethers } from 'ethers';
import { useEthers } from 'vue-dapp';
import { useToast } from "vue-toastification/dist/index.mjs";
import Erc20Abi from "~/assets/abi/Erc20Abi.json";
import WaitingToast from "~/components/WaitingToast";
import { useUserStore } from '~/store/user';

export default {
  name: "TokenTipModal",
  props: [
    "componentId", "masterPostId", "recipientDomain", "recipientAddress", "repliedPostId", "repliedPostTags", 
    "tokenAddress", "tokenName", "tokenSymbol", "tokenDecimals", "tokenAmount"
  ],

  data()  {
    return {
      amount: 0,
      waiting: false
    }
  },

  mounted() {
    this.amount = this.tokenAmount;
  },

  computed: {
    recipientName() {
      if (this.recipientDomain) {
        return this.recipientDomain;
      } else {
        return this.recipientAddress;
      }
    }
  },

  methods: {
    async makeOrbisTipNotification() {
      if (this.userStore.getIsConnectedToOrbis && this.$config.chatChannels.tippingAlerts) { 
        try {
          const options = {
            body: "I have tipped " + this.recipientName + " " + String(this.amount) + " " + this.tokenSymbol + "!", 
            context: this.$config.chatChannels.tippingAlerts
          }

          // post on Orbis (shoot and forget)
          await this.$orbis.createPost(options);
        } catch (e) {
          console.log(e);
        }
      } 
    },

    async makeOrbisPost() {
      if (this.userStore.getIsConnectedToOrbis) {
        let masterId = this.masterPostId;

        if (!this.masterId) {
          masterId = this.repliedPostId;
        }

        try {
          const options = {
            master: masterId, // the main post in the thread
            reply_to: this.repliedPostId, // important: reply_to needs to be filled out even if the reply is directly to the master post
            body: "I have tipped you " + this.amount + " " + this.tokenSymbol + "!", 
            context: this.$config.orbisContext,
            //tags: this.repliedPostTags
          }

          // post on Orbis (shoot and forget)
          await this.$orbis.createPost(options);
        } catch (e) {
          console.log(e);
        }
      } 
    },

    async sendTokens() {
      this.waiting = true;

      const tokenContract = new ethers.Contract(this.tokenAddress, Erc20Abi, this.signer);

      try {
        const tx = await tokenContract.transfer(
          this.recipientAddress,
          ethers.utils.parseUnits(String(this.amount), String(this.tokenDecimals))
        );

        const toastWait = this.toast(
          {
            component: WaitingToast,
            props: {
              text: "Please wait for your transaction to confirm. Click on this notification to see transaction in the block explorer."
            }
          },
          {
            type: "info",
            onClick: () => window.open(this.$config.blockExplorerBaseUrl+"/tx/"+tx.hash, '_blank').focus()
          }
        );

        const receipt = await tx.wait();

        if (receipt.status === 1) {
          this.toast.dismiss(toastWait);

          this.toast("You have successfully sent " + String(this.amount) + " " + this.tokenSymbol + " to " + this.recipientName, {
            type: "success",
            onClick: () => window.open(this.$config.blockExplorerBaseUrl+"/tx/"+tx.hash, '_blank').focus()
          });
      
          this.makeOrbisPost();
          //this.makeOrbisTipNotification();

          this.waiting = false;
          document.getElementById('closeSendTipModal'+this.componentId).click();
        } else {
          this.toast.dismiss(toastWait);
          this.waiting = false;
          this.toast("Transaction has been unsuccessful.", {
            type: "error",
            onClick: () => window.open(this.$config.blockExplorerBaseUrl+"/tx/"+tx.hash, '_blank').focus()
          });
          console.log(receipt);
        }
      } catch (e) {
        console.error(e);

        try {
          let extractMessage = e.message.split("reason=")[1];
          extractMessage = extractMessage.split(", method=")[0];
          extractMessage = extractMessage.replace('"', "");
          extractMessage = extractMessage.replace('"', "");
          extractMessage = extractMessage.replace('execution reverted:', "Error:");

          console.log(extractMessage);
          
          this.toast(extractMessage, {type: "error"});
        } catch (e) {
          this.toast("Transaction has failed.", {type: "error"});
        }

        this.waiting = false;
      }
    }
  },

  setup() {
    const { address, chainId, isActivated, signer } = useEthers();
    const toast = useToast();
    const userStore = useUserStore();
    
    return { address, chainId, isActivated, signer, toast, userStore }
  }
}
</script>