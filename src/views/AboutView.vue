<template>
  <div class="about">
    <h1>This is an about page</h1>
    <p>COUNT: {{count}}</p>
    <button @click="addCount">增加</button>

    <hr />
    <about1 />

    <p>
      {{count22}}
    </p>
  </div>
</template>

<script setup>
import {computed} from 'vue';

import about1 from './about1.vue';
import { storeToRefs } from 'pinia';

import { useCounterStore } from '@/stores1/counter'
// 可以在组件中的任意位置访问 `store` 变量 ✨
const counterStore = useCounterStore();

const {count, doubleCount} =  storeToRefs(counterStore);
const addCount = ()=>{
  counterStore.increment();
}

import {useStore} from 'vuex';
const store = useStore();
const count22 = computed(()=>{
  return store.state.count;
})
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
