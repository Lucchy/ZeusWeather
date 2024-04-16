<template>
    <header class="shadow">
        <nav class="container flex 
            flex-row items-center text-black py-6"
        >
            <RouterLink :to="{name: 'home'}">
                <div class="flex items-center gap-3 ">
                    <i class="fa-solid fa-sun text-3xl text-yellow-400"></i>
                    <p class="text-bold text-2xl font-bold font-Montserrat">Apollo</p>
                </div>
            </RouterLink>
            
            <div class="flex gap-7 flex-1 justify-end text-sky-400">
                <i @click="toggleModal"
                    class="fa-solid fa-circle-info text-xl 
                    hover:text-yellow-400 duration-150 
                    cursor-pointer" 
                ></i>
                <i @click="addCity" v-if="route.query.preview"
                    class="fa-solid fa-plus text-xl 
                    hover:text-yellow-400 duration-150 
                    cursor-pointer"
                ></i>
            </div>

            <BaseModale :modalActive="modalActive" @close-modale="toggleModal">
                <h1 class="font-Montserrat flex justify-center my-3 font-bold text-blue-400">Hi :D</h1>
                <div class="font-Montserrat">
                    <p>1. Search for a city in the search bar below.</p>
                    <p>2. Choose the city you are looking for.</p>
                    <p>3. Preview the weather there.</p>
                    <p>4. You can track the city if you want.</p>
                    <br>
                    <p class="font-semibold flex justify-center text-black">Try it Now !</p>
                </div>
                
            </BaseModale>
        </nav>
    </header>
    
</template>

<script setup>
import { ref } from "vue";
import { uid } from "uid";
import { RouterLink, useRoute, useRouter } from "vue-router";
import BaseModale from "./BaseModale.vue";

const savedCities = ref([]);
const route = useRoute();
const router = useRouter();


const addCity = ()=> {
    if (localStorage.getItem("savedCities")) {
        savedCities.value = JSON.parse(
            localStorage.getItem('savedCities')
        );
    }

    const locationObj = {
        id: uid(),
        state: route.params.state,
        city: route.params.city,
        coords: {
            lat: route.query.lat,
            lng: route.query.lng,
        },
    };

savedCities.value.push(locationObj);
localStorage.setItem('savedCities', JSON.stringify(savedCities.value));

let query = Object.assign({}, route.query);
delete query.preview;
router.replace({ query });

};

   const modalActive = ref(null);
   const toggleModal = () => {
        modalActive.value = !modalActive.value;
   }

</script>
