<template>
    <div class="flex flex-col font-Montserrat">
        <!-- Banner -->
        <div v-if="route.query.preview" 
            class="bg-gray-300 text-gray-500 p-3 w-full text-center">
            <p>You are currently previewing this city, click the "+"
                icon to start tracking this city.
            </p>
        </div>
        <!-- Weather Overview -->
        <div class="container flex flex-col text-white pt-12">
            <div class="flex flex-row rounded-lg items-center gap-20">
                <div class="flex flex-col w-full">
                    <h1 class="text-4xl mb-2">{{ route.params.city }}</h1>
                    <div class="justify-between flex">
                        <p>
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
                        <p>
                            {{
                                new Date(weatherData.localTime).toLocaleTimeString(
                                    "en-us",
                                    {
                                        hour:"numeric",
                                        minute:"numeric",
                                    }
                                )
                            }}
                        </p>
                    </div>
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
        </div>

        <!-- Hourly Weather -->
        <div class="container mt-6 text-white w-full pb-14">
            <div>
                <h2 class="mb-4 flex flex-col items-center">Hourly Weather</h2>
                <div class="flex h-54 w-full rounded-3xl overflow-x-scroll p-10 border-sky-200">
                    <LineChart :chartData="chartData" class="w-screen"/>
                </div>
            </div>
        </div>

        <!-- Others -->
        <div class="container mt-10 text-white">
            <div class="flex justify-around">
                <div>
                    <p>sunrise</p>
                    <p>
                        {{ 
                            new Date(weatherData.sunriseTime).toLocaleTimeString(
                            "en-us",
                                {
                                    hour: "numeric",
                                    minute: "numeric",
                                }
                            )    
                        }}
                    </p>
                </div>
                <div>
                    <p>sunset</p>
                    <p>
                        {{ 
                    new Date(weatherData.sunsetTime).toLocaleTimeString(
                        "en-us",
                        {
                            hour: "numeric",
                            minute: "numeric",
                        }
                    ) 
                }}
                    </p>
                </div>
            </div>
            <div class="flex justify-around">
                <div>hum</div>
                <div>press</div>
                <div>wind</div>
            </div>
            <div class="mt-10 flex justify-center">PieChart</div>
            <p class="text-sm mt-12 flex justify-center">
                Last updated to
                {{ 
                    new Date(weatherData.DataCalculationTime).toLocaleTimeString(
                        "en-us",
                        {
                            hour: "numeric",
                            minute: "numeric",
                        }
                    ) 
                }}
            </p>
        </div>
    </div>
</template>



<script setup>
import axios from 'axios';
import { useRoute } from 'vue-router';
import LineChart from './lineChart.vue';


// Simulate chart data
const generateChartData = () => {
  const labels = [];
  const data = [];

  for (let i = 0; i < 24; i++) {
    const hour = i < 10 ? `0${i}:00` : `${i}:00`; // Format hours (0-23)
    const temperature = Math.floor(Math.random() * 20) + 10; // Simulate temperature (10-30°C)
    labels.push(hour);
    data.push(temperature);
  }

  return {
    labels: labels,
    datasets: [{
      label: 'Temperature (°C)',
      data: data,
      fill: false,
      borderColor: '#ffffff',
      tension: 0.1
    }]
  };
};

const chartData = generateChartData();

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
        //Definition de la fonction pour calculer l'heure d'actualisation des données météo locale
        const DataCalculationTime = calculateLocalTime(
            weatherData.data.dt * 1000,
            userOffset,
            cityOffset
        );

        //heure de sunrise et de sunset
        const sunriseTime = calculateLocalTime(
            weatherData.sys.sunrise * 1000,
            userOffset,
            cityOffset
        )
        const sunsetTime = calculateLocalTime(
            weatherData.sys.sunset * 1000,
            userOffset,
            cityOffset
        )

        return {
            ...weatherData.data,
            localTime: localTime,
            DataCalculationTime : DataCalculationTime,
            sunriseTime: sunriseTime,
            sunsetTime: sunsetTime
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
};

const weatherData = await getWeatherData();
console.log('weatherData = ', weatherData);
const weatherForcast = getWeatherForecast();
console.log('weatherForcast : ', weatherForcast);
</script>
