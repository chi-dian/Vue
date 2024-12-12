<template>
  <div id="app">
    <HeaderIndex />
    <div class="content bg-white">
      <router-view></router-view>
    </div>
    <FooterIndex/>
  </div>
</template>

<script >
import FooterIndex from './components/FooterIndex.vue';
import HeaderIndex from './components/HeaderIndex.vue';

  export default {
  name: 'App',
  components: {
    HeaderIndex,
    FooterIndex
  }
}
</script>

<style scoped>

</style>
