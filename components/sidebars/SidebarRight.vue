<template>
<div class="col-auto col-lg-3 px-0 mt-1">
  <div id="sidebar2" class="collapse collapse-horizontal" :class="{ show: sidebarStore.showRightSidebar }">
    <div id="sidebar-nav" class="list-group border-0 rounded-0 text-sm-start min-vh-100">

      <!-- Mint/register a domain name 
      <NameMintWidget />
      -->

      <div class="card m-2 bg-light" v-if="isMobile">
      <div class="card-body sidebar-card-body mt-4">
      <div class="d-grid gap-2">
        <div class="btn-group" role="group">
          <button type="button" class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
            Theme: {{ String(siteStore.getColorMode).charAt(0).toUpperCase() }}{{ String(siteStore.getColorMode).slice(1) }}
          </button>
          <ul class="dropdown-menu">
            <li><span class="dropdown-item cursor-pointer" @click="changeColorMode('scrolly')">Scrolly</span></li>
            <li><span class="dropdown-item cursor-pointer" @click="changeColorMode('dark')">Dark</span></li>
            <li><span class="dropdown-item cursor-pointer" @click="changeColorMode('light')">Light</span></li>
          </ul>
        </div>
      </div>
      </div>
      </div>

      <!-- Register a domain name -->
      <div class="card m-2 bg-light">
        <div class="card-header bg-light">Get a username</div>
        <div class="card-body sidebar-card-body">
          <p class="card-text">

            <span>
              Register a .scrolly username via 
              <a target="_blank" href="https://sns.scrolly.xyz/">Scrolly Name Service</a>!
            </span>

            <br />
            <br />

            <span class="mt-3">
              Get yourself some $SCROLLY tokens via 
              <a target="_blank" href="https://izumi.finance/trade/swap">Iziswap, here</a>.
            </span>
            
          </p>
        </div>
      </div>

      <!-- Referrals -->
      <ReferralWidget />

      <!-- Swap tokens -->
      <SimpleSwapWidget 
        v-if="$config.swapRouterAddress && $config.showFeatures.swap" 
        :routerAddress="$config.swapRouterAddress" 
        :tokens="tokens" 
        title="Swap tokens" />

      <!-- Playlist -->
      <div class="card m-2 bg-light" v-if="$config.showFeatures.spotify">
        <div class="card-header bg-light">{{ $config.projectName }} Playlist</div>
        <div class="card-body sidebar-card-body">
          <iframe style="border-radius:12px" :src="'https://open.spotify.com/embed/playlist/'+$config.spotifyPlaylistId+'?utm_source=generator&theme=0'" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
        </div>
      </div>

      <!-- Keys list 
      <KeysListWidget v-if="$config.keysAddress && $config.showFeatures.friendKeys" />
      -->

      <!-- Random minted post(s) -->
      <MintedPostsWidget v-if="$config.showFeatures.randomMintedPosts" @closeRightSidebar="closeRightSidebar" />

      <!-- Newsletter -->
      <div v-if="$config.newsletterLink && $config.showFeatures.newsletter" class="card m-2 bg-light">
        <div class="card-header bg-light">{{ $config.projectName }} Newsletter</div>
        <div class="card-body sidebar-card-body">
          <a class="btn btn-outline-primary mt-2 mb-2" target="_blank" :href="$config.newsletterLink">
            Join our newsletter!
            <i class="bi bi-box-arrow-up-right ms-1"></i>
          </a>
        </div>
      </div>
      
    </div>
  </div>
</div>
</template>

<script>
import tokens from '~/assets/data/tokens.json';
import { useSidebarStore } from '~/store/sidebars';
import { useSiteStore } from '~/store/site';
import MintedPostsWidget from '~/components/minted-posts/MintedPostsWidget.vue';
import NameMintWidget from '~/components/names/NameMintWidget.vue';
import SimpleSwapWidget from '~/components/swap/SimpleSwapWidget.vue';
import KeysListWidget from '~/components/keys/KeysListWidget.vue';
import ReferralWidget from '~/components/referrals/ReferralWidget.vue';

export default {
    name: "SidebarRight",
    props: ["rSidebar", "isMobile"],

    components: { 
      KeysListWidget,
      MintedPostsWidget,
      NameMintWidget,
      ReferralWidget,
      SimpleSwapWidget
    },

    methods: {
      changeColorMode(newMode) {
        this.siteStore.setColorMode(newMode);
        document.documentElement.setAttribute("data-bs-theme", this.siteStore.getColorMode);
      },
      
      closeRightSidebar() {
        if (this.isMobile) {
          //this.rSidebar.hide();
          this.sidebarStore.setRightSidebar(false);
          this.sidebarStore.setMainContent(true);
        }
      }
    },

    setup() {
        const sidebarStore = useSidebarStore();
        const siteStore = useSiteStore();

        return { sidebarStore, siteStore, tokens };
    }
}
</script>