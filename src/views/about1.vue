<template>
    <p>{{count}}</p>
    <p>bjsdbjbasj</p>

    <hr/>

    <button @click="addCount">增加</button>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import {useStore} from 'vuex';
const store = useStore();

import { useCounterStore } from '@/stores1/counter'
// 可以在组件中的任意位置访问 `store` 变量 ✨
const counterStore = useCounterStore();

const {count, doubleCount} =  storeToRefs(counterStore);

function addCount(){
store.dispatch('addCounter');
}
</script>

<style lang="scss" scoped>
p{
    color: red;
}
</style>