<template>
    <div class="flex flex-col flex-1 items-center">
        <!-- Banner -->
        <div 
            v-if="route.query.preview" 
            class="text-white p-4 bg-blue-400 w-full text-center">
            <p>You are currently previewing this city, click the "+"
                icon to start tracking this city.
            </p>
        </div>
        <!-- Weather Overview -->
        <div class="flex flex-col items-center text-black py-12 font-Unica">
            <h1 class="text-4xl mb-2">{{ route.params.city }}</h1>
            <p class="text-sm mb-12">
                {{ 
                    new Date(weatherData.localTime).toLocaleDateString(
                        "en-us",
                        {
                            weekday:"short",
                            day:"2-digit",
                            month: "long",
                        }
                    )
                }}
            </p>
            <p class="text-xl mb-12">
                {{ 
                    new Date(weatherData.localTime).toLocaleTimeString(
                        "en-us",
                        {
                            hour: "numeric",
                            minute:"numeric",
                        }
                    )
                }}
            </p>
            <p class="text-8xl mb-8">
                {{ Math.round(weatherData.main.temp) }}&deg;
            </p>
            <p>
                Feels Like 
                {{ Math.round(weatherData.main.feels_like) }}&deg;
            </p>
            <p class="capitalize">
                {{ weatherData.weather[0].description }};
            </p>
            <img class="w-[150px] h-auto"
            :src="`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`"
            alt="Weather Icon"
            />
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
        <div class="max-w-screen-md w-full py-12"></div>
            <div class="mx-8 text-black">
                <h2 class="mb-4">Hourly Weather</h2>
                <div class="flex gap-10 overflow-x-scroll">

                </div>
            </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import { useRoute } from 'vue-router';

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
