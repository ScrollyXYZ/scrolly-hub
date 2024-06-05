<template>
  <p class="mb-2">You have permission to mint this badge:</p>

  <div class="card border-1">
    <img :src="badgeMetadata.image" class="card-img-top" :alt="badgeMetadata.name">
    <div class="card-body text-center">
      <h5 class="card-title">{{ badgeMetadata.name }}</h5>

      <p class="card-text">{{ badgeMetadata.description }}</p>

      <button class="btn btn-primary mt-2" @click="mintBadge" :disabled="waiting">
        <span v-if="waiting" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Mint this badge
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useEthers } from 'vue-dapp';
import { useToast } from "vue-toastification/dist/index.mjs";

import WaitingToast from "~/components/WaitingToast";

export default {
 name: 'BadgeMintBadge',
 props: ['apiBaseUrl', 'badgeContractAddress', 'badgeMetadata'],
 emits: ['checkIfBadgeMinted'],

 data() {
   return {
     waiting: false
   }
 },

 methods: {

  async mintBadge() {
      this.waiting = true;

      const url = `${this.apiBaseUrl}claim?badge=${this.badgeContractAddress}&recipient=${this.address}`;

      try {
        const response = await axios.get(url);

        const tx = await this.signer.sendTransaction(response.data.tx);

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
            
            this.toast("You have successfully minted a Scroll Canvas badge!", {
              type: "success",
              onClick: () => window.open(this.$config.blockExplorerBaseUrl+"/tx/"+tx.hash, '_blank').focus()
            });
            
            this.$emit("checkIfBadgeMinted");
          } else {
            this.toast.dismiss(toastWait);
            this.toast("Transaction has failed.", {
              type: "error",
              onClick: () => window.open(this.$config.blockExplorerBaseUrl+"/tx/"+tx.hash, '_blank').focus()
            });
            console.log(receipt);
          }

        } catch (e) {
          console.error(e);
          this.toast("Error: " + e, {type: "error"});
          return;
        } finally {
          this.waiting = false;
        }
    },
 },

 setup() {
    const { address, signer } = useEthers();
    const toast = useToast();

    return { address, signer, toast };
  }
}
</script>
