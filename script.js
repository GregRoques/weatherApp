// NOTE: This program equires a Google Maps – Places API Key with Geolocation and Geocode Activated 
//       AND an Open Weather Maps API Key in a Config.js file to work.

// ==================== Pull Current Location and Populate in Place Holder Location at Input

let lat;
let lon;
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
        lat = position.coords.latitude;
        lon = position.coords.longitude;

        const myAddressUrl=`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${placesKey}`
        $.getJSON(myAddressUrl,(addressData)=>{   
            const myCurrAddress =  addressData.results[0].formatted_address;
            $('.input-address').val(myCurrAddress);
        });        
    });
};

// =================================================================================== Submit Address

$('#weather-form').submit((e)=>{
    e.preventDefault();

// ================================================================== Get Lat and Lon

  // Google Places URL Start
  const googlePlaceUrl = "https://maps.googleapis.com/maps/api/place"
           
      // ================== Get Search Location Lat and Lon
      const myLocation = $('.input-address').val();
  
          const myLocationComma = myLocation.replace(/,/g,"");
          const myLocFinalFormat = myLocationComma.replace(/ /g,"+")
          
          const addressToCordinatesUrl=`https://maps.googleapis.com/maps/api/geocode/json?address=${myLocFinalFormat}&key=${placesKey}`    
          
          let searchLat;
          let searchLon;
          let searchCoordinates;
          $.getJSON(addressToCordinatesUrl,(coridinateData)=>{   
              searchLat =  coridinateData.results[0].geometry.location.lat;
              searchLon =  coridinateData.results[0].geometry.location.lng;

            // ====================================== Build Open Weather Url with searchLat and searchLon
            
            
            function getWeather(){
                return `https://api.openweathermap.org/data/2.5/weather?lat=${searchLat}&lon=${searchLon}&appid=${apiKey}&units=imperial`;
            }
            setInterval("getWeather()",11800000)
            let weatherUrl = getWeather()


            // ========================================= Pull Open Weather Data from JSON

            $.getJSON(weatherUrl,(weatherData)=>{
                
                // Read temp
                    const currTemp = Math.round(weatherData.main.temp);

                // Read weather illustration and description
                    const currDescription = weatherData.weather[0].main;
                    const currCondition = weatherData.weather[0].icon;

                // Generate date and time of data pull
                
                    const dt = weatherData.dt

                    // Convert from epoch
                    let myDate = new Date( dt *1000);
                    // let myToday = myDate.toLocaleString().split(`,`);
                    // console.log(myToday)
                
                
            //    ======================= Weather Animation Implementation
                

                // Hide Zip Code Search
                $(`.input-group`).hide()

                // animate temp
                animateTemp(currTemp)
                setInterval("animateTemp(currTemp)",11800000)

                tempBackground(currTemp)
                setInterval("tempBackground(currTemp)",11800000)
                

                // animate world(city)
                animateWorld(`${weatherData.name}`)
                setInterval("animateWorld(`${weatherData.name}`)",11800000)
               

                // animate weather conditions
                animateWeather(currCondition,currDescription)
                setInterval("animateWeather(currCondition,currDescription)",11800000)


                //    ======================= Date and Time Animation Implementation

                currDateAndTime = (new Date().valueOf())/1000

                dtURL =`https://maps.googleapis.com/maps/api/timezone/json?location=${searchLat},${searchLon}&timestamp=${currDateAndTime}&key=${timeZoneKey}`
                console.log(dtURL)
                $.getJSON(dtURL,(dtData)=>{   
                    const daylightOffset = dtData.dstOffset
                    const locOffset = dtData.rawOffset
                    // console.log(daylightOffset)
                    // console.log(locOffset)
                    offsetData =  (locOffset * 1000) + (daylightOffset * 1000)

                    // animate Time
                    animateTime(offsetData)
                    setInterval("animateTime(offsetData)",1000)
                    
                    // animate Date
                    animateDate(offsetData)
                });    

            });
    });
});

// ======================================================================================================= Show Temp

function animateTemp(theTemp){
    
    tempHTML=`
    <div class="theTempPosition">
        <div class="theTemperature">TEMPERATURE</div>
        <div class="theTemperature2"><i class="theTempLine1">x</i> <b class="theTempLine2">${theTemp}&deg</b></div>
    </div>
    `
    $('.tempData').html(tempHTML); 

}

// ====================================================================================================== Show City

function animateWorld(city){

    cityHTML =`
    <div class="worldPosition">
    <div class="world">WORLD</div>
    <div class="world2">${city}</div>
</div>
    `
    $('.worldData').html(cityHTML); 
}


