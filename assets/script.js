const apiKey = "4112cfe3c183a8fa666b741c8ed05732";
const $cityInput = document.querySelector("#city-input");
const $cityButton = $("#city-btn");
let dayList = [];

function getWeather(cityKey){
    console.log(cityKey);
    let cordUrl = "https://geocode.xyz/" + cityKey + "?json=1";
    let latitude = "";
    let longitude = "";
    latitude = "38.9717";
    longitude = "-95.2353";
    fetch(cordUrl).then((response)=>{
        if (response.ok){
            response.json().then((data)=>{
                latitude = data.latt;
                longitude = data.longt;
                if (latitude === "") return false;
                let weatherUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial&exclude=minutely,hourly,alerts&appid=" + apiKey;
                fetch(weatherUrl).then((response)=>{
                    if (response.ok){
                        response.json().then((data)=>{ //convert to JSON
                            processWeather(data);
                        });
                    }
                    else alert("Error! " + response.statusText);
                });
            });
        }
        else alert("Error! " + response.statusText);
    });
}

function processWeather(data){
    console.log(data);
    //today's date
    let mDate = moment().format('MMMM Do YYYY, h:mm a');
    //current weather
    let j = 0;
    let index = data.current;
    //make current day object
    dayList[j] = new weatherDay(mDate,index);
    dayList[j].appendCurrent();
    //extended 5 day forecast
    for (let i = 1; i < 6; i++){
        j ++;
        //grab the next day
        mDate = moment().add(i,'d').format('dddd, MMMM Do');
        //mDate = mDate.split(' at')[0];
        //weather data
        index = data.daily[i];
        //make new object
        dayList[j] = new weatherDay(mDate,index);
        dayList[j].appendForecast(j);
    }
}

class weatherDay{
    constructor(date,index){
        this.date = date;
        this.icon = index.weather[0].icon;
        this.temp = index.temp;
        this.wind = index.wind_speed;
        this.humidity = index.humidity;
        this.uvi = index.uvi;
        console.log(this);
    }
    appendCurrent(){
        let cur = $('#current');
        cur.prepend('<h1>');
        let str = "http://openweathermap.org/img/wn/" + this.icon + "@2x.png";
        cur.children('h1').append(this.date).append(' <img src=' + str + ' />');
        cur.children('h2')[0].append('Temp: ' + this.temp + '\xB0F');
        cur.children('h2')[1].append('Wind: ' + this.wind + ' MPH');
        cur.children('h2')[2].append('Humidity: ' + this.humidity + ' %');
        cur.children('h3').append(this.uvi);
        cur.children('h2')[3].append('UV Index: ');
    }
    appendForecast(i){
        let fore = $('#forecast' + i);
        fore.append('<h2>').append('<h3>').append('<h3>').append('<h3>');
        let str = "http://openweathermap.org/img/wn/" + this.icon + "@2x.png";
        fore.children('h2').append(this.date).append(' <img src=' + str + ' />');
        fore.children('h3')[0].append('Temp: ' + this.temp.day + '\xB0F');
        fore.children('h3')[1].append('Wind: ' + this.wind + ' MPH');
        fore.children('h3')[2].append('Humidity: ' + this.humidity + ' %');
    }
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

$($cityButton).on("click", enterCity);