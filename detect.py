import cv2
import sys
import datetime
import numpy as np
from matplotlib import pyplot as plt


start = datetime.datetime.now()
img = cv2.imread(sys.argv[1],1)
img_gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
img2 = img_gray.copy()

# All the 6 methods for comparison in a list
methods = ['cv2.TM_CCOEFF_NORMED']#, 'cv2.TM_CCOEFF_NORMED', 'cv2.TM_CCORR',
          #  'cv2.TM_CCORR_NORMED', 'cv2.TM_SQDIFF', 'cv2.TM_SQDIFF_NORMED']

for meth in methods:
    img = img2.copy()
    method = eval(meth)

    # Apply template Matching
    print('[')
    for i in range(9):
        template = cv2.imread('/Applications/XAMPP/xamppfiles/htdocs/repo/esport-video-hack/objects/obj'+str(i+1)+'.jpg',0)
       
        #template_gray = cv2.cvtColor(template, cv2.COLOR_BGR2GRAY)
        w, h = template.shape[::-1]

        res = cv2.matchTemplate(img,template,method)
        #print(res)
        threshold = 0.8
        loc = np.where( res >= threshold)
        for pt in zip(*loc[::-1]):
            #print('xx')  
            print('{id:' +str(i+1)+',width:'+str(w)+',height:'+str(h)+',point:'  +str(pt)+"},")
            cv2.rectangle(img, pt, (pt[0] + w, pt[1] + h), (0,100,255), 10)

    print(']')

    end = datetime.datetime.now()
    print(str(end-start))
    plt.subplot(121),plt.imshow(res,cmap = 'gray')
    plt.title('Matching Result'), plt.xticks([]), plt.yticks([])
    plt.subplot(122),plt.imshow(img,cmap = 'gray')
    plt.title('Detected Point'), plt.xticks([]), plt.yticks([])
    plt.suptitle(meth)

   # plt.show()