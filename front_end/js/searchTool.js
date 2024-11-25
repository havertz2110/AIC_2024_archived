let m, n;
let row = -1, col = -1;
let array = new Array(7);
let board = new Array(7);

const iconList = document.querySelector(".iconList");
const colorList = document.querySelector(".colorList");

function coloring() {
    let isUsed = false;

    for (let k = 0; k < m + n; k++)
        if (array[row][col][k] === true) {
            isUsed = true;
        }

    if (isUsed === true) {
        const rowDiv = document.getElementById(`${row}`);
        rowDiv.children[col].classList.remove("unused");
        rowDiv.children[col].classList.add("used");
        board[col][row] = true;
    } else {
        const rowDiv = document.getElementById(`${row}`);
        rowDiv.children[col].classList.remove("used");
        rowDiv.children[col].classList.add("unused");
        board[col][row] = false;
    }
}

function changeVal(id) {
    array[row][col][id] = !array[row][col][id];
    coloring();
}

function renderIcon(r, c) {
    for (let i = 0; i < m + n; i++) {
        if (array[r][c][i] === true) {
            const child = i < m ? iconList.childNodes[i] : colorList.childNodes[i - m];
            child.classList.add("active");
        } else {
            const child = i < m ? iconList.childNodes[i] : colorList.childNodes[i - m];
            child.classList.remove("active");
        }
    }
}

function check(r, c) {
    for (let i = 0; i < m + n; i++)
        if (array[r][c][i] === true)
            return true;
    return false;
}

async function prepare() {
    const response = await fetch("icon.json");
    const res = await response.json();

    m = res.icons.length;
    n = res.colors.length;

    for (let i = 0; i < array.length; i++) {
        array[i] = new Array(7);
        board[i] = new Array(7).fill(0);
        for (let j = 0; j < array[i].length; j++) {
            array[i][j] = new Array(n + m).fill(0);
        }
    }

    const cells = document.querySelectorAll('.cell');

    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            const r = cell.parentElement.id;
            const c = cell.id[1];
            row = r;
            col = c;

            cells.forEach(ce => {
                ce.classList.remove("using");
            });

            cell.classList.add("using");
            renderIcon(r, c);
        });
    });

    res.icons.forEach(icon => {
        const iconContainer = document.createElement("div");
        iconContainer.className = "icon";

        iconContainer.addEventListener("click", () => {
            changeVal(icon.id);
            if (array[row][col][icon.id] === true) {
                iconContainer.classList.add("active");
            } else {
                iconContainer.classList.remove("active");
            }
        });

        const image = document.createElement("img");
        image.src = icon.path;
        image.alt = icon.label;

        iconContainer.appendChild(image);
        iconList.appendChild(iconContainer);
    });

    res.colors.forEach(color => {
        const colorContainer = document.createElement("div");
        colorContainer.className = "icon";

        colorContainer.addEventListener("click", () => {
            changeVal(color.id + m);
            if (array[row][col][color.id + m] === true) {
                colorContainer.classList.add("active");
            } else {
                colorContainer.classList.remove("active");
            }
        });

        const image = document.createElement("img");
        image.src = color.path;
        image.alt = color.label;

        colorContainer.appendChild(image);
        colorList.appendChild(colorContainer);
    });

    const submit = document.querySelector(".submitReq");
    submit.addEventListener("click", async () => {
        let CHAR = ["a", "b", "c", "d", "e", "f", "g"];
        let odText = "";
        let colorText = "";

        for (let i = 0; i < 7; i++)
            for (let j = 0; j < 7; j++)
                for (let k = 0; k < m + n; k++) {
                    if (array[i][j][k] === true) {
                        if (k < m) {
                            odText = odText + CHAR[i] + `${j}` + res.icons[k].label + " ";
                        } else {
                            colorText = colorText + CHAR[i] + `${j}` + res.colors[k - m].label + " ";
                        }
                    }
                }

        document.querySelector(".searchToolContainer").style.display = "none";
        document.querySelector(".blur").style.display = "none";

        generateResponses(odText, colorText);
    });
}

