<template>
<div class="card border-1">
  <img :src="badgeMetadata.image" class="card-img-top" :alt="badgeMetadata.name">
  <div class="card-body text-center">
    <h5 class="card-title">{{ badgeMetadata.name }}</h5>

    <div class="d-flex justify-content-center mb-3" v-if="waitingData">
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    </div>

    <p class="card-text">{{ badgeMetadata.description }}</p>

    <button v-if="!isAttached" class="btn btn-primary mt-2" @click="attach" :disabled="waiting">
      <span v-if="waiting" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      Attach badge to Profile
    </button>

    <div class="d-flex justify-content-center" v-if="isAttached">
      <i class="bi bi-patch-check-fill"></i>
    </div>

  </div>
</div>
</template>

<script>
import axios from 'axios';
import { ethers } from 'ethers';
import { useEthers } from 'vue-dapp';
import { useToast } from "vue-toastification/dist/index.mjs";

import WaitingToast from "~/components/WaitingToast";

export default {
name: 'BadgeDetails',
props: ['badgeContractAddress', 'badgeMetadata', 'graphqlUrl', 'profileAddress', 'profileRegistryAddress'],
emits: ['checkIfBadgeMinted'],

data() {
  return {
    attId: null,
    isAttached: false,
    profileAddr: null,
    waiting: false,
    waitingData: false
  }
},

mounted() {
  this.fetchAttestationId();

  if (!this.profileAddress) {
    this.fetchProfileAddress();
  } else {
    this.profileAddr = this.profileAddress;
  }
},

methods: {

  async attach() {
    this.waiting = true;

    const intrfc = new ethers.utils.Interface([
      "function attach(bytes32[] memory _uids) external"
    ]);

    const contract = new ethers.Contract(this.profileAddr, intrfc, this.signer);

    try {
      const tx = await contract.functions.attach([this.attId]);

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
        
        this.toast("You have successfully attached your badge to a Scroll Canvas profile!", {
          type: "success",
          onClick: () => window.open(this.$config.blockExplorerBaseUrl+"/tx/"+tx.hash, '_blank').focus()
        });
        
        this.checkAttached();
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

  async checkAttached() {
    if (this.attId && this.profileAddr) {
      const intrfc = new ethers.utils.Interface([
        "function getAttachedBadges() external view returns (bytes32[] memory)"
      ]);

      const contract = new ethers.Contract(this.profileAddr, intrfc, this.signer);

      try {
        const attachedBadges = await contract.getAttachedBadges();

        if (attachedBadges.includes(this.attId)) {
          this.isAttached = true;
        } else {
          this.isAttached = false;
        }
      } catch (error) {
        console.error(error);
        this.toast.error("An error occurred with the getAttachedBadges() call. Please try again later.");
      }
    }
  },

  async fetchAttestationId() {
    this.waitingData = true;

    const query = `
      query Attestation {
        attestations(
          where: {
            schemaId: { equals: "0xa35b5470ebb301aa5d309a8ee6ea258cad680ea112c86e456d5f2254448afc74" },
            attester: { equals: "0xdCECb6Ab3e414202Ba1bdc5DaE8B336769d2621C" },
            recipient: { equals: "${this.address}" },
            revoked: { equals: false }
          }
        ) {
          data
          id
          time
          txid
        }
      }
    `;

    const headers = {
      'Content-Type': 'application/json'
    };

    try {
      const response = await axios.post(this.graphqlUrl, { query }, { headers });

      if (response.data?.data?.attestations) {
        this.attId = response.data.data.attestations[0].id;

        this.checkAttached();
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      this.waitingData = false;
    }
  },

  async fetchProfileAddress() {
    this.waitingData = true;

    const intrfc = new ethers.utils.Interface([
      "function getProfile(address account) public view returns (address)",
      "function isProfileMinted(address _user) external view returns (bool)"
    ]);

    const contract = new ethers.Contract(this.profileRegistryAddress, intrfc, this.signer);

    try {
      const getProfileAddr = await contract.getProfile(this.address);
      const isProfileMinted = await contract.isProfileMinted(this.profileAddr);

      if (isProfileMinted) {
        this.profileAddr = getProfileAddr;
      }
    } catch (error) {
      console.error(error);
      this.toast.error("An error occurred with the isProfileMinted() call. Please try again later.");
    } finally {
      this.waitingData = false;
    }
  }
},  

setup() {
  const { address, signer } = useEthers();
  const toast = useToast();

  return { address, signer, toast };
}
}
</script>
