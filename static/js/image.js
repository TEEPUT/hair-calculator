"use strict";
// Copyright 2023 The MediaPipe Authors.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//      http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
import * as tasks_vision_0_10_2_1 from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.2";
// Get DOM elements
var video = document.getElementById("webcam");
var canvasElement = document.getElementById("canvas");
var canvasCtx = canvasElement.getContext("2d");
var webcamPredictions = document.getElementById("webcamPredictions");
var demosSection = document.getElementById("demos");
var enableWebcamButton;
var webcamRunning = false;
var videoHeight = "360px";
var videoWidth = "480px";
var runningMode = "IMAGE";
var resultWidthHeigth = 256;
var imageSegmenter;
var labels;
var legendColors = [
    [255, 197, 0, 255],
    [128, 62, 117, 255],
    [255, 104, 0, 255],
    [166, 189, 215, 255],
    [193, 0, 32, 255],
    [206, 162, 98, 255],
    [129, 112, 102, 255],
    [0, 125, 52, 255],
    [246, 118, 142, 255],
    [0, 83, 138, 255],
    [255, 112, 92, 255],
    [83, 55, 112, 255],
    [255, 142, 0, 255],
    [179, 40, 81, 255],
    [244, 200, 0, 255],
    [127, 24, 13, 255],
    [147, 170, 0, 255],
    [89, 51, 21, 255],
    [241, 58, 19, 255],
    [35, 44, 22, 255],
    [0, 161, 194, 255] // Vivid Blue
];


var createImageSegmenter = function () { return __awaiter(void 0, void 0, void 0, function () {
    var audio;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, tasks_vision_0_10_2_1.FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.2/wasm")];
            case 1:
                audio = _a.sent();
                return [4 /*yield*/, tasks_vision_0_10_2_1.ImageSegmenter.createFromOptions(audio, {
                        baseOptions: {
                            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/image_segmenter/hair_segmenter/float32/latest/hair_segmenter.tflite",
                            delegate: "CPU"
                        },
                        runningMode: runningMode,
                        outputCategoryMask: true,
                        outputConfidenceMasks: false
                    })];
            case 2:
                imageSegmenter = _a.sent();
                labels = imageSegmenter.getLabels();
                demosSection.classList.remove("invisible");
                return [2 /*return*/];
        }
    });
}); };


createImageSegmenter();
var imageContainers = document.getElementsByClassName("segmentOnClick");
// Add click event listeners for the img elements.
for (var i = 0; i < imageContainers.length; i++) {
    imageContainers[i]
        .getElementsByTagName("img")[0]
        .addEventListener("click", handleClick);
}
/**
 * Demo 1: Segmented images on click and display results.
 */

// 선택된 이미지의 파일 이름을 저장할 전역 변수
var selectedFilename;
var currentPage = 1; // 현재 페이지를 추적하는 변수

// 이미지를 선택하는 함수
function selectImage(filename) {
  selectedFilename = filename;
  var compositeImageElement = document.getElementById('compositeImage');
  if (compositeImageElement) {
    compositeImageElement.src = 'uploads/' + filename;
  } else {
    console.error('compositeImageElement is null');
  }
}

