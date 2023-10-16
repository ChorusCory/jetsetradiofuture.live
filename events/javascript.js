function interruptionSizeAndPosition() {
    var e = "interruption",
        t = 1280 / 720;
    document.getElementById(e).style.width = .6 * stageWidth + "px", document.getElementById(e).style.height = Math.round(parseInt(document.getElementById(e).style.width) / t) + "px", document.getElementById(e).style.top = Math.round(stageHeight / 2) - Math.round(parseInt(document.getElementById(e).style.height) / 2) + "px", document.getElementById(e).style.left = Math.round(stageWidth / 2) - Math.round(parseInt(document.getElementById(e).style.width) / 2) + "px", parseInt(document.getElementById(e).style.height) > .6 * stageHeight && (document.getElementById(e).style.height = .6 * stageHeight + "px", document.getElementById(e).style.width = Math.round(parseInt(document.getElementById(e).style.height) * t) + "px", document.getElementById(e).style.top = Math.round(stageHeight / 2) - Math.round(parseInt(document.getElementById(e).style.height) / 2) + "px", document.getElementById(e).style.left = Math.round(stageWidth / 2) - Math.round(parseInt(document.getElementById(e).style.width) / 2) + "px"), 400 < parseInt(document.getElementById(e).style.width) && (document.getElementById(e).style.width = "400px", document.getElementById(e).style.height = Math.round(parseInt(document.getElementById(e).style.width) / t) + "px", document.getElementById(e).style.top = Math.round(stageHeight / 2) - Math.round(parseInt(document.getElementById(e).style.height) / 2) + "px", document.getElementById(e).style.left = Math.round(stageWidth / 2) - Math.round(parseInt(document.getElementById(e).style.width) / 2) + "px")
}

function displayRequestinterruption() {
    document.getElementById("interruption").style.visibility = "visible", setTimeout(function() {
        document.getElementById("interruption").style.visibility = "hidden"
    }, 4500)
}

function popupSizeAndPosition(e) {
    var t = "popupContent";
    document.getElementById(t).style.width = .9 * stageWidth + "px", 500 < parseInt(document.getElementById(t).style.width) && (document.getElementById(t).style.width = "500px"), document.getElementById(t).style.top = .75 * parseInt(document.getElementById("radioButton").style.height) + "px", document.getElementById(t).style.left = "0px";
    t = "popupBar";
    document.getElementById(t).style.height = .75 * parseInt(document.getElementById("radioButton").style.height) + "px", document.getElementById(t).style.width = parseInt(document.getElementById("popupContent").style.width) + "px", document.getElementById(t).style.top = "0px", document.getElementById(t).style.left = "0px", document.getElementById(t).style.backgroundColor = "#ffffff";
    t = "popupTitle";
    document.getElementById(t).style.height = parseInt(document.getElementById("popupBar").style.height) + "px", document.getElementById(t).style.width = Math.round(4.8 * parseInt(document.getElementById(t).style.height)) + "px", document.getElementById(t).style.top = "0px", document.getElementById(t).style.left = "0px";
    t = "closePopupButton";
    document.getElementById(t).style.height = parseInt(document.getElementById("popupBar").style.height) + "px", document.getElementById(t).style.width = Math.round(+parseInt(document.getElementById(t).style.height)) + "px", document.getElementById(t).style.top = "0px", document.getElementById(t).style.left = parseInt(document.getElementById("popupBar").style.width) - parseInt(document.getElementById(t).style.width) + "px";
    t = "popup";
    document.getElementById(t).style.width = parseInt(document.getElementById("popupContent").style.width) + "px", document.getElementById(t).style.height = parseInt(document.getElementById("popupBar").style.height) + document.getElementById("popupContent").offsetHeight + "px", 1 == repositionPopup && (document.getElementById(t).style.top = Math.round(stageHeight / 2) - Math.round(parseInt(document.getElementById(t).style.height) / 2) + "px", document.getElementById(t).style.left = Math.round(stageWidth / 2) - Math.round(parseInt(document.getElementById(t).style.width) / 2) + "px");
    t = "popupClickHereButton";
    document.getElementById(t).style.height = 1.2 * parseInt(document.getElementById("popupBar").style.height) + "px", document.getElementById(t).style.width = Math.round(parseInt(document.getElementById(t).style.height) * (962 / 236)) + "px", document.getElementById(t).style.top = parseInt(document.getElementById("popup").style.height) - parseInt(document.getElementById(t).style.height) + "px", document.getElementById(t).style.left = parseInt(document.getElementById("popup").style.width) - parseInt(document.getElementById(t).style.width) + "px"
}

