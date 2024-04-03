<template>
    <header class="sticky top-0
    bg-weather-primary"
    >
        <nav class="container flex 
            flex-row items-center gap-4 text-black py-6"
        >
            <RouterLink :to="{name: 'home'}">
                <div class="flex items-center gap-3 ">
                    <i class="fa-solid fa-cloud-sun text-3xl text-yellow-500"></i>
                    <p class="text-bold text-2xl font-bold font-Unica">Apollo</p>
                </div>
            </RouterLink>
            
            <div class="flex gap-3 flex-1 justify-end text-blue-400">
                <i @click="toggleModal"
                    class="fa-solid fa-circle-info text-xl 
                    hover:text-weather-secondary duration-150 
                    cursor-pointer" 
                ></i>
                <i 
                    class="fa-solid fa-plus text-xl 
                    hover:text-weather-secondary duration-150 
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
