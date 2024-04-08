<template>
    <header class="sticky top-0"
    >
        <nav class="container flex 
            flex-row items-center text-black py-6"
        >
            <RouterLink :to="{name: 'home'}">
                <div class="flex items-center gap-3 ">
                    <i class="fa-solid fa-sun text-3xl text-yellow-400"></i>
                    <p class="text-bold text-2xl font-bold font-Unica">Apollo</p>
                </div>
            </RouterLink>
            
            <div class="flex gap-7 flex-1 justify-end text-weather-secondary">
                <i @click="toggleModal"
                    class="fa-solid fa-circle-info text-xl 
                    hover:text-yellow-400 duration-150 
                    cursor-pointer" 
                ></i>
                <i 
                    class="fa-solid fa-plus text-xl 
                    hover:text-yellow-400 duration-150 
                    cursor-pointer"
                ></i>
            </div>

            <BaseModale :modalActive="modalActive" @close-modale="toggleModal">
                <h1 class="text-black">Je m'affiche lorsque l'on clique sur le btn i </h1>
            </BaseModale>
        </nav>
    </header>
    
</template>

<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";
import BaseModale from "./BaseModale.vue";

   const modalActive = ref(null);
   const toggleModal = () => {
        modalActive.value = !modalActive.value;
   }

</script>