function fetchImages(page) {
  fetch(`/get-images?page=${page}`, {
    method: 'GET'
  })
  .then(response => response.json())
  .then(data => {
    var table = document.getElementById('imagesTableBody');
    table.innerHTML = '';

    // 데이터가 5개 미만이면 '다음' 버튼 비활성화
    document.getElementById('nextPage').disabled = data.length < 5;

    data.forEach((row, index) => {
      var tr = document.createElement('tr');
      var buttonId = `select-button-${index}`;
      tr.innerHTML = `
        <td>${row.number}</td>
        <td>${row.filename}</td>
        <td>${row.id}</td>
        <td>${row.business_registration_number}</td>
        <td>${row.style}</td>
        <td><button id="${buttonId}">선택</button></td>
      `;
      table.appendChild(tr);

      document.getElementById(buttonId).addEventListener('click', () => selectImage(row.filename));
    });
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

document.addEventListener('DOMContentLoaded', () => fetchImages(currentPage));

// debounce 함수 정의
function debounce(func, wait) {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// fetchImages 함수에 debounce 적용
const fetchImagesDebounced = debounce(function(page) {
  fetchImages(page);
}, 500);

// 다음 페이지 버튼 이벤트
document.getElementById('nextPage').addEventListener('click', () => {
  currentPage += 1;
  fetchImagesDebounced(currentPage);
});

// 이전 페이지 버튼 이벤트
document.getElementById('prevPage').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage -= 1;
    fetchImagesDebounced(currentPage);
    document.getElementById('nextPage').disabled = false; // 이전 페이지로 돌아갈 경우 '다음' 버튼을 다시 활성화
  }
});


var compositeCanvas = document.getElementById('canvas');





var canvasClick;
function handleClick(event) {
    return __awaiter(this, void 0, void 0, function () {
        var cxt;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Do not segmented if imageSegmenter hasn't loaded
                    if (imageSegmenter === undefined) {
                        return [2 /*return*/];
                    }
                    canvasClick = event.target.parentElement.getElementsByTagName("canvas")[0];
                    canvasClick.classList.remove("removed");
                    canvasClick.width = event.target.naturalWidth;
                    canvasClick.height = event.target.naturalHeight;
                    cxt = canvasClick.getContext("2d");
                    cxt.clearRect(0, 0, canvasClick.width, canvasClick.height);
                    cxt.drawImage(event.target, 0, 0, canvasClick.width, canvasClick.height);
                    event.target.style.opacity = 0;
                    if (!(runningMode === "VIDEO")) return [3 /*break*/, 2];
                    runningMode = "IMAGE";
                    return [4 /*yield*/, imageSegmenter.setOptions({
                            runningMode: runningMode
                        })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    // imageSegmenter.segment() when resolved will call the callback function.
                    imageSegmenter.segment(event.target, callback);
                    return [2 /*return*/];
            }
        });
    });
}


// 다른 이미지를 합성할 때 사용할 새로운 함수
function compositeImage(sourceCanvas, targetCanvas, mask) {
    var targetCtx = targetCanvas.getContext('2d');
    var targetImageData = targetCtx.getImageData(0, 0, targetCanvas.width, targetCanvas.height);

    var sourceCtx = sourceCanvas.getContext('2d');
    var sourceImageData = sourceCtx.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);

    for (var i = 0; i < mask.length; i++) {
        if (mask[i] !== 0) { // 머리카락 부분에 해당하는 마스크 값이면
            targetImageData.data[i * 4] = sourceImageData.data[i * 4]; // R
            targetImageData.data[i * 4 + 1] = sourceImageData.data[i * 4 + 1]; // G
            targetImageData.data[i * 4 + 2] = sourceImageData.data[i * 4 + 2]; // B
            // Alpha 값은 마스크에 따라 결정됩니다 (이미 마스크에서 설정되어 있음)
        }
    }
    targetCtx.putImageData(targetImageData, 0, 0);
}

var compositeImageElement = new Image();


function callback(result) {
  compositeImageElement.onload = function() {
    document.getElementById('buttonContainer').style.display = 'block';
};
    compositeImageElement.src = 'uploads/' + selectedFilename; // 합성할 이미지를 불러옵니다.
}


compositeImageElement.onload = function() {
    // 이미지가 로드되면 오버레이 캔버스에 그립니다.
    redrawCompositeImage();
};

function redrawCompositeImage() {
    // 오버레이 캔버스를 초기화합니다.
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    
    var scaledWidth = compositeImageElement.width * compositeScale;
    var scaledHeight = compositeImageElement.height * compositeScale;
    overlayCtx.drawImage(compositeImageElement, compositeImageX, compositeImageY, scaledWidth, scaledHeight);
}



// 전역 변수로 조정 값을 설정합니다.
var compositeImageX = 0; // 합성 이미지의 X 위치
var compositeImageY = 0; // 합성 이미지의 Y 위치
var compositeScale = 1.0;



