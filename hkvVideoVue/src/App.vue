<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>


<style lang="scss">
  *{
    margin: 0;
    padding: 0;
  }
  #app{
    height:100vh;
    overflow:hidden
  }
</style>
