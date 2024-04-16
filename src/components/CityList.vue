<template>
    <div v-for="city in savedCities" :key="city.id">
        <CityCard :city = "city"/>
    </div>
</template>

<script setup>
import CityCard from './CityCard.vue';
import { ref } from 'vue';
import axios from "axios";

const savedCities = ref([]);
const getCities = async () => {
    if (localStorage.getItem('savedCities')) {
        savedCities.value = JSON.parse(
            localStorage.getItem('savedCities')
    );

        const requests = [];
        savedCities.value.forEarch((city) => {
            requests.push(
                axios.get(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${city.coords.lat}&lon=${city.coords.lng}&appid=e770cd0f1c8fc4dfa15774be59321487&units=metric`
                )
            );
        });

        const weatherData = await Promise.all(requests);

        weatherData.forEach((value ,index) => {
            savedCities.value[index].weather = value.data;
        });
    }
};
await getCities();
</script>