function showPopup(e, t) {
    document.getElementById("popup").style.visibility = "hidden", document.getElementById("popupClickHereButton").style.visibility = "hidden", randomCacheNumber = Math.floor(999999999 * Math.random() + 1), document.getElementById("popupContent").src = "", document.getElementById("popupContent").src = e + "?" + randomCacheNumber, document.getElementById("popupContent").onload = function() {
        document.getElementById("popup").style.visibility = "visible", popupSizeAndPosition(), document.getElementById("popupClickHereButton").style.visibility = "hidden", "empty" !== t && (document.getElementById("popupClickHereButton").style.visibility = "visible", document.getElementById("clickHereLink").setAttribute("href", t)), repositionPopup = !1
    }
}

function hidePopup() {
    document.getElementById("popup").style.visibility = "hidden", document.getElementById("popupClickHereButton").style.visibility = "hidden", document.getElementById("popupContent").src = ""
}
var startingMouseXPos, startingMouseYPos, startingImageXPos, startingImageYPos;

function definePopupButtons() {
    var e = "closePopupButton";
    "ontouchmove" in document.documentElement ? document.getElementById(e).ontouchstart = function(e) {
        hidePopup(), e.preventDefault()
    } : document.getElementById(e).onmousedown = function(e) {
        hidePopup()
    };
    e = "popup";
    "ontouchmove" in document.documentElement ? (document.getElementById(e).ontouchstart = function(e) {
        retrieveMousePositions(e), startingMouseXPos = mouseX, startingMouseYPos = mouseY, startingImageXPos = parseInt(document.getElementById("popup").style.left), startingImageYPos = parseInt(document.getElementById("popup").style.top), allowDragging = !0
    }, document.getElementById(e).ontouchend = function(e) {
        allowDragging = !1
    }, document.getElementById(e).ontouchmove = function(e) {
        1 == allowDragging && (retrieveMousePositions(e), differenceX = startingMouseXPos - mouseX, differenceY = startingMouseYPos - mouseY, document.getElementById("popup").style.left = startingImageXPos - differenceX + "px", document.getElementById("popup").style.top = startingImageYPos - differenceY + "px"), e.preventDefault()
    }) : (document.getElementById(e).onmousedown = function(e) {
        retrieveMousePositions(e), startingMouseXPos = mouseX, startingMouseYPos = mouseY, startingImageXPos = parseInt(document.getElementById("popup").style.left), startingImageYPos = parseInt(document.getElementById("popup").style.top), allowDragging = !0
    }, document.getElementById(e).onmouseup = function(e) {
        allowDragging = !1
    }, document.getElementById(e).onmouseout = function(e) {
        allowDragging = !1
    }, document.getElementById(e).onmousemove = function(e) {
        1 == allowDragging && (retrieveMousePositions(e), differenceX = startingMouseXPos - mouseX, differenceY = startingMouseYPos - mouseY, document.getElementById("popup").style.left = startingImageXPos - differenceX + "px", document.getElementById("popup").style.top = startingImageYPos - differenceY + "px")
    })
}

function screenSizeAndPosition() {
    var e = "screen";
    document.getElementById(e).style.width = .9 * stageWidth + "px", document.getElementById(e).style.left = stageWidth / 2 - document.getElementById(e).offsetWidth / 2 + "px", document.getElementById(e).style.top = stageHeight / 2 - document.getElementById(e).offsetHeight / 2 + "px", 500 < parseInt(document.getElementById(e).style.width) && (document.getElementById(e).style.width = "500px", document.getElementById(e).style.left = stageWidth / 2 - document.getElementById(e).offsetWidth / 2 + "px", document.getElementById(e).style.top = stageHeight / 2 - document.getElementById(e).offsetHeight / 2 + "px")
}

