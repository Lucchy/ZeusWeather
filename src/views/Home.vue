<template>
    <main class="container text-black font-Montserrat">
        <div class="flex flex-col mt-10 mb-10">
            <p class="text-5xl font-extralight text-weather-secondary mb-5">Hello,</p>
            <h2 class="text-4xl mb-3">Welcome on<span class="font-bold"> Apollo !</span></h2>
            <p class="text-2xl mb-3 text-gray-700">Live weather updates, worldwide at a glance.</p>
            <div class="flex flex-row justify-around mt-10 text-3xl">
                <i class="fa-solid fa-sun text-orange-300"></i>
                <i class="fa-solid fa-cloud-showers-heavy text-sky-300"></i>
                <i class="fa-solid fa-cloud-moon text-weather-secondary"></i>
                <i class="fa-solid fa-umbrella text-purple-300"></i>
                <i class="fa-solid fa-cloud-bolt text-gray-400"></i>
            </div>
        </div>
        <div class="text-xl pt-8 mb-8 relative">
            <p></p>
            <input v-model="searchQuery" @input="getSearchResults"
                type="text" 
                placeholder="Search for a city or state"
                class="py-2 px-1 w-full bg-transparent border-blue-200 border-b-2
                focus:border-blue-400 focus:outline-none"
            >
            <ul v-if="mapboxSearchResults && mapboxSearchResults.length > 0"
                class="absolute bg-gray-200 text-black w-full
                shadow-md py-2 px-1 top-[86px]"
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
                    <li @click="previewCity(searchResult)"
                    v-for="searchResult in mapboxSearchResults"
                    :key=searchResult.id
                    class="py-2 cursor-pointer flex justify-between"
                    >
                        {{ searchResult.place_name }}
                        <i class="fa-solid fa-arrow-right-to-bracket text-gray-400 mr-2"></i>
                    </li>
                </template>
            </ul>
        </div>
    </main>
</template>

<script setup>
import { ref } from "vue";
import axios from 'axios'
import { useRouter } from "vue-router";

const router = useRouter();

const previewCity = (searchResult) => {
    console.log(searchResult);
    const placeParts = searchResult.place_name.split(",");
    const city = placeParts[0].trim();
    let state = '';

    for (let i = placeParts.length - 1; i >= 0; i--) {
        const part = placeParts[i].trim();
        if (part !== city) {
            state = part;
            break;
        }
    }

    router.push({
        name: "cityView",
        params: { city: city, state: state.replaceAll(" ", "")},
        query: {
            lat: searchResult.geometry.coordinates[1],
            lng: searchResult.geometry.coordinates[0],
            preview:true,
        },
    })
};

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

