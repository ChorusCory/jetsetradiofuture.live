var currentHowl = null;

// Volume / Gain
var currentVol = 0.5;
Howler.volume(currentVol);
// Current playlist (likely shuffled)
var currentPlaylist = [];
// currentstation Object
var currentStationData = {};
let stationListcache;

// Current Song/Howl
var currentSong = "";
var currentSongIndex = 0;

// Shuffle state
// 0 = linear
// 1 = playlist shuffle
// 2 = global shuffle
var shuffleState = 1;

//list of shuffle station names
var shuffleStations = [];

const audio = document.getElementById("audio");

const graffitiSoul = document.getElementById("graffitiSoul");
const playPause = document.getElementById("play-pause");

const playBtn = document.getElementById("play-btn");
const pauseBtn = document.getElementById("pause-btn");
const songBar = document.getElementById("song-name");

const nextBtn = document.getElementById("next-btn");
const shuffleBtn = document.getElementById("shuffle-btn");
const prevBtn = document.getElementById("prev-btn");

const progressBar = document.getElementById('playbar-progress');
const largePlayIcon = document.getElementById("large-play-icon");

const gainBarValue = document.getElementById("gain-bar");
const projectName = document.getElementById("project-name");

const wallpaper = document.getElementById("wallpaper");

let baseurl = "https://jsrfl.us-east-1.linodeobjects.com/music/stations/";
audio.src = './stations/static.mp3';


