<template>
    <main class="container text-black">
        <div class="pt-4 mb-8 relative">
            <input v-model="searchQuery" @input="getSearchResults"
                type="text" 
                placeholder="Search for a city or state"
                class="py-2 px-1 w-full bg-transparent border-b
                focus:border-blue-400 focus:outline-none"
            >
            <ul v-if="mapboxSearchResults && mapboxSearchResults.length > 0"
                class="absolute bg-gray-200 text-black w-full
                shadow-md py-2 px-1 top-[66px]"
            >
                <p v-if="searchError">
                    Sorry, something went wrong, please try again.
                </p> 
                <p v-if="!serverError && mapboxSearchResults.length === 0"
                >
                    No results match your query, try a different term.
                </p>

                <!-- On ne peut pas mettre vif et velse en même temps donc -->
                <template v-else>
                    <li
                    v-for="searchResult in mapboxSearchResults"
                    :key=searchResult.id class="py-2 cursor-pointer"
                    >
                        {{ searchResult.place_name }}
                    </li>
                </template>
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
const searchError = ref(null);
const serverError = ref(null);

const getSearchResults = () => {
    clearTimeout(queryTimeout.value);
    queryTimeout.value = setTimeout(async() => {
        if (searchQuery.value !== "") {
            try {
                const result = await axios.get(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/
                ${searchQuery.value}.json?access_token=${mapboxAPIKey}&types=place`
                );
                mapboxSearchResults.value = result.data.features;
            } catch {
                searchError.value = true;
            }
            
            return;
        }
        mapboxSearchResults.value = true;
    },300);
};
</script>

<style lang="scss" scoped>
</style>