<template>
  <div id="app">
    <landing-page ref="electron"></landing-page>

  </div>
</template>

<script>
  import LandingPage from '@/components/LandingPage'

  export default {
    name: 'my-project',
    components: {
      LandingPage
    },
    mounted() {

    }
  }
</script>

<style>
  /* CSS */
</style>