function getStationList() {
    return new Promise((resolve, reject) => {
        // 1. Create a new XMLHttpRequest object
        let xhr = new XMLHttpRequest();

        // 2. Configure it: GET-request for the URL /article/.../load
        xhr.open('GET', './stations/stations.json');
        xhr.responseType = 'json';
        // 3. Send the request over the network
        xhr.send();

        // 4. This will be called after the response is received
        xhr.onload = function() {
            if (xhr.status != 200) { // analyze HTTP status of the response
                alert(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
            } else { // show the result
                //alert(`Done, got ${xhr.response.length} bytes`); // response is the server response

                if (xhr.response !== null) {
                    stationListcache = xhr.response;
                }
                console.log(xhr.response);
                resolve(xhr.response);
            }
        };

        xhr.onerror = function() {
            alert("Playlist Request failed");
            reject();
        };
    });
}

//Load classic station initally
function getStationData(stationselected) {


    if (stationListcache === undefined && typeof stationListcache == 'undefined') {
        stationselected = "classic";
    } else {
        var isValid = false;
        console.log(stationListcache.stations)
        for (var i = 0; i < stationListcache.stations.length; i++) {
            if (stationselected == stationListcache.stations[i].name) {
                isValid = true;
                break;
            }
        }
        if (!isValid) {
            stationselected = "classic";
        }
    }



    return new Promise((resolve, reject) => {
        // 1. Create a new XMLHttpRequest object
        let xhr = new XMLHttpRequest();

        // 2. Configure it: GET-request for the URL /article/.../load
        xhr.open('GET', './stations/' + stationselected + '/' + stationselected + '.json');
        xhr.responseType = 'json';
        // 3. Send the request over the network
        xhr.send();

        // 4. This will be called after the response is received
        xhr.onload = function() {
            if (xhr.status != 200) { // analyze HTTP status of the response
                alert(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
            } else { // show the result
                //alert(`Done, got ${xhr.response.length} bytes`); // response is the server response
                console.log(xhr.response);
                resolve(xhr.response);
            }
        };

        xhr.onerror = function() {
            alert("Playlist Request failed");
            reject();
        };
    });
}

// Set Station info locally
function setStation(stationData) {

    if (currentHowl) {

        currentHowl.pause();
    }

    currentStationData = stationData;
    // document.getElementById('wallpaper').src = stationData.wallpaper;
    pauseBtn.style.display = "none";
    playBtn.style.display = "";
    var r = document.querySelector(':root');
    r.style.setProperty('--primary-color', currentStationData.colorsObj.colors[0]);

    r.style.setProperty('--primary-dark-color', currentStationData.colorsObj.colors[1]);

    r.style.setProperty('--secondary-color', currentStationData.colorsObj.colors[2]);

    r.style.setProperty('--border-color', currentStationData.colorsObj.colors[3]);

    r.style.setProperty('--border2-color', currentStationData.colorsObj.colors[4]);

    r.style.setProperty('--outline-color', currentStationData.colorsObj.colors[5]);

    graffitiSoul.src = "./stations/" + currentStationData.stationName + "/icon.png";
    wallpaper.src = "./stations/" + currentStationData.stationName + "/wallpaper.jpg";
    currentPlaylist = currentStationData.songList;

    if (shuffleState != 0) {
        shuffle(currentPlaylist)
    }


    //get random  song index 
    currentSongIndex = currentPlaylist.length * Math.random() | 0;
    currentSong = currentPlaylist[currentSongIndex];
    console.log(currentSong)
    songBar.classList.remove("animation");
    songBar.style.display = "none";
    try {
        setAudioSrc(currentSong);
    } catch (e) {
        console.log(e);
    }


    if (shuffleState == 2 && currentStationData.isLive === undefined && typeof currentStationData.isLive == 'undefined') {
        audio.play().catch((e) => {
            /* error handler */
            console.log(e);
        });;
    }

    window.location.hash = `#${currentStationData.stationName}`;
}





const settingsModal = document.getElementById('settings-modal');
const settingsModalContainer = document.getElementById('settings-modal-container');
const keyboardModal = document.getElementById('keyboard-modal');
const keyboardModalContainer = document.getElementById('keyboard-modal-container');

const radioModal = document.getElementById('radio-modal');
const chatModal = document.getElementById('chat-modal');
//const waveformLinearButton = document.getElementById('waveform-linear-button');

//const rainbowButton = document.getElementById('rainbow-button');

let selectedVisualizer = "waveformLinear";
let selectedColor = "rainbowD3";
let selectedBackgroundDirection = "45deg";


const visualizerObj = {

    waveformLinear: {
        //button: waveformLinearButton,
        visualizer: waveformLinear,
        prev: "fullScreen",
        next: "waveformCircle",
    }
};

const colorObj = {
    rainbowD3: {
        //button: rainbowButton,
        color: d3.interpolateRainbow,
        prev: "greysD3",
        next: "plasmaD3",
    },
};

let AudioContext = window.AudioContext || window.webkitAudioContext;
let contextCreated = false;
let context;
let analyser;
let gain;

const createContext = () => {
    //TODO get this to work with 
    // Howler.ctx;
    contextCreated = true;
    context = new AudioContext();
    analyser = context.createAnalyser();
    analyser.minDecibels = -105;
    analyser.maxDecibels = -25;
    analyser.smoothingTimeConstant = 0.8;
    gain = context.createGain();
    let src = context.createMediaElementSource(audio);
    // console.log(sound._sounds[0]._node)
    src.connect(gain);
    gain.connect(analyser);
    updateGain(currentVol);
    analyser.connect(context.destination);
    createVisualizer();
};


/*
    infoLink.onclick = () => {
        informationModal.style.display = "";
    };

    document.getElementById('close-modal').onclick = () => {
        informationModal.style.display = "none";
    };

    informationModal.onclick = e => {
        if (e.target === informationModal) informationModal.style.display = "none";
    };
*/



function loadStationModal(Stationresobj) {
    if (Stationresobj !== null) {
        stationListcache = Stationresobj;
    }
    const stationListElem = document.getElementById("stationList");
    //10 is an arbritrary number 
    if (stationListElem.childElementCount <= 10) {
        for (stationindx in stationListcache.stations) {
            const stationobj = stationListcache.stations[stationindx];
            // Outter div
            let li = document.createElement('li');


            li.classList.add('station-row-box');

            // inner div
            let div1 = document.createElement('div');
            div1.classList.add('station-grid-box');
            div1.setAttribute('data', stationobj.name);
            // Set Load Station function for station elements 
            div1.onclick = function() {
                radioModal.style.display = "";
                const stationselected = this.getAttribute("data");

                getStationData(stationselected)
                    .then((res) => setStation(res))
                    .catch((err) => console.log(err));

            };
            //icon
            let stationicon = document.createElement('img');
            stationicon.classList.add('station-grid-image');
            stationicon.classList.add('lazy');
            stationicon.setAttribute('title', stationobj.name);
            stationicon.setAttribute('alt', stationobj.name);
            stationicon.setAttribute('data-src', "stations/" + stationobj.name + "/icon.png");
            //desc
            let div11 = document.createElement('div');
            div11.classList.add('stationTitle');
            div11.innerHTML = stationobj.description;
            div1.appendChild(stationicon);
            div1.appendChild(div11);
            // shuffle div
            let div2 = document.createElement('div');
            div2.classList.add('stationShuffle');

            //shuffle checkbox if not live
            if (stationobj.isLive === undefined && typeof stationobj.isLive == 'undefined') {
                let shuffinput = document.createElement('input');
                shuffinput.setAttribute('type', "checkbox");
                shuffinput.setAttribute('id', "shuffleCheckBox_" + stationobj.name);
                shuffinput.setAttribute('data', stationobj.name);
                shuffinput.setAttribute('checked', "checked");
                shuffinput.setAttribute('onchange', "updateCheckedState(this)");
                shuffleStations.push(stationobj.name);
                div2.appendChild(shuffinput);
            }
            // supportlink div
            let div3 = document.createElement('div');
            div3.classList.add('stationShuffle');
            //add Support link if it exists
            if (stationobj.supportLink !== undefined && typeof stationobj.supportLink != 'undefined') {
                let supportLink = document.createElement('a');
                supportLink.style.color = "#eee";
                supportLink.style.textDecoration = "underline";
                // Create the text node for anchor element.
                var link = document.createTextNode("Link");


                // Append the text node to anchor element.
                supportLink.appendChild(link);

                // Set the title.
                supportLink.title = "Support the Original Release";
                supportLink.target = "_blank";

                // Set the href property.
                supportLink.href = stationobj.supportLink;
                div3.appendChild(supportLink);
            }

            li.appendChild(div1);
            li.appendChild(div2);

            li.appendChild(div3);
            stationListElem.appendChild(li);
            //     <li class="station-row-box">
            //     <div class="station-grid-box" data="vocaloid">
            //         <img class="station-grid-image lazy" title="vocaloid" alt="vocaloid" data-src="stations/vocaloid/icon.png">
            //         <div class="stationTitle">Funky Vocaloid Tracks</div>

            //     </div>
            //     <div class="stationShuffle">
            //         <input type="checkbox" id="flexCheckDefault" checked="checked">
            //     </div>
            // </li>
        }
    }

    lazyLoadInstance.update();
}

function updateCheckedState(checkboxelem) {
    if (checkboxelem.getAttribute("checked") == "checked") {
        checkboxelem.setAttribute('checked', "");
        shuffleStations.pop(checkboxelem.getAttribute('data'));
    } else {
        checkboxelem.setAttribute('checked', "checked");
        shuffleStations.push(checkboxelem.getAttribute('data'));
    }
}


document.getElementById('radio-link').onclick = () => {
    // Load station list data and cache it when needed
    if (stationListcache === undefined && typeof stationListcache == 'undefined') {
        getStationList()
            .then((res) => loadStationModal(res))
            .catch((err) => console.log(err));
    } else {
        loadStationModal(stationListcache);
    }

    radioModal.style.display = "flex";
};




document.getElementById('chatBtn').onclick = () => {
    chatModal.style.display = "block";
};

// Keyboard Controls Modal Control
document.getElementById('keyboard-controls').onclick = () => {
    keyboardModal.style.display = "block";
};
document.getElementById('setting-controls').onclick = () => {
    settingsModal.style.display = "block";
};


settingsModalContainer.onclick = e => {
    if (e.target === settingsModalContainer) settingsModal.style.display = "none";
};

keyboardModalContainer.onclick = e => {
    if (e.target === keyboardModalContainer) keyboardModal.style.display = "none";
};

radioModal.onclick = e => {
    if (e.target === radioModal) radioModal.style.display = "none";
    //Save settings
    shuffleStations = []
    for (var i = 0; i < stationListcache.stations.length; i++) {
        var stationElem = document.getElementById('shuffleCheckBox_' + stationListcache.stations[i].name);
        if (stationElem) {
            var ischecked = stationElem.getAttribute("checked");
            if (ischecked == "checked") {
                shuffleStations.push(stationListcache.stations[i].name);
            }
        }

    }
};

chatModal.onclick = e => {
    if (e.target === chatModal) chatModal.style.display = "";
};

let timeOut;

document.onmousemove = () => {
    //showElements();
    // clearTimeout(timeOut);
    //timeOut = setTimeout(() => hideElements(), 3000);
};

document.onclick = () => {
    // showElements();
    // clearTimeout(timeOut);
    // timeOut = setTimeout(() => hideElements(), 3000);
};

const createVisualizer = () => {
    if (contextCreated) {

        changeAnimationStatus();
        removeVisualizer();
        try {
            visualizerObj[selectedVisualizer].visualizer(analyser, colorObj[selectedColor].color);
        } catch (e) {
            console.log("not supported in this browser")
        }
        const svg_ = document.getElementById('visualizer-svg');
        svg_.style.width = "100%";
        svg_.style.height = "95vh";
        svg_.style.position = "absolute";
        svg_.style.zIndex = "1";
    }
};

const switchVisualizer = (newVisualizer) => {
    if (selectedVisualizer !== newVisualizer) {
        //visualizerObj[selectedVisualizer].button.classList.remove("active-visualizer");
        selectedVisualizer = newVisualizer;
        //visualizerObj[selectedVisualizer].button.classList.add("active-visualizer");
        createVisualizer();
    }
};

const prevVisualizer = () => {
    switchVisualizer(visualizerObj[selectedVisualizer].prev);
};
const nextVisualizer = () => {
    switchVisualizer(visualizerObj[selectedVisualizer].next);
};

const prevColor = () => {
    switchColor(colorObj[selectedColor].prev);
};
const nextColor = () => {
    switchColor(colorObj[selectedColor].next);
};

const updateDisplayTime = () => {
    const dis = (audio.currentTime / audio.duration) * 100;
    if (dis !== dis) {
        progressBar.style.width = 0;
    } else {

        progressBar.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
    }
};

//TODO figure better way to manage static and live states
const switchPlayPause = () => {
    if (!contextCreated) {
        createContext();
    }
    if (currentStationData.isLive === undefined && typeof currentStationData.isLive == 'undefined') {
        if (context && audio.src !== "") {
            if (audio.paused) {
                audio.play().catch((e) => {
                    /* error handler */
                    console.log(e);
                });
                //sound.play();
                pauseBtn.style.display = "";
                playBtn.style.display = "none";
                largePlayIcon.style.opacity = "";
                largePlayIcon.style.cursor = "";
            } else {
                audio.pause();
                //sound.pause();
                pauseBtn.style.display = "none";
                playBtn.style.display = "";
                largePlayIcon.style.opacity = 1;
                largePlayIcon.style.cursor = "pointer";
            }
        }
    } else {
        if (currentHowl.playing()) {
            currentHowl.pause();
            pauseBtn.style.display = "none";
            playBtn.style.display = "";
            largePlayIcon.style.opacity = 1;
            largePlayIcon.style.cursor = "pointer";
        } else {
            currentHowl.play();
            if (Howler.ctx != null) {
                console.log("hello?");
                const mediaDest = Howler.ctx.createMediaStreamDestination();
                Howler.masterGain.connect(mediaDest);

                // set up media recorder to record output
                const audioChunks = []
                const mediaRecorder = new MediaRecorder(mediaDest.stream, { mimeType: 'audio/webm' });

                mediaRecorder.onstart = (event) => { console.log('Started recording Howl output...') };
                mediaRecorder.ondataavailable = (event) => {
                    audioChunks.push(event.data);
                    console.log(event.data)
                };
                mediaRecorder.onstop = (event) => { console.log('Completed Recording', new Blob(audioChunks)) };

                mediaRecorder.start();

                // setTimeout(() => {
                //     mediaRecorder.stop();
                //     sound.stop()
                // }, 5000);

            }
            pauseBtn.style.display = "";
            playBtn.style.display = "none";
            largePlayIcon.style.opacity = "";
            largePlayIcon.style.cursor = "";
        }



    }
};

function shuffle(array) {
    let currentIndex = array.length,
        randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]
        ];
    }

    return array;
}



