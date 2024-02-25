import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';

// https://nuxt.com/docs/api/configuration/nuxt-config 
export default defineNuxtConfig({
  app: {
    head: {
      meta: [
        {
          "name": "viewport",
          "content": "width=device-width, initial-scale=1"
        },
        {
          "charset": "utf-8"
        }
      ],
      link: [
        { // Bootstrap
          rel: "stylesheet",
          href: "	https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        },
        { // Bootstrap icons
          rel: "stylesheet",
          href: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
        },
        { // Custom
          rel: "stylesheet",
          href: "/css/custom.css"
        }
      ],
      script: [
        {
          src: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
        }
      ]
    }
  },
  components: false,
  css: [
    'vue-toastification/dist/index.css' 
  ],
  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
  ],
  router: {
    options: {
      hashMode: false
    }
  },
  runtimeConfig: {
    public: {
      activityPointsAddress: "",
      airdropApAddress: "", // chat token claim for APs
      airdropClaimDomainsAddress: "", // chat token claim for domain holders
      blockExplorerBaseUrl: "https://scrollscan.com",
      chatChannels: { // go to Orbis Dashboard (https://useorbis.com/dashboard), create a new Project and then create a new Context for each of the channels below
        "general": "kjzl6cwe1jw145d2rd0l68smmvsazouh91qd48m5qnqc3dsl6bfm9om6tti1sfx", // general discussion channel
        "memesImages": "kjzl6cwe1jw14b1qxrqcpxujs6g7knnmsru7pm46u43586khtqqje3tcay5bnca",
        "shill": "kjzl6cwe1jw14bm3okedjn07hw68f4j1lyy51rb5c3xdrjlg5z12z65urg09b8o",
        "nftLaunchpad": "kjzl6cwe1jw14a0plh1orm8vtnu8h8rpak2vluqi0thxnhkaeyxndlm3cegyps8",
        "friendKeys": "kjzl6cwe1jw149hodz72tacxkoytqe9m306smj8ia3pqtydx90rfny6hcnru8tv",
        "memesContest": "kjzl6cwe1jw149aqdicd44b8xiupfgijcj1hjzksmzkb6huk033j2gxslioxuhs"
      },
      chatTokenAddress: "0xb65aD8d81d1E4Cb2975352338805AF6e39BA8Be8", // chat token address
      chatTokenImage: "https://sns.scrolly.xyz/assets/logo.67955946.png", // chat token image
      chatTokenSymbol: "SCROLLY", // chat token symbol or name
      domainRequiredToPost: true,
      expiryCollections: 1000 * 60 * 60 * 24 * 7, // must be in milliseconds (0 means no expiration)
      expiryUsernames: 1000 * 60 * 60 * 24 * 7, // must be in milliseconds (0 means no expiration)
      favicon: "/img/favicon.png",
      fileUploadEnabled: true, // enable/disable file uploads (enable only if external file storage is used, e.g. IPFS via Spheron)
      fileUploadSizeLimit: 1 * 1024 * 1024, // max file upload size in bytes (1 * 1024 * 1024 = 1 MB)
      fileUploadTokenService: process.env.FILE_UPLOAD_SERVICE || "vercel", // "netlify" or "vercel" (or leave empty for no file uploads)
      getPostsLimit: 30, // number of posts to fetch from Orbis in the getPosts() function
      governanceUrl: "", // governance url (snapshot, Tally, etc.)
      iggyPostAddress: "0xa9cfa4e8EA79537F5893f45c3B1491A2f7B54e7E",
      iggyPostMinterAddress: "0xeb485A72393728990264EeE32e8098E6Da94cE01",
      iggyPostStatsAddress: "0xde16C1c780f32cF8dB6F6F41a58B2D4e91B86fd3",
      imagekitEndpoint: process.env.IMAGEKIT_ENDPOINT,
      imagekitPublicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      ipfsGateway: "https://cloudflare-ipfs.com/ipfs/",
      keysAddress: "0x8FF82d2b0ab704Ba2AB5a567f32F1447A6158260", // FriendKeys contract address 
      keysFeatured: ["scrolly", "tempe", "tekr"],
      linkPreviews: process.env.LINK_PREVIEW_SERVICE || "vercel", // "netlify", "vercel", or "microlink" (or leave empty for no link previews)
      lpTokenAddress: "", // liquidity pool token (token to stake in the staking contract)
      lpTokenSymbol: "LP tokens", // LP token symbol
      marketplacePostNftUrl: "https://element.market/assets/scroll/0xa9cfa4e8EA79537F5893f45c3B1491A2f7B54e7E",
      marketplacePostNftItemUrl: "https://element.market/assets/scroll/0xa9cfa4e8EA79537F5893f45c3B1491A2f7B54e7E/", // url (append nft id to it)
      marketplaceNftCollectionBaseUrl: "https://element.market/assets/scroll/", // url (append nft address to it)
      newsletterLink: "",
      nftDefaultRatio: 1, // default ratio for the NFT price bonding curve
      nftLaunchpadBondingAddress: "0x072F6683DA7F71b9E52bAC7867488F18058Cb410", // NFT launchpad with bonding curve contract address
      nftLaunchpadLatestItems: 8, // number of latest NFTs to show in the NFT launchpad
      orbisTest: false, // if true, test context will be used instead of the production one
      orbisTestContext: "kjzl6cwe1jw145tfqv2eqv8tiz6puo27meyz4smz40atppuc13tulqca87k35z2", // test context
      previewImage: "/img/covers/cover.png",
      previewImageAirdrop: "/img/covers/cover-airdrop.png",
      previewImageNftCollection: "/img/covers/cover-nft-collection.png",
      previewImageNftCreate: "/img/covers/cover-nft-create.png",
      previewImageNftLaunchpad: "/img/covers/cover-nft-launchpad.png",
      previewImagePost: "/img/covers/cover-post.png",
      previewImagePostNft: "/img/covers/cover-post-nft.png",
      previewImageProfile: "/img/covers/cover-profile.png",
      previewImageStake: "/img/covers/cover-stake.png",
      profileMintedPostIdsMax: 36, // max number of minted post ids to show in the profile page
      projectMetadataTitle: "Scrolly Hub | A Web3 Happy Place For The Scrolly Community",
      projectName: "Scrolly Hub",
      projectDescription: "Scrolly Hub is a web3 place for all-things around the Scrolly web3 community.",
      projectTwitter: "https://twitter.com/scrollyxyz",
      projectUrl: "https://hub.scrolly.xyz", // without trailing slash!
      punkMinterAddress: "0xE806C55bd917Ccf93d66CE814e242878fc230CA2", // punk domain minter contract address
      punkNumberOfPrices: 6, // number of different prices (based on domain length), usually 1 (price()) or 5 (price1char() - price5char())
      punkTldAddress: "0xc2C543D39426bfd1dB66bBde2Dd9E4a5c7212876", // punk domain TLD address
      randomPostsNumber: 1, // number of random post NFTs to show in the sidebar widget
      rpcCustom: process.env.RPC_CUSTOM || "https://rpc.scroll.io", // Custom RPC URL
      showFeatures: { // show/hide features in sidebars (if you have too many "true", make the sidebar scrollable --> sidebarLeftSticky: false)
        "activityPoints": false, 
        "airdrop": false, 
        "friendKeys": false, 
        "governance": false,
        "newsletter": false, 
        "nftLaunchpad": true, 
        "randomMintedPosts": true, 
        "swap": false, 
        "stake": false, 
        "sendTokens": false, 
        "spotify": false
      }, 
      showRepliesOnHomepage: true, // show replies on the homepage  
      sidebarLeftSticky: true, // make the left sidebar sticky (always visible)
      spotifyPlaylistId: "5y7f2Wxfq49G5KuNQfMPbk", // enter just the ID of the playlist (not the full URL)  
      stakingContractAddress: "", // this is also the stake/gov token address
      stakeTokenSymbol: "SST", // stake token symbol (governance token symbol)
      supportedChainId: 534352,
      swapPriceImpactMaxBps: 1000, // max price impact in bips (1 bps = 0.01%, 1000bps = 10%) for the swap function
      swapRouterAddress: "", // iggy swap router contract address
      tenorApiKey: process.env.TENOR_KEY || "",
      tldName: ".scrolly",
      tokenAddress: null, // leave null if it's a native token of the chain
      tokenDecimals: 18,
      tokenSymbol: "ETH"
    }
  },
  vite: {
    build: {
      target: ['es2020'] // fix big integer literals error
    },
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: 'globalThis'  // fix nuxt3 global
        },
        plugins: [
          NodeGlobalsPolyfillPlugin({
            process: true,  // fix nuxt3 process
            buffer: true
          }),
          NodeModulesPolyfillPlugin()
        ],
        target: "es2020" // fix big integer literals error
      }
    }
  }
})
