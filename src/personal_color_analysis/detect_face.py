# coding: utf-8
# 필요한 패키지를 가져옵니다
from imutils import face_utils
import numpy as np
import dlib
import cv2
import matplotlib.pyplot as plt

class DetectFace:
    def __init__(self, image):
        # dlib의 얼굴 검출기(HOG 기반)를 초기화하고 얼굴 특징점 예측기를 생성합니다
        self.detector = dlib.get_frontal_face_detector()
        self.predictor = dlib.shape_predictor('../res/shape_predictor_68_face_landmarks.dat')

        # 얼굴 부위 검출을 위한 이미지를 읽어옵니다
        self.img = cv2.imread(image)

        # 얼굴 부위 초기화
        self.face_parts = []
        self.left_cheek = None  # 왼쪽 볼
        self.right_cheek = None  # 오른쪽 볼

        # 얼굴 부위를 검출하고 변수를 설정합니다
        self.detect_face_part()

    # 반환 형식: np.array
    def detect_face_part(self):
        self.face_parts = []

        # 흑백 이미지에서 얼굴을 검출합니다
        rect = self.detector(cv2.cvtColor(self.img, cv2.COLOR_BGR2GRAY), 1)[0]

        # 얼굴 영역에 대한 얼굴 특징점을 찾은 후 NumPy 배열로 변환합니다
        shape = self.predictor(cv2.cvtColor(self.img, cv2.COLOR_BGR2GRAY), rect)
        shape = face_utils.shape_to_np(shape)

        # 개별적으로 얼굴 부위를 반복합니다
        for (name, (i, j)) in face_utils.FACIAL_LANDMARKS_IDXS.items():
            self.face_parts.append(shape[i:j])

        # 필요한 얼굴 부위만 선택합니다
        self.face_parts = self.face_parts[1:5]

        # 변수 설정
        self.right_eyebrow = self.extract_face_part(self.face_parts[0])
        self.left_eyebrow = self.extract_face_part(self.face_parts[1])
        self.right_eye = self.extract_face_part(self.face_parts[2])
        self.left_eye = self.extract_face_part(self.face_parts[3])

        # 왼쪽 볼과 오른쪽 볼 설정
        self.left_cheek = self.img[shape[29][1]:shape[33][1], shape[4][0]:shape[48][0]]
        self.right_cheek = self.img[shape[29][1]:shape[33][1], shape[54][0]:shape[12][0]]

    # 매개변수 예시: self.right_eye
    # 반환 형식: 이미지
    def extract_face_part(self, face_part_points):
        (x, y, w, h) = cv2.boundingRect(face_part_points)
        crop = self.img[y:y+h, x:x+w]
        adj_points = np.array([np.array([p[0]-x, p[1]-y]) for p in face_part_points])

        # 마스크 생성
        mask = np.zeros((crop.shape[0], crop.shape[1]))
        cv2.fillConvexPoly(mask, adj_points, 1)
        mask = mask.astype(np.bool)
        crop[np.logical_not(mask)] = [255, 0, 0]

        return crop
