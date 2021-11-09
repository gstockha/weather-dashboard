const apiKey = "4112cfe3c183a8fa666b741c8ed05732";
const $cityInput = document.querySelector("#city-input");
const $cityButton = $("#city-btn");
const $cityList = $("#prev-cities");
let cityListCount = 0;
let cityList = [];
let dayList = [];

function getWeather(cityKey,makeButton){
    cityKey = capitalize(cityKey);
    console.log(cityKey);
    let cordUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityKey + "&limit=1&appid=" + apiKey;
    let latitude = "";
    let longitude = "";
    fetch(cordUrl).then((response)=>{
        if (response.ok){
            response.json().then((data)=>{
                latitude = data[0].lat;
                longitude = data[0].lon;
                if (latitude === "") return false;
                let weatherUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial&exclude=minutely,hourly,alerts&appid=" + apiKey;
                fetch(weatherUrl).then((response)=>{
                    if (response.ok){
                        response.json().then((data)=>{ //convert to JSON
                            processWeather(data,cityKey);
                            //if we're not clicking preexisting btn and it doesn't already exist, make btn
                            if ((makeButton) && !(cityList.includes(cityKey))){
                                //add it to the prev list
                                makeList(cityKey);
                            }
                            saveStuff(cityKey);
                        });
                    }
                    else alert("Error! Couldn't get weather!");
                });
            });
        }
        else alert("Error! Couldn't get coords!");
    });
}

function processWeather(data,cityKey){
    console.log(data);
    //reset array and html
    dayList = []; //clear it
    $('#current').children("h3").empty();
    $('#current').children("h2").empty();
    $('#current').children("h1").empty();
    //today's date
    let mDate = moment().format('MM/DD/YY, h:mm a');
    //current weather
    let index = data.current;
    //make current day object
    dayList[0] = new weatherDay(cityKey + " (" + mDate + ")",index);
    dayList[0].appendCurrent();
    //extended 5 day forecast
    for (let i = 1; i < 6; i++){
        //clear the last forecasted html
        $('#forecast' + i).empty();
        //grab the next day
        mDate = moment().add(i,'d').format('MM/DD/YY');
        //weather data
        index = data.daily[i];
        //make new object
        dayList[i] = new weatherDay(mDate,index);
        dayList[i].appendForecast(i);
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
    getUVColor(){
        if (this.uvi <= 2) return "uvGreen";
        if (this.uvi <= 5) return "uvYellow";
        if (this.uvi <= 7) return "uvOrange";
        if (this.uvi <= 10) return "uvRed";
        if (this.uvi > 10) return "uvPurple";
    }
    appendCurrent(){
        let cur = $('#current');
        let str = "http://openweathermap.org/img/wn/" + this.icon + "@2x.png";
        let clr = this.getUVColor();
        cur.children('h1').append(this.date).append(' <img src=' + str + ' />');
        cur.children('h2')[0].append('Temp: ' + this.temp + '\xB0F');
        cur.children('h2')[1].append('Wind: ' + this.wind + ' MPH');
        cur.children('h2')[2].append('Humidity: ' + this.humidity + ' %');
        cur.children('h3').append(this.uvi).addClass(clr);
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

function capitalize(cityKey){
    cityKey = cityKey.split(" ");
    let str = "";
    for (let i = 0; i < cityKey.length; i++){
        cityKey[i] = cityKey[i].toLowerCase(); //turn to lowercase first
        cityKey[i] = cityKey[i][0].toUpperCase() + cityKey[i].slice(1); //then capitalize first letter
        str += cityKey[i];
        if (i !== (cityKey.length - 1)) str += " "; //readd the spaces
    }
    return str;
}

function makeList(cityKey){
    cityList.unshift(cityKey); //add to the beginning of the list
    cityListCount ++;
    $cityList.empty(); //empty current button list
    for (let i = 0; i < cityListCount; i++){
        $cityList.append("<button>").children("button")[i].append(cityList[i]);
    }
}

function loadStuff(){
    let cityKey = JSON.parse(localStorage.getItem("current"));
    if (cityKey != null) getWeather(cityKey,false);
    else getWeather("Kansas City", false);
    let tempList = JSON.parse(localStorage.getItem("list"));
    if (tempList != null){
        for (let j = 0; j < tempList.length; j++){
            makeList(tempList[j]);
        }
    }
}

function saveStuff(currentCity){
    localStorage.setItem("current",JSON.stringify(currentCity));
    localStorage.setItem("list",JSON.stringify(cityList));
}

function enterCity(event){
    event.preventDefault(); //stops a default refresh of the page
    let cityKey = $cityInput.value.trim();
    if (cityKey){ //viable string
        getWeather(cityKey,true);
        $cityInput.value = ""; //set to default
    }
    else alert("Please enter a viable city!");
}

function clickCity(event){
    event.preventDefault();
    getWeather(event.target.innerHTML,false);
}

loadStuff();

$($cityButton).on("click", enterCity);
$($cityList).on("click", clickCity);