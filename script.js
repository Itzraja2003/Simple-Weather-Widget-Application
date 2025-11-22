
const apiKey = "9f1588148da4534b75cffc0040dddeff";

// ==================== THEME TOGGLE ====================
function toggleTheme() {
    document.body.classList.toggle("dark");
    const icon = document.getElementById("themeIcon");

    if (document.body.classList.contains("dark")) {
        icon.classList.replace("bi-brightness-high-fill", "bi-moon-stars-fill");
    } else {
        icon.classList.replace("bi-moon-stars-fill", "bi-brightness-high-fill");
    }
}

// ==================== GET WEATHER BY CITY ====================
function getWeatherByCity() {
    const city = document.getElementById("cityInput").value;
    if (!city) {
        alert("Enter a city name");
        return;
    }

    getWeather(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
}

// ==================== GPS WEATHER ====================
function getWeatherByLocation() {
    navigator.geolocation.getCurrentPosition(
        pos => {
            const { latitude, longitude } = pos.coords;
            getWeather(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`);
        },
        () => alert("Location permission denied.")
    );
}

// ==================== FETCH CURRENT WEATHER ====================
async function getWeather(url) {
    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.cod === "404") {
            alert("City not found");
            return;
        }

        displayCurrentWeather(data);
        get7DayForecast(data.coord.lat, data.coord.lon);

        setWeatherBackground(data.weather[0].main);

    } catch (err) {
        console.error(err);
        alert("Error fetching weather");
    }
}

// ==================== DISPLAY CURRENT WEATHER ====================
function displayCurrentWeather(data) {
    document.getElementById("currentWeather").classList.remove("d-none");

    document.getElementById("cityName").innerHTML = data.name;
    document.getElementById("temperature").innerHTML = `${data.main.temp}°C`;
    document.getElementById("description").innerHTML = data.weather[0].description;
    document.getElementById("humidity").innerHTML = `Humidity: ${data.main.humidity}%`;

    const icon = data.weather[0].icon;
    document.getElementById("weatherIcon").src =
        `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

// ==================== 7-DAY FORECAST ====================
async function get7DayForecast(lat, lon) {
    const url =
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    const res = await fetch(url);
    const data = await res.json();

    const forecastEl = document.getElementById("forecast");
    forecastEl.innerHTML = "";

    // Pick one forecast per day (every 24 hours)
    for (let i = 0; i < data.list.length; i += 8) {
        const day = data.list[i];

        const date = new Date(day.dt_txt).toLocaleDateString("en-US", {
            weekday: "short"
        });

        const icon = day.weather[0].icon;

        const card = `
            <div class="forecast-card">
                <h6>${date}</h6>
                <img src="https://openweathermap.org/img/wn/${icon}.png">
                <p>${Math.round(day.main.temp)}°C</p>
            </div>
        `;

        forecastEl.innerHTML += card;
    }
}

// ==================== DYNAMIC WEATHER BACKGROUND ====================
function setWeatherBackground(weather) {
    let bg;

    switch (weather) {
        case "Clear":
            bg = "linear-gradient(to bottom, #f7b733, #fc4a1a)";
            break;
        case "Clouds":
            bg = "linear-gradient(to bottom, #bdc3c7, #2c3e50)";
            break;
        case "Rain":
            bg = "linear-gradient(to bottom, #4b79a1, #283e51)";
            break;
        case "Snow":
            bg = "linear-gradient(to bottom, #e6dada, #274046)";
            break;
        case "Thunderstorm":
            bg = "linear-gradient(to bottom, #232526, #414345)";
            break;
        default:
            bg = "linear-gradient(to bottom, #83a4d4, #b6fbff)";
    }

    document.body.style.background = bg;
}
