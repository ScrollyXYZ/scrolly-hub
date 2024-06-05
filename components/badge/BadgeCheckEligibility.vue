<template>
  
</template>

<script>
export default {
 name: 'BadgeCheckEligibility',
 emits: ['checkEligibility'],

 mounted() {
   this.$emit('checkEligibility');
 },
}
</script>
