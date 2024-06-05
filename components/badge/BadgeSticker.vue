<template>
  <div class="badge-sticker-container">
    <NuxtLink to="/badge">
      <img :src="$config.badge.defaultBadgeImage" alt="Badge Sticker" class="img-fluid" />
    </NuxtLink>
  </div>
</template>

<script>
export default {
  name: "BadgeSticker"
}
</script>

<style>
.badge-sticker-container {
  padding: 10px;
  height: 200px;
  width: 200px;
}

/* Mobile only */
@media only screen and (max-width: 767px) {
  
  .badge-sticker-container {
    padding: 5px;
    height: 100px;
    width: 100px;
  }

}
</style>