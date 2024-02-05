<template>
  <nav class="navbar navbar-expand-lg navbar-bg-custom">
    <div class="container-fluid mx-3">
      <NuxtLink class="navbar-brand" to="/">
        <img src="/img/favicon.png" alt="Chat logo" height="35" />
        <span class="navbar-brand-text ms-2 align-middle">Scrolly Hub</span>
      </NuxtLink>

      <ul class="navbar-nav justify-content-end flex-grow-1">

        <li v-if="isActivated" class="nav-item">
          <span class="nav-link cursor-pointer" data-bs-toggle="modal" data-bs-target="#referralModal">
            Earn referral fees! 🤑
          </span>
        </li>
        
        <li v-if="!isActivated" class="nav-item">
          <ConnectWalletButton class="nav-link cursor-pointer" btnText="Connect wallet" />
        </li>

        <SwitchChainButton v-if="isActivated" :navbar="true" :dropdown="true" />

        <li v-if="isActivated" class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
            {{showDomainOrAddress}}
          </a>
          <div class="dropdown-menu dropdown-menu-end">
            <NuxtLink class="dropdown-item cursor-pointer" to="/profile">Profile</NuxtLink>
            <span class="dropdown-item cursor-pointer" data-bs-toggle="modal" data-bs-target="#chatSettingsModal">Settings</span>
            <span class="dropdown-item cursor-pointer" data-bs-toggle="modal" data-bs-target="#changeUsernameModal">Change username</span>
            <span class="dropdown-item cursor-pointer" data-bs-toggle="modal" data-bs-target="#findUserModal">Find user</span>
            <span class="dropdown-item cursor-pointer" data-bs-toggle="modal" data-bs-target="#referralModal">Share referral link</span>
            <span class="dropdown-item cursor-pointer" @click="disconnectWallet">Disconnect</span>
          </div>
        </li>

        <li v-if="isActivated && $config.chatTokenAddress" class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
            {{ userStore.getChatTokenBalance }} {{ $config.chatTokenSymbol }}
          </a>
          <div class="dropdown-menu dropdown-menu-end">
            <NuxtLink class="dropdown-item cursor-pointer" to="/stake" v-if="$config.stakingContractAddress && $config.showFeatures.stake">Stake & earn weekly {{ $config.tokenSymbol }} rewards</NuxtLink>
            <span class="dropdown-item cursor-pointer" @click="addToMetaMask">Add {{ $config.chatTokenSymbol }} to MetaMask</span>
          </div>
        </li>

        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
            Theme: {{ String(siteStore.getColorMode).charAt(0).toUpperCase() }}{{ String(siteStore.getColorMode).slice(1) }}
          </a>
          <div class="dropdown-menu dropdown-menu-end">
            <span class="dropdown-item cursor-pointer" @click="changeColorMode('scrolly')">Scrolly</span>
            <span class="dropdown-item cursor-pointer" @click="changeColorMode('dark')">Dark</span>
            <span class="dropdown-item cursor-pointer" @click="changeColorMode('light')">Light</span>
          </div>
        </li>

      </ul>
    </div>
  </nav>
</template>

<script>
import { useEthers, useWallet, shortenAddress } from 'vue-dapp';
import { useSiteStore } from '~/store/site';
import { useUserStore } from '~/store/user';
import ConnectWalletButton from "~/components/ConnectWalletButton.vue";
import SwitchChainButton from "~/components/SwitchChainButton.vue";
import { addTokenToMetaMask } from '~/utils/tokenUtils';
import { getTextWithoutBlankCharacters } from '~/utils/textUtils';

export default {
  name: "Navbar",

  components: {
    ConnectWalletButton,
    SwitchChainButton
  },

  computed: {
    showDomainOrAddress() {
      if (this.userStore.getDefaultDomain) {
        return getTextWithoutBlankCharacters(this.userStore.getDefaultDomain);
      } else if (this.address) {
        return this.shortenAddress(this.address);
      }

      return "Profile"
    }
  },

  methods: {
    addToMetaMask() {
      addTokenToMetaMask(
        window.ethereum,
        this.$config.chatTokenAddress, 
        this.$config.chatTokenSymbol, 
        18, // decimals
        this.$config.chatTokenImage
      );
    },

    changeColorMode(newMode) {
      this.siteStore.setColorMode(newMode);
      document.documentElement.setAttribute("data-bs-theme", this.siteStore.getColorMode);
    },

    async disconnectWallet() {
      this.disconnect();
    }
  },

  setup() {
    const { disconnect } = useWallet();
    const { address, isActivated } = useEthers();
    const siteStore = useSiteStore();
    const userStore = useUserStore();

    return { address, disconnect, isActivated, shortenAddress, siteStore, userStore }
  }
}
</script>