function getGlobalShuffle(stopRecursion) {
    if (stationListcache === undefined && typeof stationListcache == 'undefined' && !stopRecursion) {
        getStationList()
            .then((res) => loadStationModal(res))
            .catch((err) => console.log(err));
    }

}

shuffleBtn.onclick = () => {
    //current shuffle state is linear, make shuffle
    if (shuffleState == 0) {
        shuffleState++;
        document.getElementById('shuffle0').style.display = "none";
        document.getElementById('shuffle1').style.display = "block";
        if (currentPlaylist) {
            shuffle(currentPlaylist);
        }
    }
    //current shuffle state is shuffle, make global
    else if (shuffleState == 1) {
        shuffleState++;
        document.getElementById('shuffle1').style.display = "none";
        document.getElementById('shuffle2').style.display = "block";
        getGlobalShuffle(false);
    }
    //current shuffle state is global, make linear
    else {
        shuffleState = 0;
        document.getElementById('shuffle2').style.display = "none";
        document.getElementById('shuffle0').style.display = "block";
        if (currentPlaylist) {
            //use original order
            // currentPlaylist = currentStationData.songList;
            //Sort alphabetical
            currentPlaylist.sort((a, b) => b.localeCompare(a));
        }
    }
}

nextBtn.onclick = () => {
    //if global shufflestate get next station
    if (shuffleState == 2 && shuffleStations.length != 0) {
        var item = shuffleStations[Math.floor(Math.random() * shuffleStations.length)];
        //load inital settings
        getStationData(item)
            .then((res) => setStation(res))
            .catch((err) => console.log(err));
    }

    if (!contextCreated) {
        createContext();
    }

    if (currentStationData.isLive === undefined && typeof currentStationData.isLive == 'undefined') {
        currentSongIndex++;
        if (currentSongIndex > currentPlaylist.length - 1) {
            currentSongIndex = 0;
        }
        currentSong = currentPlaylist[currentSongIndex];

        setAudioSrc(currentSong);

        audio.load();
        var promise = audio.play();
        if (promise !== undefined) {
            promise.then(_ => {
                // play started!
            }).catch(error => {
                // play was prevented.
                // Show a "Play" button so that user can start playback.
            });
        }
    }



}

