import cv2
import numpy as np
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
from skimage import io
from itertools import compress

class DominantColors:
    CLUSTERS = None
    IMAGE = None
    COLORS = None
    LABELS = None

    def __init__(self, image, clusters=3):
        self.CLUSTERS = clusters
        img = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        self.IMAGE = img.reshape((img.shape[0] * img.shape[1], 3))

        # k-means 알고리즘을 사용하여 픽셀을 클러스터링합니다.
        kmeans = KMeans(n_clusters=self.CLUSTERS)
        kmeans.fit(self.IMAGE)

        # 클러스터 중심이 우리의 지배적인 색상입니다.
        self.COLORS = kmeans.cluster_centers_
        self.LABELS = kmeans.labels_

    def rgb_to_hex(self, rgb):
        return '#%02x%02x%02x' % (int(rgb[0]), int(rgb[1]), int(rgb[2]))

    # 가장 자주 나타나는 색상의 순서대로 정렬된 목록을 반환합니다.
    def getHistogram(self):
        numLabels = np.arange(0, self.CLUSTERS + 1)
        # 빈도수를 계산하기 위한 테이블을 생성합니다.
        (hist, _) = np.histogram(self.LABELS, bins=numLabels)
        hist = hist.astype("float")
        hist /= hist.sum()

        colors = self.COLORS
        # 빈도수에 따라 내림차순으로 정렬합니다.
        colors = colors[(-hist).argsort()]
        hist = hist[(-hist).argsort()]
        for i in range(self.CLUSTERS):
            colors[i] = colors[i].astype(int)
        # 파란색 마스크를 제거합니다.
        fil = [colors[i][2] < 250 and colors[i][0] > 10 for i in range(self.CLUSTERS)]
        colors = list(compress(colors, fil))
        return colors, hist

    def plotHistogram(self):
        colors, hist = self.getHistogram()
        # 빈 차트를 생성합니다.
        chart = np.zeros((50, 500, 3), np.uint8)
        start = 0

        # 색상 사각형을 생성합니다.
        for i in range(len(colors)):
            end = start + hist[i] * 500
            r, g, b = colors[i]
            # 색상을 플롯하기 위해 cv2.rectangle을 사용합니다.
            cv2.rectangle(chart, (int(start), 0), (int(end), 50), (r, g, b), -1)
            start = end

        # 차트를 표시합니다.
        plt.figure()
        plt.axis("off")
        plt.imshow(chart)
        plt.show()

        return colors
