const apiKey = "4112cfe3c183a8fa666b741c8ed05732";
const $cityInput = document.querySelector("#city");

function getWeather(cityKey){
    let cordUrl = "https://geocode.xyz/" + cityKey + "?json=1";
    let latitude = "";
    let longitude = "";
    latitude = "38.9717";
    longitude = "-95.2353";
    // fetch(cordUrl).then((response)=>{
    //     if (response.ok){
    //         response.json().then((data)=>{
    //             latitude = data.latt;
    //             longitude = data.longt;
    //             if (latitude === "") return false;
                let weatherUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial&exclude=minutely,hourly,alerts&appid=" + apiKey;
                fetch(weatherUrl).then((response)=>{
                    if (response.ok){
                        response.json().then((data)=>{ //convert to JSON
                            console.log(data);
                            console.log(data.current.weather[0].icon); //"http://openweathermap.org/img/wn/" + icon + "@2x.png"
                            console.log(data.current.temp);
                            console.log(data.current.wind_speed);
                            console.log(data.current.humidity);
                            console.log(data.current.uvi);
                            for (let i = 1; i < 6; i++){
                                console.log(data.daily[i].weather[0].icon);
                                console.log(data.daily[i].temp.day);
                                console.log(data.daily[i].temp.day);
                                console.log(data.daily[i].wind_speed);
                                console.log(data.daily[i].humidity);
                                console.log(data.daily[i].uvi);
                            }
                        });
                    }
                    else alert("Error! " + response.statusText);
                });
            // });
        // }
        // else alert("Error! " + response.statusText);
    //});
}

function enterCity(event){
    event.preventDefault(); //stops a default refresh of the page
    let cityKey = $cityInput.value.trim();
    if (cityKey){ //viable string
        getWeather(cityKey);
        $cityInput.value = ""; //set to default
    }
    else alert("Please enter a viable city!");
}

$cityInput.addEventListener("submit", enterCity);
getWeather("Lawrence");