function setAudioSrc(howl) {
    console.log("NOW PLAYING: " + currentSong);
    console.log(currentStationData);
    if (currentStationData.isLive === undefined && typeof currentStationData.isLive == 'undefined') {
        audio.src = baseurl + "/" + currentStationData.stationName + "/" + howl + '.mp3';
        if (currentHowl) {
            currentHowl.pause();
            currentHowl = null;
        }

    } else {
        //if live use the url in the stream
        currentHowl = new Howl({
                src: [howl],
                html5: true
            })
            //currentHowl.play();
        audio.src = "";
        //audio.src = howl;
    }
}

prevBtn.onclick = () => {
    if (!contextCreated) {
        createContext();
    }


    if (currentStationData.isLive === undefined && typeof currentStationData.isLive == 'undefined') {
        currentSongIndex--;
        if (currentSongIndex < 0) {
            currentSongIndex = currentPlaylist.length - 1;
        }
        //currentSong = currentPlaylist[currentPlaylist.length * Math.random() | 0];
        currentSong = currentPlaylist[currentSongIndex];

        setAudioSrc(currentSong);
        audio.load();
        var promise = audio.play();
        if (promise !== undefined) {
            promise.then(_ => {
                // play started!
            }).catch(error => {
                // play was prevented.
                // Show a "Play" button so that user can start playback.
            });
        }
    }

}

