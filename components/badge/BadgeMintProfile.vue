<template>
  <div class="card border-1">
    <img src="../../assets/img/badge/mint-profile.png" class="card-img-top" alt="Mint Profile">
    <div class="card-body text-center">
      <h5 class="card-title">Mint Profile</h5>

      <div class="d-flex justify-content-center mb-3" v-if="waitingUsername">
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      </div>

      <p class="card-text">You don't have a profile yet. Mint it here. Enter username below.</p>

      <input type="text" class="form-control text-center" id="inputUsername" v-model="username" placeholder="Enter username" />

      <button @click="mintUsername" :disabled="waiting || waitingUsername || !username" class="btn btn-primary mt-4">
        <span v-if="waiting" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Mint Profile for {{ mintFee }} ETH
      </button>
    </div>
  </div>
</template>

<script>
import { useEthers } from 'vue-dapp';
import { ethers } from 'ethers';
import { useToast } from "vue-toastification/dist/index.mjs";
import WaitingToast from "~/components/WaitingToast";
import { useUserStore } from '~/store/user';
import { getDomainName } from '~/utils/domainUtils';

export default {
  name: 'BadgeMintProfile',
  props: ["profileRegistryAddress"],
  emits: ["checkIfProfileMinted"],

  data() {
    return {
      domainName: null,
      mintFeeWei: 1000000000000000,
      username: null,
      waiting: false,
      waitingUsername: false,
    };
  },

  mounted() {
    this.fetchScrollyName();
    this.fetchMintFee();
  },

  computed: {
    mintFee() {
      return ethers.utils.formatEther(this.mintFeeWei);
    }
  },

  methods: {
    async fetchMintFee() {
      const intrfc = new ethers.utils.Interface([
        "function MINT_FEE() external view returns (uint256)",
        "function mint(string calldata username, bytes memory referral) external payable returns (address)"
      ]);

      const contract = new ethers.Contract(this.profileRegistryAddress, intrfc, this.signer);

      try {
        this.mintFeeWei = await contract.MINT_FEE();
        console.log("Mint fee", Number(this.mintFeeWei));
      } catch (error) {
        console.error("Error getting mint fee", error);
      }
    },

    async fetchScrollyName() {
      let provider = this.$getFallbackProvider(this.$config.supportedChainId);

      if (this.signer) {
        provider = this.signer;
      }

      this.domainName = await getDomainName(this.address, provider);

      if (this.domainName) {
        this.username = this.domainName;
      }
    },

    async isUsernameUsed() {
      if (!this.username) {
        this.toast.error("Please enter a username");
        this.waiting = false;
        return;
      }

      const intrfc = new ethers.utils.Interface([
        "function isUsernameUsed(string calldata username) external view returns (bool)",
      ]);

      const contract = new ethers.Contract(this.profileRegistryAddress, intrfc, this.signer);

      try {
        const usernameUsed = await contract.isUsernameUsed(this.username);
        return usernameUsed;
      } catch (error) {
        console.error("Error checking if username is used", error);
      } finally {
        this.waiting = false;
      }
    },

    async mintUsername() {
      this.waiting = true;

      const usernameUsed = await this.isUsernameUsed();

      if (usernameUsed) {
        this.toast.error("Username already used. Please pick another one.");
        this.waiting = false;
        return;
      }

      const intrfc = new ethers.utils.Interface([
        "function mint(string calldata username, bytes memory referral) external payable returns (address)"
      ]);

      const contract = new ethers.Contract(this.profileRegistryAddress, intrfc, this.signer);

      try {
          const tx = await contract.mint(
            this.username, // username
            "0x", // referral
            {
              value: this.mintFeeWei
            }
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
            
            this.toast("You have successfully minted a Scroll Canvas profile!", {
              type: "success",
              onClick: () => window.open(this.$config.blockExplorerBaseUrl+"/tx/"+tx.hash, '_blank').focus()
            });
            
            this.$emit("checkIfProfileMinted");
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
    const userStore = useUserStore();

    return { address, signer, toast, userStore };
  }

}
</script>
