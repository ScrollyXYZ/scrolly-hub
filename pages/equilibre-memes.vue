<template>
  <Head>
    <Title>Equilibre Meme Contest | {{ $config.projectMetadataTitle }}</Title>
    <Meta property="og:title" :content="'Equilibre Meme Contest | ' + $config.projectMetadataTitle" />
  </Head>

  <ChatFeed 
    class="mt-1" 
    :showQuotedPost="$config.showRepliesOnHomepage" 
    :orbisContext="$config.chatChannels.equilibreMemes" 
  />
</template>

<script>
import ChatFeed from "../components/chat/ChatFeed.vue"

export default {
  name: "EquilibreMemes",

  components: {
    ChatFeed
  }
}
</script>