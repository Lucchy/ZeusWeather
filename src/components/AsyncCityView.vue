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
                <div class="flex justify-between items-center w-full">
                    <div class="flex flex-col">
                        <h1 class="text-4xl mb-2">{{ route.params.city }}</h1>
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
                    </div>
                    <p class="text-2xl">
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
                <div class="flex-col">
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
                </div>
                <img class="w-[150px] h-auto"
                    :src="`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`"
                    alt="Weather Icon"
                />
            </div>
        </div>

        <!-- Hourly Weather -->
        <div class="container pb-3 mt-5 w-full bg-[#69c7fd]">
            <div>
                <h2 
                class="m-4 flex flex-col items-center text-white font-semibold"
                >
                    Hourly Weather
                </h2>

                <div class="overflow-x-auto">
                    <LineChart :chartData="chartData"/>
                </div>
            </div>
        </div>

        <!-- Others -->
        <div class="container px-0 mt-1 text-white">

            <div class="flex justify-around bg-[#69c7fd] pt-10 pb-7">

                <div class="flex-col  flex-1">
                    <div class="flex mb-6 w-full justify-center">
                        <i class="fa-solid fa-sun text-5xl text-yellow-200 mr-2"></i>
                        <i class="fa-solid fa-up-long text-weather-secondary"></i>
                    </div>
                    <p class="flex justify-center text-2xl">
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
                <div class="flex-col flex-1">
                    <div class="flex mb-6 justify-center">
                        <i class="fa-solid fa-sun text-5xl text-yellow-200 mr-2"></i>
                        <i class="fa-solid fa-down-long text-weather-secondary"></i>
                    </div>

                    <p class="flex justify-center text-2xl">
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
            <!-- hum & press & wind -->
            <div class="flex mt-1 py-8 justify-around bg-[#69c7fd]">
                <div class="flex">
                    <div class="flex-col">
                        <i class="fa-solid fa-droplet text-3xl text-sky-200 flex justify-center"></i>
                        <p class="my-3 flex justify-center">Humidity</p>
                        <p class="flex justify-center">
                            {{ weatherData.main.humidity}} %
                        </p>
                    </div>
                </div>
                <div class="flex-col">
                    <i class="fa-solid fa-globe text-3xl text-green-200 flex justify-center"></i>
                    <p class="my-3 flex justify-center">Pressure</p>
                    <p class="flex justify-center">
                        {{ weatherData.main.pressure}} hPa
                    </p>
                </div>
                <div class="flex-col">
                    <div>
                        <i class="fa-solid fa-wind text-3xl text-gray-200 flex justify-center"></i>
                        <p class="my-3 flex justify-center">Wind</p>
                        <p class="flex justify-center">
                            {{ weatherData.wind.speed * 3.6}} km/h
                        </p>
                    </div>
                </div>
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
    const hour = i < 10 ? `0${i}:00` : `${i}:00`; 
    const temperature = Math.floor(Math.random() * 20); 
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
      tension: 0.6
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
            weatherData.data.sys.sunrise * 1000,
            userOffset,
            cityOffset
        ) 

        const sunsetTime = calculateLocalTime(
            weatherData.data.sys.sunset * 1000,
            userOffset,
            cityOffset
        ) 
        console.log('datacal :', DataCalculationTime);
        console.log('sunrise :', weatherData);
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