// ===================================================================================================== Show Weather
function animateWeather(weatherOutside,weatherDescription){

        weatherHTML=`
        <div class="squarePosition">
            <div class="square"></div>
            <div class="squareText">${weatherDescription}</div>
        </div>
        `
        $('.weatherData').html(weatherHTML);

        document.querySelector('.square').style.backgroundImage = `url('WeatherIcons/${weatherOutside}.png')`;
        
    }

    // ======================================================================================================= Show Time
    

    function animateTime(timeOffset){

        let timeNow = ((new Date().valueOf()) + timeOffset) + 18000000;
        let readableTimeNow = (new Date(timeNow));
        // console.log(readableTimeNow)
        let timeString = readableTimeNow.toTimeString().split(" ")
        let theTime = timeString[0].split(":")

        let hour = Number.parseInt(theTime[0]) 
        let min = theTime[1]
        let amPm 

        if (hour > 12){
            hour = hour -12
            amPm = "pm"
        } else {
            amPm = "am"
        }
        

        timeHTML=`
        <div class="timePosition">
             <div class="time">TIME</div>
             <div> <span class="time2">${hour}<b>:</b>${min}</span><span class="time3"> ${amPm}</span></div>
            
        </div>
        `
        $('.timeData').html(timeHTML);

    }
       // ==================================================================================================== Show Date
    
       function animateDate(dateOffset){

        let dateNow = ((new Date().valueOf()) + dateOffset) + 18000000;
        let readableDateNow = (new Date(dateNow));
        let dateString = readableDateNow.toDateString().split(" ")
        

        let monthStr = dateString[1];

        const monthNum = { Jan : 1, 
                        Feb : 2, 
                        Mar : 3, 
                        Apr :4 , 
                        May: 5, 
                        Jun : 6, 
                        Jul : 7, 
                        Aug : 8, 
                        Sep : 9, 
                        Oct : 10, 
                        Nov : 11, 
                        Dec: 12}
       
        let month = monthNum[monthStr]
        
        let day = dateString[2];
        let year = dateString[3];
           
           dateHTML=`
           <div class="datePosition">
               <div class="date">DATE</div>
               <div class="date2">${month}.${day}.${year}</div>
           </div>
           `
           $('.dateData').html(dateHTML);
               
       }
        
    
      // ========================================================================================= Change Background for Temp

   
    function tempBackground(degree){
        let musicKey   
        if ( degree > 95){
            document.querySelector('.background').style.backgroundImage = "url('tempBack/6.jpg')";
            document.getElementById("six").play();
            musicKey = "six";
        }else if (degree <= 95 && degree > 80) {
            document.querySelector('.background').style.backgroundImage = "url('tempBack/5.jpg')";
            document.getElementById("five").play();
            musicKey = "five";
        }else if (degree <=80 && degree > 68) {
            document.querySelector('.background').style.backgroundImage = "url('tempBack/7.jpg')";
            document.getElementById("seven").play();
            musicKey = "seven";
        }else if (degree <=68 && degree > 58) {
            document.querySelector('.background').style.backgroundImage = "url('tempBack/4.jpg')";
            document.getElementById("four").play();
            musicKey = "four";
        }else if (degree <=58 && degree > 48) {
            document.querySelector('.background').style.backgroundImage = "url('tempBack/3.jpg')";
            document.getElementById("three").play()
            musicKey = "three";
        } else if (degree <=48 && degree > 32) {
            document.querySelector('.background').style.backgroundImage = "url('tempBack/2.jpg')";
            document.getElementById("two").play();
            musicKey = "two";
        } else{
            document.querySelector('.background').style.backgroundImage = "url('tempBack/1.jpg')";
            document.getElementById("one").play();
            musicKey = "one";
        }


        
            const musicBoxClass = document.querySelector('.musicBox')
            musicBoxClass.style.backgroundImage = "url('noteBlock.png')";
    
    
            click = 0
            function addClick(){
                click++
                if(click % 2 != 0){
                    // musicBoxClass.style.animation = "none"
                    musicBoxClass.style.animationPlayState = "paused"
                    document.getElementById(musicKey ).pause()
                    
                }else{
                    // musicBoxClass.style.animation = "musicBox 6s infinite"
                    musicBoxClass.style.animationPlayState = "running"
                    document.getElementById(musicKey).play()
                }
            }
            musicBoxClass.onclick = function() {addClick()};
            
        

    }

    // ======================================================================================================= Music Pause

    // function musicPause(musicKey){
        
    //     const musicBoxClass = document.querySelector('.musicBox')
    //     musicBoxClass.style.backgroundImage = "url('noteBlock.png')";


    //     click = 0
    //     function addClick(){
    //         click++
    //         if(click % 2 != 0){
    //             // musicBoxClass.style.animation = "none"
    //             musicBoxClass.style.animationPlayState = "paused"
    //             document.getElementById(musicKey).pause()
                
    //         }else{
    //             // musicBoxClass.style.animation = "musicBox 6s infinite"
    //             musicBoxClass.style.animationPlayState = "running"
    //             document.getElementById(musicKey).play()
    //         }
    //     }
    //     musicBoxClass.onclick = function() {addClick()};

    




    





