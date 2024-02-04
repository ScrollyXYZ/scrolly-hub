import { ethers } from 'ethers';
import { getRpcs, getRpcs2 } from "~/utils/rpcUtils";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig() // access env vars like this: config.alchemyPolygonKey

  function getChainName(chainId) {
    if (chainId === 1) {
      return "Ethereum";
    } else if (chainId === 534352) {
      return "Scroll";
    } else {
      return "Unsupported Network";
    }
  }

  function getFallbackProvider(networkId) {
    let mainRpc = config.rpcCustom;

    if (!mainRpc) {
      mainRpc = getRpcs()[networkId];
    }

    let urls = [
      // getRpcs2()[networkId],
      mainRpc
    ];

    if (urls) {
      const providers = urls.map(url => new ethers.providers.JsonRpcProvider(url));
      return new ethers.providers.FallbackProvider(providers, 1); // return fallback provider
    } else {
      return null;
    }
  }

  function switchChain(networkName) {
    let method;
    let networkId;
    let params;

    if (networkName == "Ethereum") {
      method = "wallet_switchEthereumChain"
      params = [{ chainId: "0x1" }] 
    } else if (networkName == "Scroll") {
      networkId = 534352;
      method = "wallet_addEthereumChain"
      params = [{ 
        blockExplorerUrls: [ "https://scrollscan.com" ],
        chainId: ethers.utils.hexValue(networkId),
        chainName: networkName,
        nativeCurrency: { decimals: 18, name: "ETH", symbol: "ETH" }, 
        rpcUrls: [getRpcs2()[networkId]]
      }] 
    }

    return { 
      method: method, 
      params: params
    }
  }

  return {
    provide: {
      getChainName: (chainId) => getChainName(chainId),
      getFallbackProvider: (chainId) => getFallbackProvider(chainId),
      switchChain: (chainName) => switchChain(chainName)
    }
  }
});

