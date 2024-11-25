let m, n;
let ROW = -1, COL = -1;
let row = -1, col = -1;

let array = new Array(7);
let brray = new Array(7);

let board = new Array(7);

let chosing = -1;

const iconList = document.querySelector(".iconList");
const colorList = document.querySelector(".colorList");

function coloring1() {
    let isUsed = false;

    for (let k = 0; k < m + n; k++)
        if (array[row][col][k] === true) {
            isUsed = true;
        }

    if (isUsed === true) {
        const rowDiv = document.getElementById(`0${row}`);
        rowDiv.children[col].classList.remove("unused");
        rowDiv.children[col].classList.add("used");
        board[col][row] = true;
    } else {
        const rowDiv = document.getElementById(`0${row}`);
        rowDiv.children[col].classList.remove("used");
        rowDiv.children[col].classList.add("unused");
        board[col][row] = false;
    }
}

function coloring2() {
    let isUsed = false;

    for (let k = 0; k < m + n; k++)
        if (brray[ROW][COL][k] === true) {
            isUsed = true;
        }

    if (isUsed === true) {
        const rowDiv = document.getElementById(`1${ROW}`);
        rowDiv.children[COL].classList.remove("unused");
        rowDiv.children[COL].classList.add("used");
        board[COL][ROW] = true;
    } else {
        const rowDiv = document.getElementById(`1${ROW}`);
        rowDiv.children[COL].classList.remove("used");
        rowDiv.children[COL].classList.add("unused");
        board[COL][ROW] = false;
    }
}

function changeVal1(id) {
    array[row][col][id] = !array[row][col][id];
    coloring1();
}

function changeVal2(id) {
    brray[ROW][COL][id] = !brray[ROW][COL][id];
    coloring2();
}

