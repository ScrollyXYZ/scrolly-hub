<template>
  <div class="card border-1">
    <img src="../../assets/img/badge/switch-network.png" class="card-img-top" alt="Switch network">
    <div class="card-body text-center">
      <h5 class="card-title">Switch network</h5>
      <p class="card-text">You're on the wrong network. Please switch the chain using the button below.</p>
      <SwitchChainButton />
    </div>
  </div>
</template>

<script>
import SwitchChainButton from '~/components/SwitchChainButton.vue';

export default {
 name: 'BadgeSwitchNetwork',

 components: {
    SwitchChainButton
  },
}
</script>
