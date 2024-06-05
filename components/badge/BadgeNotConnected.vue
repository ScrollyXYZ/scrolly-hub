<template>
  <div class="card border-1">
    <img src="../../assets/img/badge/disconnected.png" class="card-img-top" alt="Disconnected">
    <div class="card-body text-center">
      <h5 class="card-title">Not connected</h5>
      <p class="card-text">Connect your wallet to see if you're eligible for a badge.</p>
      <ConnectWalletButton class="btn btn-outline-primary" btnText="Connect wallet" />
    </div>
  </div>
</template>

<script>
import ConnectWalletButton from "~/components/ConnectWalletButton.vue";

export default {
 name: 'BadgeNotConnected',

 components: {
    ConnectWalletButton
  },
}
</script>
