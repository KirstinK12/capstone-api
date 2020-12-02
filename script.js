'use strict'

const hikingURL = 'https://www.hikingproject.com/data/get-trails?lat=40.3772&lon=-105.5217&maxDistance=100&maxResults=500&key=200010523-65a91fc7d6ebfbd5ac9a7c58752ca49c'

function getHikes() {

  fetch(hikingURL)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function displayResults(responseJson) {
  //console.log(responseJson);

  const estesOnlyTrails = responseJson.trails.filter(trail => {
    return trail.location === 'Estes Park, Colorado';
  });

  for (let i = 0; i < estesOnlyTrails.length; i++) {
    const currentTrail = estesOnlyTrails[i]
    if (currentTrail.location === "Estes Park, Colorado") {

      $('.results').append(`<div class='result-${currentTrail.name}'>
 <button id="toggle-${currentTrail.id}">
 <h3>${currentTrail.name}</h3></button>
 <div>Summary: ${currentTrail.summary}</div><br>
 <div>Length: ${currentTrail.length} miles</div><br>

  <div id="content-${currentTrail.id}" class='content'> 
 <div>Difficulty: ${currentTrail.difficulty}</div><br>
 <div>Ascent: ${currentTrail.ascent}</div><br>
 <div>Altitude: ${currentTrail.high} feet</div><br>
 <div>Current Conditions: ${currentTrail.conditionStatus}</div><br>
 <div><img src="${currentTrail.imgMedium}" alt="Trail Picture" width=500px height=300px></div>
 <div></div>`)

      let toggle = document.getElementById(`toggle-${currentTrail.id}`);
      let selectedContent = document.getElementById(`content-${currentTrail.id}`);

      selectedContent.style.display = 'none';

      toggle.addEventListener("click", function (e) {
        for (let j = 0; j < $('.content').length; j++) {
          $('.content')[j].style.display = 'none'
        }

        if (selectedContent.style.display === 'none') {
          selectedContent.style.display = 'block'

          getYouTubeVideos(`${currentTrail.name}, Rocky Mountain National Park`, selectedContent)

        }
        else { selectedContent.style.display = 'none' };

      })

    }
  }
}

const apiKey = 'AIzaSyD-wTO-pgN4n-0etXqDG7YjTo5_6UveKps';
const youtubeURL = 'https://www.googleapis.com/youtube/v3/search';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function youtubeResults(responseJson, content) {
  console.log(responseJson);

  const youtubeVideo = responseJson.items

  $('.currentVid').remove()


  for (let i = 0; i < youtubeVideo.length; i++) {
    $(content).append(`<div class='currentVid'>
      <div><a href='https://www.youtube.com/watch?v=${youtubeVideo[i].id.videoId}' '_blank'>${youtubeVideo[i].snippet.title}</div></a><br>
     <img src='${youtubeVideo[i].snippet.thumbnails.default.url}'>
     <div><a href=${youtubeVideo[i].id.videoId}></div></div>`)
  };

};

function getYouTubeVideos(query, content) {
  const params = {
    key: apiKey,
    q: query,
    part: 'snippet, id',
    maxResults: 3,
    type: 'video'
  };
  const queryString = formatQueryParams(params)
  const url = youtubeURL + '?' + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => youtubeResults(responseJson, content))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

$(getHikes)