<template>
    <div class="flex flex-col font-Montserrat">
        <!-- Banner -->
        <div 
            v-if="route.query.preview" 
            class="bg-gray-200 text-gray-500 p-3 w-full text-center">
            <p>You are currently previewing this city, click the "+"
                icon to start tracking this city.
            </p>
        </div>
        <!-- Weather Overview -->
        <div class="container flex flex-col text-white py-12">
            <div class="flex flex-row rounded-lg items-center gap-20">
                <div class="flex flex-col">
                    <h1 class="text-4xl mb-2">{{ route.params.city }}</h1>
                    <p class="text">
                        {{ 
                            new Date(weatherData.localTime).toLocaleDateString(
                                "en-us",
                                {
                                    weekday:"short",
                                    day:"2-digit",
                                    month: "long",
                                    hour:"numeric",
                                    minute:"numeric"
                                }
                            )
                        }}
                    </p>
                </div>
                
            </div> 
            <div class="mt-5 flex flex-row items-center justify-between">
                <div class="flex flex-col mb-8">
                    <p class="text-8xl">
                        {{ Math.round(weatherData.main.temp) }}&deg;
                    </p>
                    <p>
                        Feels Like
                        {{ Math.round(weatherData.main.feels_like) }}&deg;
                    </p>
                </div>
                <div class="flex flex-row gap-1 text-xl">
                    <p>
                        <i class="fa-solid fa-chevron-up text-green-700"></i>
                        {{ Math.round(weatherData.main.temp_max) }}&deg; |
                    </p>
                    <p>
                        <i class="fa-solid fa-chevron-down text-red-700"></i>
                        {{ Math.round(weatherData.main.temp_min) }}&deg;
                    </p>
                </div>
                <img class="w-[150px] h-auto"
                    :src="`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`"
                    alt="Weather Icon"
                />
            </div>
            
            <p class="text-sm mb-12">
                Last updated to
                {{ 
                    new Date(weatherData.DataCalculationTime).toLocaleTimeString(
                        "en-us",
                        {
                            hour: "numeric",
                            minute: "numeric",
                        }
                    ) }}
            </p>
        </div>
        <hr class="border-black border-opacity-10 border w-full" />

        <!-- Hourly Weather -->
        <div class="text-white max-w-screen-md w-full py-12">
            <div class="mx-8">
                <h2 class="mb-4">Hourly Weather</h2>
                <div class="flex gap-10 overflow-x-scroll">
                    <lineChart/>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import { useRoute } from 'vue-router';
import lineChart from './lineChart.vue';

// Fonction pour calculer l'heure locale à partir du timestamp et de l'offset
const calculateLocalTime = (timestamp, userOffset, cityOffset) => {
    const utc = timestamp - Math.abs(userOffset) * 60000;
    const localTime = utc + cityOffset * 1000
    return new Date(localTime);
};

// Fonction pour obtenir l'offset de l'utilisateur
const getUserOffset = () => {
    return new Date().getTimezoneOffset();
};

const route = useRoute();
const getWeatherData = async () => {
    try {
        const weatherData = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${route.query.lat}&lon=${route.query.lng}&appid=e770cd0f1c8fc4dfa15774be59321487&units=metric`
        );

        const userOffset = getUserOffset();
        const cityOffset = weatherData.data.timezone;
        const currentTimeUTC = Date.now();
        
        //Appel de la fonction pour calculer l'heure locale
        const localTime = calculateLocalTime(
            currentTimeUTC,
            userOffset,
            cityOffset
        );
        //Appel de la fonction pour calculer l'heure d'actualisation des données météo locale
        const DataCalculationTime = calculateLocalTime(
            weatherData.data.dt * 1000,
            userOffset,
            cityOffset
        );

        return {
            ...weatherData.data,
            localTime: localTime,
            DataCalculationTime : DataCalculationTime
        };

    } catch (err) {
        console.log(err);
    }
};

const getWeatherForecast = async () => {
    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${route.query.lat}&lon=${route.query.lng}&appid=e770cd0f1c8fc4dfa15774be59321487&units=metric`
        )
        return response.data;

    }catch(err) {
        console.log(err);
        throw err; 
    }
}
const weatherData = await getWeatherData();
console.log('weatherData = ', weatherData);
const weatherForcast = getWeatherForecast();
console.log('weatherForcast : ', weatherForcast);
</script>