function screenSizeAndPositionOLD() {
    var e = "screen",
        t = 1600 / 900;
    document.getElementById(e).style.width = stageWidth - Math.round(25 * magnification) - Math.round(25 * magnification) + "px", document.getElementById(e).style.height = Math.round(parseInt(document.getElementById(e).style.width) / t) + "px", document.getElementById(e).style.top = Math.round(stageHeight / 2) - Math.round(parseInt(document.getElementById(e).style.height) / 2) + "px", document.getElementById(e).style.left = Math.round(stageWidth / 2) - Math.round(parseInt(document.getElementById(e).style.width) / 2) + "px", parseInt(document.getElementById(e).style.height) > stageHeight && (document.getElementById(e).style.height = stageHeight + "px", document.getElementById(e).style.width = Math.round(parseInt(document.getElementById(e).style.height) * t) + "px", document.getElementById(e).style.top = Math.round(stageHeight / 2) - Math.round(parseInt(document.getElementById(e).style.height) / 2) + "px", document.getElementById(e).style.left = Math.round(stageWidth / 2) - Math.round(parseInt(document.getElementById(e).style.width) / 2) + "px"), 600 < parseInt(document.getElementById(e).style.width) && (document.getElementById(e).style.width = "600px", document.getElementById(e).style.height = Math.round(parseInt(document.getElementById(e).style.width) / t) + "px", document.getElementById(e).style.top = Math.round(stageHeight / 2) - Math.round(parseInt(document.getElementById(e).style.height) / 2) + "px", document.getElementById(e).style.left = Math.round(stageWidth / 2) - Math.round(parseInt(document.getElementById(e).style.width) / 2) + "px")
}

function showScreen(e) {
    randomCacheNumber = Math.floor(999999999 * Math.random() + 1), document.getElementById("screen").src = "", document.getElementById("screen").src = e + "?" + randomCacheNumber, document.getElementById("screen").onload = function() {
        document.getElementById("screen").style.visibility = "visible", screenSizeAndPosition(), autoHideScreen = setTimeout(function() {
            hideScreen()
        }, 2e4)
    }
}

function hideScreen() {
    document.getElementById("screen").style.visibility = "hidden", clearTimeout(autoHideScreen)
}

function defineScreenButton() {
    var e = "screen";
    "ontouchmove" in document.documentElement ? document.getElementById(e).ontouchstart = function(e) {
        hideScreen(), e.preventDefault()
    } : document.getElementById(e).onmousedown = function(e) {
        hideScreen(), e.preventDefault()
    }
}

function animatedWallpaperSizeAndPosition() {
    var e = "animatedWallpaper";
    document.getElementById(e).style.height = stageHeight + "px", document.getElementById(e).style.width = "auto", document.getElementById(e).style.left = stageWidth / 2 - document.getElementById(e).offsetWidth / 2 + "px", document.getElementById(e).style.top = stageHeight / 2 - document.getElementById(e).offsetHeight / 2 + "px", document.getElementById(e).offsetWidth < stageWidth && (document.getElementById(e).style.width = stageWidth + "px", document.getElementById(e).style.height = "auto", document.getElementById(e).style.left = stageWidth / 2 - document.getElementById(e).offsetWidth / 2 + "px", document.getElementById(e).style.top = stageHeight / 2 - document.getElementById(e).offsetHeight / 2 + "px")
}

function animatedWallpaperSizeAndPositionOLD() {
    var e = "animatedWallpaper",
        t = 1280 / 720;
    document.getElementById(e).style.height = stageHeight + "px", document.getElementById(e).style.width = Math.round(parseInt(document.getElementById(e).style.height) * t) + "px", document.getElementById(e).style.left = -(parseInt(document.getElementById(e).style.width) - stageWidth) / 2 + "px", document.getElementById(e).style.top = -(parseInt(document.getElementById(e).style.height) - stageHeight) / 2 + "px", parseInt(document.getElementById(e).style.width) < stageWidth && (document.getElementById(e).style.width = stageWidth + "px", document.getElementById(e).style.height = Math.round(parseInt(document.getElementById(e).style.width) / t) + "px", document.getElementById(e).style.left = -(parseInt(document.getElementById(e).style.width) - stageWidth) / 2 + "px", document.getElementById(e).style.top = -(parseInt(document.getElementById(e).style.height) - stageHeight) / 2 + "px")
}