async function generateResponses(odText, colorText) {
    const ocrText = document.querySelector("#ocrInput").value;
    const countText = document.querySelector("#countInput").value;
    const mainText = document.querySelector("#mainInput").value;

    console.log(mainText, odText, colorText, ocrText, countText);

    const resultList = await fetch("/search", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            main_text: mainText,
            od_text: odText,
            color_text: colorText,
            count_text: countText,
            ocr_text: ocrText
        })
    });

    // const resultList = await fetch("response.json");

    const results = await resultList.json();

    const responseContainer = document.querySelector(".responseContainer");
    responseContainer.innerHTML = ``;

    results.answers.forEach(result => {
        const frameContainer = document.createElement("div");
        frameContainer.className = "frameContainer";

        let videoName = result.videoName;
        let frameSecond = (parseInt(result.imageName.substring(0, result.imageName.lastIndexOf('.'))) / result.fps).toFixed(3);
        let frameNumber = parseInt(result.imageName.substring(0, result.imageName.lastIndexOf('.')));

        const imageContainer = document.createElement('div');
        imageContainer.classList.add('imageContainer');

        const imageFrame = document.createElement('img');
        imageFrame.alt = '';
        imageFrame.src = `/AIC_Keyframes/${result.videoName.slice(0,3)}_Keyframes/${result.videoName}/${result.videoName}_keyframes/frame_${result.imageName}`;
        imageContainer.appendChild(imageFrame);

        const description = document.createElement('div');
        description.classList.add('description');

        const createDesciptionDetail = (label, content) => {
            const detail = document.createElement('div');
            detail.classList.add('desciptionDetail');
            detail.style.padding = '5px';
            detail.style.borderRadius = '5px';
            detail.style.display = 'flex';
            detail.style.flexDirection = 'column';
            detail.style.justifyContent = 'center';
            detail.style.alignItems = 'center';
            detail.style.gap = '5px';

            const labelElement = document.createElement('div');
            labelElement.style.fontWeight = 'bold';
            labelElement.textContent = label;

            const contentElement = document.createElement('div');
            contentElement.textContent = content;

            detail.appendChild(labelElement);
            detail.appendChild(contentElement);

            return detail;
        };

        const videoDetail = createDesciptionDetail('Video', result.videoName);
        const secondDetail = createDesciptionDetail('Second', `${frameSecond}s`);
        const frameDetail = createDesciptionDetail('Frame', frameNumber);

        const copyDetail = document.createElement('div');
        copyDetail.classList.add('desciptionDetail', 'copyDetail');
        copyDetail.style.padding = '5px';
        copyDetail.style.borderRadius = '5px';
        copyDetail.style.display = 'flex';
        copyDetail.style.flexDirection = 'column';
        copyDetail.style.justifyContent = 'center';
        copyDetail.style.alignItems = 'center';
        copyDetail.style.gap = '5px';

        const copyLabel = document.createElement('div');
        copyLabel.style.fontWeight = 'bold';
        copyLabel.textContent = 'Copy';

        const copyIcon = document.createElement('img');
        copyIcon.alt = 'copy';
        copyIcon.src = 'icons/copy.svg';
        copyIcon.width = 20;
        copyIcon.height = 20;

        copyDetail.appendChild(copyLabel);
        copyDetail.appendChild(copyIcon);

        description.appendChild(videoDetail);
        description.appendChild(secondDetail);
        description.appendChild(frameDetail);
        description.appendChild(copyDetail);

        frameContainer.appendChild(imageContainer);
        frameContainer.appendChild(description);

        imageContainer.addEventListener("click", () => {
            document.querySelector(".videoController").style.display = "flex";
            document.querySelector(".blur").style.display = "block";
            createVideo(videoName, frameSecond, frameNumber, result.fps);
        });

        const copyDetails = frameContainer.querySelector('.copyDetail');

        copyDetails.addEventListener('click', () => {
            const textToCopy = `${result.videoName},${parseInt(result.imageName.substring(0, result.imageName.lastIndexOf('.')))}`;
            navigator.clipboard.writeText(textToCopy);

            copyLabel.textContent = "Copied";
            setTimeout(() => { copyLabel.textContent = "Copy"; }, 400);
        });

        responseContainer.appendChild(frameContainer);
    });
}

async function createVideo(videoName, frameSecond, frameNumber, fps) {
    const video = document.querySelector(".video");
    video.src = `/AIC_Video/Videos_${videoName.slice(0,3)}/video/${videoName}.mp4`;
    video.currentTime = frameSecond;
    video.autoplay = false;

    document.querySelector(".playVideo").addEventListener("click", () => {
        video.play();
    });

    document.querySelector(".stopVideo").addEventListener("click", () => {
        video.pause();
    });

    createFrames(videoName, frameNumber, fps);
}

async function createFrames(videoName, frameNumber, fps) {
    const framesContainer = document.querySelector(".videoDetails");
    const keyframesData = await fetch("keyframe_path.json").then(response => response.json());
    // console.log(keyframesData)
    // console.log(videoName)
    const frameList = keyframesData[videoName];
    // console.log(frameList)

    // console.log(frameNumber)
    const frameIndex = frameList.indexOf(frameNumber);
    framesContainer.innerHTML = "";
    // console.log(frameIndex)
    for (let i = Math.max(frameIndex - 10, 0); i <= Math.min(frameIndex + 10, frameList.length); i++) {
        // console.log(i)
        const framer = document.createElement("div");
        framer.className = "framer";

        const label = document.createElement("p");
        label.textContent = `Frame: ${frameList[i]}`;

        const video = document.createElement("img");
        video.src = `/AIC_Keyframes/${videoName.slice(0,3)}_Keyframes/${videoName}/${videoName}_keyframes/frame_${frameList[i]}.jpg`;
        video.alt = ''
        // video.src = `/AIC_Video/${videoName}.mp4`;
        // video.currentTime = frameList[i] / fps;
        // video.autoplay = false;

        // console.log(frame)
        framer.appendChild(label);
        framer.appendChild(video);
        framesContainer.appendChild(framer);
    }
}

prepare();

