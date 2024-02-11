<template>
  <Head>
    <Title>Memes Contest | {{ $config.projectMetadataTitle }}</Title>
    <Meta property="og:title" :content="'Memes Contest | ' + $config.projectMetadataTitle" />
  </Head>

  <ChatFeed 
    class="mt-1" 
    :showQuotedPost="$config.showRepliesOnHomepage" 
    :orbisContext="$config.chatChannels.memesContest" 
  />
</template>

<script>
import ChatFeed from "../components/chat/ChatFeed.vue"

export default {
  name: "MemesContest",

  components: {
    ChatFeed
  }
}
</script>