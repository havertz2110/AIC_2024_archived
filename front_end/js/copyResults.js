const copyAll = document.querySelector(".copyAll");

copyAll.addEventListener("click", async () => {
    try {
        const frameContainers = document.querySelectorAll(".frameContainer");
        let textToCopy = "";

        frameContainers.forEach(container => {
            const videoName = container.querySelector(".desciptionDetail:nth-child(1) div:nth-child(2)").textContent;
            const frameNumber = container.querySelector(".desciptionDetail:nth-child(3) div:nth-child(2)").textContent;
            textToCopy += `${videoName},${frameNumber}\n`;
        });

        navigator.clipboard.writeText(textToCopy);

        copyAll.textContent = "Copied All ✅⭐";
        setTimeout(() => {
            copyAll.textContent = "Copy All Results";
        }, 400);
    } catch (error) {
        console.log(`Error while fetching data.json: ${error}`);
    }
});