function showAnimatedWallpaper(e) {
    randomCacheNumber = Math.floor(999999999 * Math.random() + 1), document.getElementById("animatedWallpaper").src = "", document.getElementById("animatedWallpaper").src = e + "?" + randomCacheNumber
}

function hideAnimatedWallpaper() {
    document.getElementById("animatedWallpaper").style.visibility = "hidden", clearTimeout(autoHideAnimatedWallpaper)
}

function xmlString(e) {
    return window.ActiveXObject ? e.xml : (new XMLSerializer).serializeToString(e)
}

function loadEvents() {
    console.log("Loading EVENTS..."), eventsxhttp = new XMLHttpRequest, randomCacheNumber = Math.floor(999999999 * Math.random() + 1), eventsxhttp.open("GET", "events/events.xml?" + randomCacheNumber, !0), eventsxhttp.send(), eventsxhttp.onreadystatechange = function() {
        4 == eventsxhttp.readyState && void 0 !== eventsxhttp.responseXML && (eventsXMLDocument = eventsxhttp.responseXML, eventType = eventsXMLDocument.getElementsByTagName("eventType")[0].childNodes[0].nodeValue, eventVar1 = eventsXMLDocument.getElementsByTagName("eventVar1")[0].childNodes[0].nodeValue, eventVar2 = eventsXMLDocument.getElementsByTagName("eventVar2")[0].childNodes[0].nodeValue, newEventID = eventType + eventVar1 + eventVar2, newEventID !== lastEventID && (console.log("DETECTED EVENT: " + eventType), checkEvents(), lastEventID = eventType + eventVar1 + eventVar2))
    }
}

function checkEvents() {
    "REQUEST" == eventType && 1 == flagSongRequests && "OFF" == tvFrame_switchStatus && (forceTrack(eventVar1, eventVar2), displayRequestinterruption()), "POPUP" == eventType && "OFF" == tvFrame_switchStatus && (popupBanner = eventVar1, popupLink = eventVar2, showPopup(popupBanner, popupLink)), "SCREEN" == eventType && "OFF" == tvFrame_switchStatus && (screenLink = eventVar1, showScreen(screenLink)), "WALLPAPER" == eventType && "OFF" == tvFrame_switchStatus && (animatedWallpaperLink = eventVar1, showAnimatedWallpaper(animatedWallpaperLink)), "STICKY" == eventType && "OFF" == tvFrame_switchStatus && change_wallpaperImage(eventVar1)
}

function beginEventsLoading() {
    "ON" != radio_switchStatus && "ON" != wallFrame_switchStatus || loadEvents(), setTimeout(function() {
        beginEventsLoading()
    }, 7003)
}

function eventsRuntime() {
    allSizeAndPositionFunctionsList[allSizeAndPositionFunctionsList.length] = interruptionSizeAndPosition, allSizeAndPositionFunctionsList[allSizeAndPositionFunctionsList.length - 1](), allSizeAndPositionFunctionsList[allSizeAndPositionFunctionsList.length] = popupSizeAndPosition, allSizeAndPositionFunctionsList[allSizeAndPositionFunctionsList.length - 1](), definePopupButtons(), allSizeAndPositionFunctionsList[allSizeAndPositionFunctionsList.length] = screenSizeAndPosition, allSizeAndPositionFunctionsList[allSizeAndPositionFunctionsList.length - 1](), defineScreenButton(), allSizeAndPositionFunctionsList[allSizeAndPositionFunctionsList.length] = animatedWallpaperSizeAndPosition, allSizeAndPositionFunctionsList[allSizeAndPositionFunctionsList.length - 1]()
}
document.getElementById("interruption").style.visibility = "hidden", document.getElementById("popup").style.visibility = "hidden", repositionPopup = !0, allowDragging = !0, document.getElementById("screen").style.visibility = "hidden", document.getElementById("animatedWallpaper").style.visibility = "hidden", document.getElementById("animatedWallpaper").onload = function() {
    document.getElementById("animatedWallpaper").style.visibility = "visible", animatedWallpaperSizeAndPosition(), autoHideAnimatedWallpaper = setTimeout(function() {
        hideAnimatedWallpaper()
    }, 2e4)
}, newEventID = "EMPTY", lastEventID = "", allRuntimeFunctionsList[allRuntimeFunctionsList.length] = eventsRuntime;