document.querySelector(".blur").addEventListener("click", () => {
    document.querySelector(".videoController").style.display = "none";
    document.querySelector(".searchToolContainer").style.display = "none";
    document.querySelector(".blur").style.display = "none";
    document.querySelector(".video").pause();
});

document.querySelector(".exitVideo").addEventListener("click", () => {
    document.querySelector(".videoController").style.display = "none";
    document.querySelector(".blur").style.display = "none";
    document.querySelector(".video").pause();
});

document.querySelector(".goBack").addEventListener("click", () => {
    document.querySelector(".videoController").style.display = "none";
    document.querySelector(".blur").style.display = "none";
    document.querySelector(".video").pause();
});

document.querySelector(".videoSearch").addEventListener("click", () => {
    const videoName = document.querySelector(".nameInput").value;
    const frameInput = document.querySelector(".frameInput").value;
    const fpsInput = document.querySelector(".fpsInput").value;

    const video = document.querySelector(".video");
    video.src = `/AIC_Video/${videoName}.mp4`;
    video.currentTime = (frameInput / fpsInput).toFixed(3);
    video.autoplay = false;
})