playPause.onclick = () => {
    switchPlayPause();
};

document.getElementById('large-play').onclick = () => {
    switchPlayPause();
};


document.onkeydown = (e) => {
    e.preventDefault();
    if (audio.src !== "") {

        if (e.keyCode == 32) {
            switchPlayPause();
        }
        if (e.keyCode == 37) {
            if (audio.currentTime < 5) {
                audio.currentTime = 0;
            } else {
                audio.currentTime -= 5;
            }
            updateDisplayTime();
        }
        if (e.keyCode == 39) {
            if (audio.duration - audio.currentTime < 5) {
                audio.currentTime = audio.duration;
            } else {
                audio.currentTime += 5;
            }
            updateDisplayTime();
        }
        if (e.keyCode === 38) {
            if (gain.gain.value < 0.9) {
                updateGain(gain.gain.value + 0.1);
            } else if (gain.gain.value !== 1) {
                updateGain(1);
            }
        }

        if (e.keyCode === 40) {
            if (gain.gain.value > 0.1) {
                updateGain(gain.gain.value - 0.1);
            } else if (gain.gain.value !== 0) {
                updateGain(0);
            }
        }
    }
};


//TODO update volume
const updateGain = (value) => {
    if (!contextCreated) {
        createContext();
    }
    while (value > 1) {
        value = value / 10;
    }
    gain.gain.value = value;
    gainBarValue.value = value * 10;
    Howler.volume(value);
};

