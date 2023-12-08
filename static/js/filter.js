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











function callback(result) {
    var cxt = canvasClick.getContext("2d");
    var _a = result.categoryMask, width = _a.width, height = _a.height;
    var imageData = cxt.getImageData(0, 0, width, height).data;
    canvasClick.width = width;
    canvasClick.height = height;
    var category = "";
    var mask = result.categoryMask.getAsUint8Array();
    for (var i in mask) {
        if (mask[i] > 0) {
            category = labels[mask[i]];
        }
        if (mask[i] === 0) { // 0은 배경을 나타내는 값이라고 가정합니다.
            imageData[i * 4 + 3] = 0; // 배경 픽셀의 투명도를 0으로 설정합니다.
        }
    }
    var uint8Array = new Uint8ClampedArray(imageData.buffer);
    var dataNew = new ImageData(uint8Array, width, height);
    cxt.putImageData(dataNew, 0, 0);
    var p = event.target.parentNode.getElementsByClassName("classification")[0];
    p.classList.remove("removed");
    p.innerText = "Category: " + category;
}

function callbackForVideo(result) {
    var imageData = canvasCtx.getImageData(0, 0, video.videoWidth, video.videoHeight).data;
    var mask = result.categoryMask.getAsFloat32Array();
    var j = 0;
    for (var i = 0; i < mask.length; ++i) {
        var maskVal = Math.round(mask[i] * 255.0);
        if (maskVal === 0) { // 0은 배경을 나타내는 값이라고 가정합니다.
            imageData[j + 3] = 0; // 배경 픽셀의 투명도를 0으로 설정합니다.
        }
        j += 4;
    }
    var uint8Array = new Uint8ClampedArray(imageData.buffer);
    var dataNew = new ImageData(uint8Array, video.videoWidth, video.videoHeight);
    canvasCtx.putImageData(dataNew, 0, 0);
    if (webcamRunning === true) {
        window.requestAnimationFrame(predictWebcam);
    }
}

document.getElementById('downloadBtn').addEventListener('click', downloadImage);

function downloadImage() {
    var link = document.createElement('a');
    link.download = 'background_removed.png'; // 원하는 파일명을 여기에 입력하세요.
    link.href = canvasClick.toDataURL(); // canvasClick는 배경이 제거된 이미지가 있는 캔버스입니다.
    link.click();
}

let canvas = document.querySelector('.transformer');
let dataURL = canvas.toDataURL("image/png");
document.getElementById('processedImageData').value = dataURL;






/********************************************************************
// Demo 2: Continuously grab image from webcam stream and segmented it.
********************************************************************/
// Check if webcam access is supported.
function hasGetUserMedia() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}
// Get segmentation from the webcam
var lastWebcamTime = -1;
function predictWebcam() {
    return __awaiter(this, void 0, void 0, function () {
        var startTimeMs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (video.currentTime === lastWebcamTime) {
                        if (webcamRunning === true) {
                            window.requestAnimationFrame(predictWebcam);
                        }
                        return [2 /*return*/];
                    }
                    lastWebcamTime = video.currentTime;
                    canvasCtx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                    // Do not segmented if imageSegmenter hasn't loaded
                    if (imageSegmenter === undefined) {
                        return [2 /*return*/];
                    }
                    if (!(runningMode === "IMAGE")) return [3 /*break*/, 2];
                    runningMode = "VIDEO";
                    return [4 /*yield*/, imageSegmenter.setOptions({
                            runningMode: runningMode
                        })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    startTimeMs = performance.now();
                    // Start segmenting the stream.
                    imageSegmenter.segmentForVideo(video, startTimeMs, callbackForVideo);
                    return [2 /*return*/];
            }
        });
    });
}
// Enable the live webcam view and start imageSegmentation.
function enableCam(event) {
    return __awaiter(this, void 0, void 0, function () {
        var constraints, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (imageSegmenter === undefined) {
                        return [2 /*return*/];
                    }
                    if (webcamRunning === true) {
                        webcamRunning = false;
                        enableWebcamButton.innerText = "ENABLE SEGMENTATION";
                    }
                    else {
                        webcamRunning = true;
                        enableWebcamButton.innerText = "DISABLE SEGMENTATION";
                    }
                    constraints = {
                        video: true
                    };
                    // Activate the webcam stream.
                    _a = video;
                    return [4 /*yield*/, navigator.mediaDevices.getUserMedia(constraints)];
                case 1:
                    // Activate the webcam stream.
                    _a.srcObject = _b.sent();
                    video.addEventListener("loadeddata", predictWebcam);
                    return [2 /*return*/];
            }
        });
    });
}
// If webcam supported, add event listener to button.
if (hasGetUserMedia()) {
    enableWebcamButton = document.getElementById("webcamButton");
    enableWebcamButton.addEventListener("click", enableCam);
}
else {
    console.warn("getUserMedia() is not supported by your browser");
}