function renderIcon1(r, c) {
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

function renderIcon2(r, c) {
    for (let i = 0; i < m + n; i++) {
        if (brray[r][c][i] === true) {
            const child = i < m ? iconList.childNodes[i] : colorList.childNodes[i - m];
            child.classList.add("active");
        } else {
            const child = i < m ? iconList.childNodes[i] : colorList.childNodes[i - m];
            child.classList.remove("active");
        }
    }
}

function check1(r, c) {
    for (let i = 0; i < m + n; i++)
        if (array[r][c][i] === true)
            return true;
    return false;
}

function check2(r, c) {
    for (let i = 0; i < m + n; i++)
        if (brray[r][c][i] === true)
            return true;
    return false;
}

async function prepare1() {
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

    for (let i = 0; i < brray.length; i++) {
        brray[i] = new Array(7);
        board[i] = new Array(7).fill(0);
        for (let j = 0; j < brray[i].length; j++) {
            brray[i][j] = new Array(n + m).fill(0);
        }
    }

    const cells = document.querySelectorAll('.cell');
    const cell2s = document.querySelectorAll('.cell2');

    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            const r = cell.parentElement.id[1];
            const c = cell.id[1];
            row = r;
            col = c;

            cells.forEach(ce => {
                ce.classList.remove("using");
            });

            cell.classList.add("using");
            renderIcon1(r, c);

            chosing = 1;
        });
    });

    cell2s.forEach(cell => {
        cell.addEventListener('click', () => {
            const r = cell.parentElement.id[1];
            const c = cell.id[1];
            ROW = r;
            COL = c;

            cell2s.forEach(ce => {
                ce.classList.remove("using");
            });

            cell.classList.add("using");
            renderIcon2(r, c);

            chosing = 2;
        });
    });

    res.icons.forEach(icon => {
        const iconContainer = document.createElement("div");
        iconContainer.className = "icon";

        iconContainer.addEventListener("click", () => {
            if (chosing === 1) {
                changeVal1(icon.id);
                if (array[row][col][icon.id] === true) {
                    iconContainer.classList.add("active");
                } else {
                    iconContainer.classList.remove("active");
                }
            }
            else {
                changeVal2(icon.id);
                if (brray[ROW][COL][icon.id] === true) {
                    iconContainer.classList.add("active");
                } else {
                    iconContainer.classList.remove("active");
                }
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
            if (chosing === 1) {
                changeVal1(color.id + m);
                if (array[row][col][color.id + m] === true) {
                    colorContainer.classList.add("active");
                } else {
                    colorContainer.classList.remove("active");
                }
            } else {
                changeVal2(color.id + m);
                if (array[row][col][color.id + m] === true) {
                    colorContainer.classList.add("active");
                } else {
                    colorContainer.classList.remove("active");
                }
            };
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
        let odText1 = "";
        let colorText1 = "";
        let odText2 = "";
        let colorText2 = "";

        for (let i = 0; i < 7; i++)
            for (let j = 0; j < 7; j++)
                for (let k = 0; k < m + n; k++) {
                    if (array[i][j][k] === true) {
                        if (k < m) {
                            odText1 = odText1 + CHAR[i] + `${j}` + res.icons[k].label + " ";
                        } else {
                            colorText1 = colorText1 + CHAR[i] + `${j}` + res.colors[k - m].label + " ";
                        }
                    }
                    if (brray[i][j][k] === true) {
                        if (k < m) {
                            odText2 = odText2 + CHAR[i] + `${j}` + res.icons[k].label + " ";
                        } else {
                            colorText2 = colorText2 + CHAR[i] + `${j}` + res.colors[k - m].label + " ";
                        }
                    }
                }

        generateResponses(odText1, colorText1, odText2, colorText2);
    });
}
async function generateResponses(odText1, colorText1, odText2, colorText2) {
    const ocrText1 = document.querySelector("#ocrInput1").value;
    const ocrText2 = document.querySelector("#ocrInput2").value;
    const countText1 = document.querySelector("#countInput1").value;
    const countText2 = document.querySelector("#countInput2").value;
    const mainText1 = document.querySelector("#mainInput1").value;
    const mainText2 = document.querySelector("#mainInput2").value;

    const resultList = await fetch("/search", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query1: {
                main_text: mainText1,
                od_text: odText1,
                color_text: colorText1,
                count_text: countText1,
                ocr_text: ocrText1
            },
            query2: {
                main_text: mainText2,
                od_text: odText2,
                color_text: colorText2,
                count_text: countText2,
                ocr_text: ocrText2
            }
        })
    });

    // const resultList = await fetch("video_scenes.json");

    const responseContainer = document.querySelector(".responseContainer");

    const results = await resultList.json();

    // console.log(results);

    responseContainer.innerHTML = ``;

    results.forEach(result => {
        const videoContainer = document.createElement("div");
        videoContainer.className = "resultVideo";

        const label = document.createElement("p");
        label.textContent = `${result.video_path}`;

        videoContainer.appendChild(label);

        result.frame.forEach(item => {
            const videoFrameContainer = document.createElement("div");
            videoFrameContainer.className = "resultFrame";

            // const imageFrame = document.createElement('img');
            // imageFrame.alt = '';
            // imageFrame.src = `/AIC_Keyframes/${result.videoName.slice(0,3)}_Keyframes/${result.videoName}/${result.videoName}_keyframes/frame_${result.imageName}`;
            // imageContainer.appendChild(imageFrame);

            // const videoFrame = document.c
            const videoFrame = document.createElement("img");
            videoFrame.src = `/AIC_Keyframes/${result.video_path.slice(0,3)}_Keyframes/${result.video_path}/${result.video_path}_keyframes/frame_${item.num}.jpg`;
            videoFrame.alt = ''

            const frameNum = document.createElement("p");
            frameNum.textContent = `Frame: ${item.num}`;

            videoFrameContainer.appendChild(frameNum);
            videoFrameContainer.appendChild(videoFrame);

            // videoContainer.appendChild(videoFrameCont
            videoContainer.appendChild(videoFrameContainer);
        });

        responseContainer.appendChild(videoContainer);
    });
}

prepare1();