// document.getElementById("gain-bar").onclick = (e) => {
//     if (context) {
//         const bounds = e.currentTarget.getBoundingClientRect();
//         const percent = ((e.clientX - (bounds.left)) / bounds.width);
//         updateGain(percent);
//     }
// };

// document.getElementById("gain-title").onclick = () => {
//     if (gain.gain.value !== 0) {
//         updateGain(0);
//     } else {
//         updateGain(1);
//     }
// };

audio.onpause = () => {
    pauseBtn.style.display = "none";
    playBtn.style.display = "";
    largePlayIcon.style.opacity = 1;
    largePlayIcon.style.cursor = "pointer";
};

audio.onplay = () => {
    var t = decodeURIComponent(audio.src.substr(audio.src.lastIndexOf('/') + 1, audio.src.lastIndexOf('.') - 1));
    var t = t.substring(0, t.lastIndexOf('.'));

    var trackElem = document.getElementById('track-name');
    trackElem.classList.remove('cssmarquee');
    trackElem.innerHTML = `<span>${t}</span>`;



    songBar.classList.add("animation");
    songBar.style.display = "block";
    pauseBtn.style.display = "";
    playBtn.style.display = "none";
    largePlayIcon.style.opacity = 0;
    largePlayIcon.style.cursor = "";
    if (document.getElementById('track-container').scrollWidth > document.getElementById('track-container').clientWidth) {
        trackElem.classList.add('cssmarquee');
        console.log("Song title is really long... put an animation on it");
        trackElem.innerHTML = `<span>${t}</span><span>${t}</span><span>${t}</span>`;
    }
    document.title = `${t} | JetSetRadioFuture.live `;

};




