function wallpaperSizeAndPosition() {
    var e = "wallpaper",
        t = 1280 / 720;
    document.getElementById(e).style.height = stageHeight + "px", document.getElementById(e).style.width = Math.round(parseInt(document.getElementById("wallpaper").style.height) * t) + "px", document.getElementById(e).style.left = -(parseInt(document.getElementById("wallpaper").style.width) - stageWidth) / 2 + "px", document.getElementById(e).style.top = -(parseInt(document.getElementById("wallpaper").style.height) - stageHeight) / 2 + "px", parseInt(document.getElementById("wallpaper").style.width) < stageWidth && (document.getElementById(e).style.width = stageWidth + "px", document.getElementById(e).style.height = Math.round(parseInt(document.getElementById("wallpaper").style.width) / t) + "px", document.getElementById(e).style.left = -(parseInt(document.getElementById("wallpaper").style.width) - stageWidth) / 2 + "px", document.getElementById(e).style.top = -(parseInt(document.getElementById("wallpaper").style.height) - stageHeight) / 2 + "px");
    e = "wallpaper1", t = 1280 / 720;
    document.getElementById(e).style.width = parseInt(document.getElementById("wallpaper").style.width) + "px", document.getElementById(e).style.height = parseInt(document.getElementById("wallpaper").style.height) + "px", document.getElementById(e).style.left = "0px", document.getElementById(e).style.top = "0px";
    e = "wallpaper2", t = 1280 / 720;
    document.getElementById(e).style.width = parseInt(document.getElementById("wallpaper").style.width) + "px", document.getElementById(e).style.height = parseInt(document.getElementById("wallpaper").style.height) + "px", document.getElementById(e).style.left = "0px", document.getElementById(e).style.top = "0px";
    e = "wallpaper3", t = 1280 / 720;
    document.getElementById(e).style.width = parseInt(document.getElementById("wallpaper").style.width) + "px", document.getElementById(e).style.height = parseInt(document.getElementById("wallpaper").style.height) + "px", document.getElementById(e).style.left = "0px", document.getElementById(e).style.top = "0px";
    e = "wallpaper4", t = 1280 / 720;
    document.getElementById(e).style.width = parseInt(document.getElementById("wallpaper").style.width) + "px", document.getElementById(e).style.height = parseInt(document.getElementById("wallpaper").style.height) + "px", document.getElementById(e).style.left = "0px", document.getElementById(e).style.top = "0px";
    e = "loadingCircle", t = 59 / 110;
    document.getElementById(e).style.width = Math.ceil(32 * magnification) + "px", document.getElementById(e).style.height = Math.ceil(32 * magnification) + "px", document.getElementById(e).style.left = Math.round(stageWidth / 2) - Math.round(parseInt(document.getElementById(e).style.width) / 2) + "px", document.getElementById(e).style.top = Math.round(stageHeight / 2) - Math.round(parseInt(document.getElementById(e).style.height) / 2) + "px"
}

function animateStatic() {
    requestAnimationFrame(animateStatic), animationStep += .2, 4 < animationStep && (animationStep = 1), selectedFrame = Math.round(animationStep), 1 == selectedFrame && (document.getElementById("wallpaper").style.transform = "scale(1, 1)", document.getElementById("wallpaper").style.MozTransform = "scale(1, 1)", document.getElementById("wallpaper").style.WebkitTransform = "scale(1, 1)"), 2 == selectedFrame && (document.getElementById("wallpaper").style.transform = "scale(1, -1)", document.getElementById("wallpaper").style.MozTransform = "scale(1, -1)", document.getElementById("wallpaper").style.WebkitTransform = "scale(1, -1)"), 3 == selectedFrame && (document.getElementById("wallpaper").style.transform = "scale(-1, 1)", document.getElementById("wallpaper").style.MozTransform = "scale(-1, 1)", document.getElementById("wallpaper").style.WebkitTransform = "scale(-1, 1)"), 4 == selectedFrame && (document.getElementById("wallpaper").style.transform = "scale(-1, -1)", document.getElementById("wallpaper").style.MozTransform = "scale(-1, -1)", document.getElementById("wallpaper").style.WebkitTransform = "scale(-1, -1)")
}
document.getElementById("loadingCircle").style.opacity = 0, animationStep = 1;
var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

function changeStaticColor() {
    selectedStatic++, 4 < selectedStatic && (selectedStatic = 1), document.getElementById("wallpaper1").style.visibility = "hidden", document.getElementById("wallpaper2").style.visibility = "hidden", document.getElementById("wallpaper3").style.visibility = "hidden", document.getElementById("wallpaper4").style.visibility = "hidden", 1 == selectedStatic && (document.getElementById("wallpaper1").style.visibility = "visible"), 2 == selectedStatic && (document.getElementById("wallpaper2").style.visibility = "visible"), 3 == selectedStatic && (document.getElementById("wallpaper3").style.visibility = "visible"), 4 == selectedStatic && (document.getElementById("wallpaper4").style.visibility = "visible")
}

function wallpaperRuntime() {
    allSizeAndPositionFunctionsList[allSizeAndPositionFunctionsList.length] = wallpaperSizeAndPosition, allSizeAndPositionFunctionsList[allSizeAndPositionFunctionsList.length - 1](), animateStatic(), changeStaticColor()
}
document.getElementById("wallpaper1").style.visibility = "hidden", document.getElementById("wallpaper2").style.visibility = "hidden", document.getElementById("wallpaper3").style.visibility = "hidden", document.getElementById("wallpaper4").style.visibility = "hidden", selectedStatic = Math.floor(4 * Math.random() + 1), allRuntimeFunctionsList[allRuntimeFunctionsList.length] = wallpaperRuntime;