# weather-dashboard
http://gotad.io/weather-dashboard

The application begins when the loadStuff() function is ran; it checks local storage for the previously selected city, and if it finds none, getWeather() is ran with the arguments "Kansas City" and 'false'. Otherwise, the last previous searched city is ran as the 1st argument. This function uses the city string, concats it into a string URL, and uses the URL to fetch data from a geo-api which converts city names to coordinates. This function is the function users are ultimately activating when manually entering a city string in the search bar.
Once the geo-api gives us coordinates of our city, we concat those to yet another URL string to fetch data from our weather API. When we receive our healthy response, we decompile the new data from a JSON format to an object where we can process it further in processWeather(). Right before this happens, however, we use our bool argument passed when we passed our city string above to determine if we need to append the city name to a button of previously searched cities.
We can process the data, save it to a data object with a class called "weatherDay", and use the new object to quickly append things to the DOM. Once this process is done, we'll have our current and our 5-day forecast on the page!
This turned out to be a fun little project! I even wrote a little capitalize() function which properly 'pascal-cases' our city name for better viewing.

![weatherAPI](https://user-images.githubusercontent.com/54012873/139109659-df28f29f-0425-473b-92fe-e8e579c63908.png)
