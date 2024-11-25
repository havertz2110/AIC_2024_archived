document.querySelector(".searchTool").addEventListener("click", () => {
    document.querySelector(".searchToolContainer").style.display = "block";
    document.querySelector(".blur").style.display = "block";
});

document.querySelector(".quitSearch").addEventListener("click", () => {
    document.querySelector(".searchToolContainer").style.display = "none";
    document.querySelector(".blur").style.display = "none";
});