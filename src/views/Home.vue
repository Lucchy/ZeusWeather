<template>
    <main class="container text-black">
        <div class="pt-4 mb-8 relative">
            <input v-model="searchQuery" @input="getSearchResults"
                type="text" 
                placeholder="Search for a city or state"
                class="py-2 px-1 w-full bg-transparent border-b
                focus:border-blue-400 focus:outline-none"
            >
            <ul v-if="mapboxSearchResults"
                class="absolute bg-gray-200 text-black w-full
                shadow-md py-2 px-1 top-[66px]"
            >
                <li 
                v-for="searchResult in mapboxSearchResults"
                :key=searchResult.id class="py-2 cursor-pointer"
                >
                    {{ searchResult.place_name }}
                </li>
            </ul>
        </div>
        
    </main>
</template>

<script setup>
import { ref } from "vue";
import axios from 'axios'

const mapboxAPIKey = "pk.eyJ1IjoibHVjY2h5MDQiLCJhIjoiY2x1ZGoxZ3M3MG1iaDJrcGt4ODZ0aHRldiJ9.f33eCkxzNZIou-Ts-iQrkQ";
const searchQuery = ref("");
const queryTimeout = ref(null);
const mapboxSearchResults = ref(null);

const getSearchResults = () => {
    clearTimeout(queryTimeout.value);
    queryTimeout.value = setTimeout(async() => {
        if (searchQuery.value !== "") {
            const result = await axios.get(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/
                ${searchQuery.value}.json?access_token=${mapboxAPIKey}&types=place`
            );
            mapboxSearchResults.value = result.data.features;
            console.log(mapboxSearchResults);
            return;
        }
        mapboxSearchResults.value = null;
    },300);
};
</script>

<style lang="scss" scoped>
</style>