// on end play next song in the playlist
audio.onended = () => {
    if (shuffleState == 2 && shuffleStations.length != 0) {
        var item = shuffleStations[Math.floor(Math.random() * shuffleStations.length)];
        //load inital settings
        getStationData(item)
            .then((res) => setStation(res))
            .catch((err) => console.log(err));
    }
    currentSongIndex++;
    if (currentSongIndex > currentPlaylist.length - 1) {
        currentSongIndex = 0;
    }
    currentSong = currentPlaylist[currentSongIndex];
    setAudioSrc(currentSong);
    audio.play().catch((e) => {
        /* error handler */
        console.log(e);
    });;
    songBar.classList.remove("animation");
    songBar.style.display = "none";
};

document.getElementById("playbar").onclick = (e) => {
    if (audio.src !== "") {
        const bounds = e.currentTarget.getBoundingClientRect();
        const percent = ((e.clientX - (bounds.left)) / bounds.width);
        audio.currentTime = (percent * audio.duration);
        progressBar.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
        updateDisplayTime();
    }
};

setInterval(() => {
    if (audio.src !== "") {
        updateDisplayTime();
    } else {
        progressBar.style.width = "0%";
    }
}, 5000);

window.onresize = () => {
    createVisualizer();
    var w = window.innerWidth;
    var fileref = document.createElement("link");

    fileref.rel = "stylesheet";
    fileref.type = "text/css";
    if (w < 640 && document.getElementById("mobileCSS") == null) {
        //Load Mobile CSS
        fileref.href = "./styles/sm.css";
        fileref.id = "mobileCSS";
        document.getElementsByTagName("head")[0].appendChild(fileref);
    } else if (w < 768 && document.getElementById("tabletCSS") == null) {
        //Load Tablet CSS
        fileref.href = "./styles/md.css";
        fileref.id = "tabletCSS";
        document.getElementsByTagName("head")[0].appendChild(fileref);
    } else if (w < 1025 && document.getElementById("normalCSS") == null) {
        //Load "normal" CSS
        fileref.href = "./styles/lg.css";
        fileref.id = "normalCSS";
        document.getElementsByTagName("head")[0].appendChild(fileref);
    } else if (document.getElementById("largeCSS") == null) {
        //Load Large screen
        fileref.href = "./styles/xl.css";
        fileref.id = "largeCSS";
        document.getElementsByTagName("head")[0].appendChild(fileref);
    }


};

var lazyLoadInstance = new LazyLoad({
    // Your custom settings go here
});

lazyLoadInstance.update();






const checkOnlineStatus = async() => {
    Offline.check();
    // Create a reference for the Wake Lock.
    let wakeLock = null;

    // create an async function to request a wake lock
    try {
        wakeLock = await navigator.wakeLock.request('screen');
        console.log('Wake Lock is active!');
    } catch (err) {
        // The Wake Lock request has failed - usually system related, such as battery.
        console.log(err);
    }
};

setInterval(async() => {
    await checkOnlineStatus();
}, 60000); //60000 every minute

Offline.options = { // Should we check the connection status immediatly on page load.
    checkOnLoad: false,

    // Should we monitor AJAX requests to help decide if we have a connection.
    interceptRequests: true,

    // Should we automatically retest periodically when the connection is down (set to false to disable).
    reconnect: {
        // How many seconds should we wait before rechecking.
        initialDelay: 3,

        // How long should we wait between retries.
        delay: (1.5, 1)
    },

    // Should we store and attempt to remake requests which fail while the connection is down.
    requests: true,

    // Should we show a snake game while the connection is down to keep the user entertained?
    // It's not included in the normal build, you should bring in js/snake.js in addition to
    // offline.min.js.
    game: false,
    checks: { xhr: { url: '/styles/dots.png' } }
}

Offline.on('up', function() {
    // alert('up');
});
Offline.on('down', function() {
    //alert('down')
});