// 크기 조절 함수
function resizeCompositeImage(scaleFactor) {
    compositeScale *= scaleFactor;
    redrawCompositeImage(); // 캔버스에 이미지를 다시 그립니다.
  }
  
  // 위치 조절 함수
  function moveCompositeImage(deltaX, deltaY) {
    compositeImageX += deltaX;
    compositeImageY += deltaY;
    redrawCompositeImage(); // 캔버스에 이미지를 다시 그립니다.
  }
  
  // 이벤트 리스너
  document.getElementById('moveLeft').addEventListener('click', function() {
    moveCompositeImage(-10, 0);
  });
  document.getElementById('moveRight').addEventListener('click', function() {
    moveCompositeImage(10, 0);
  });
  document.getElementById('moveUp').addEventListener('click', function() {
    moveCompositeImage(0, -10);
  });
  document.getElementById('moveDown').addEventListener('click', function() {
    moveCompositeImage(0, 10);
  });
  document.getElementById('increaseSize').addEventListener('click', function() {
    resizeCompositeImage(1.05);
  });
  document.getElementById('decreaseSize').addEventListener('click', function() {
    resizeCompositeImage(0.95);
  });


var overlayCanvas = document.querySelector('.overlayCanvas');
overlayCanvas.style.width = '100%'; // or another size to fit the screen
overlayCanvas.style.height = 'auto'; // maintain aspect ratio

var overlayCtx = overlayCanvas.getContext('2d');
overlayCtx.drawImage(compositeImageElement, 0, 0, overlayCanvas.width, overlayCanvas.height);

var canvas = document.getElementById('canvas');
canvas.width = 3000; // 실제 드로잉 버퍼의 너비를 2배로 설정
canvas.height = 3000; // 실제 드로잉 버퍼의 높이를 2배로 설정

overlayCanvas.width = canvasElement.width;
overlayCanvas.height = canvasElement.height;
overlayCanvas.style.position = "absolute";
overlayCanvas.style.left = canvasElement.offsetLeft + 'px';
overlayCanvas.style.top = canvasElement.offsetTop + 'px';
overlayCanvas.style.pointerEvents = 'none'; // 이 캔버스 위의 이벤트를 무시하고, 밑에 있는 캔버스로 통과시킵니다.


var overlayCanvas = document.getElementById('overlayCanvas');
overlayCanvas.style.width = '300%';
overlayCanvas.style.height = 'auto';
overlayCanvas.style.position = 'absolute';
overlayCanvas.style.left = '0px';
overlayCanvas.style.top = '0px';
overlayCanvas.style.pointerEvents = 'none';


function startRepeat(button, func) {
    // func를 주기적으로 실행합니다.
    var intervalId = setInterval(func, 100); // 100ms 간격으로 반복
  
    // 버튼에서 손을 떼면 반복을 멈춥니다.
    function stopRepeat() {
      clearInterval(intervalId);
      button.removeEventListener('mouseup', stopRepeat);
      button.removeEventListener('mouseleave', stopRepeat);
    }
  
    button.addEventListener('mouseup', stopRepeat);
    button.addEventListener('mouseleave', stopRepeat);
  }
  
  // 각 버튼의 기능에 따라 적절한 함수를 호출합니다.
  document.getElementById('increaseSize').addEventListener('mousedown', function() {
    startRepeat(this, function() { resizeCompositeImage(1.05); });
  });
  
  document.getElementById('decreaseSize').addEventListener('mousedown', function() {
    startRepeat(this, function() { resizeCompositeImage(0.95); });
  });
  
  document.getElementById('moveLeft').addEventListener('mousedown', function() {
    startRepeat(this, function() { moveCompositeImage(-10, 0); });
  });
  
  document.getElementById('moveRight').addEventListener('mousedown', function() {
    startRepeat(this, function() { moveCompositeImage(10, 0); });
  });
  
  document.getElementById('moveUp').addEventListener('mousedown', function() {
    startRepeat(this, function() { moveCompositeImage(0, -10); });
  });
  
  document.getElementById('moveDown').addEventListener('mousedown', function() {
    startRepeat(this, function() { moveCompositeImage(0, 10); });
  });

  