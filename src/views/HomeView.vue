<script setup>
import { ref } from 'vue';
import TheWelcome from '../components/TheWelcome.vue'

import { useStore } from 'vuex';
const store = useStore();

const list = ref([]);
function getUserInfo(){
  store.dispatch('request', {
    name: 'getList'
  }).then(res=>{
    list.value = res.data;
  }).catch(err=>{
  })
}

getUserInfo();
</script>

<template>
  <main>
    <TheWelcome />
  </main>

  <p v-for="i in list" class="link-p">
    <el-link :href="i.url" target="_blank" >{{i.name}}</el-link>
  </p>
</template>


<style lang="scss" scoped>
.link-p{
  border: 1px solid #eeeeee;
}
</style>