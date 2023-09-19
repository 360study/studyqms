<template>
  <div id="app">
    asdfasdfsdf
 45454545
 <i class="fa fa-camera-retro"></i>

    <router-view />
  </div>
</template>

<script>
  export default {
    name: 'App',
    provide() {
      return {
        reload: this.reload,
      }
    },
    data() {
      return {
        isRouterAlive: true,
      }
    },
    mounted() {},
    methods: {
      reload() {
        this.isRouterAlive = false
        this.$nextTick(function () {
          this.isRouterAlive = true
        })
      },
    },
  }
</script>
