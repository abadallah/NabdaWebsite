import os
import cv2 as cv
import numpy as np
import imageio
import matplotlib.pyplot as plt
import scipy.ndimage as ndi
# from keras.utils import normalize
from keras.models import  load_model
import sys

ImgName=""

def get_model():
  # Model With  Epoch: 9 Accuracy: 0.8426 Val_accuracy: 0.8074
  unet_model = load_model('HDT_Segmentation.hdf5')
  return unet_model

def format_and_render_plot(image, title = "Image", cmap_type = "gray"):
  '''Custom function to simplify common formatting operations for exercises. Operations include: 
  1. Turning off axis grids.
  2. Calling `plt.tight_layout` to improve subplot spacing.
  3. Calling `plt.show()` to render plot.'''
  fig = plt.gcf()
  for ax in fig.axes:
    ax.axis('off')    
  plt.tight_layout()
  plt.subplot(233)
  plt.imshow(image, cmap= cmap_type)
  plt.title(title)
  plt.savefig("Out_img/"+ImgName+".png")
  
  
def get_image(Path):
  # Read Image
  Img = imageio.imread(Path)
  # RGB Image
  if len(Img.shape) == 3:
    # Convert RGB Image to Gray Image
    Img = cv.cvtColor(Img, cv.COLOR_RGB2GRAY)

    # Resize Image to Match with Model (Height, Width)
    Img = cv.resize(Img, (128,128))

    # Normalizing Image to Match with Model Dimension
    Img = np.expand_dims(Img, 0)
    # Gray Image
  else:
    # Resize Image to Match with Model (Height, Wigth)
    Img = cv.resize(Img, (128,128))
    
    # Normalizing Image to Match with Model Dimension
    Img = np.expand_dims(Img, 0)
  return Img


if __name__ == '__main__':
    ImgName=sys.argv[1]
    print(ImgName)
    img=get_image('Input_img/'+ImgName)
    model=get_model()
    prediction = (model.predict(img)[0,:,:,0] > 0.2).astype(np.uint8)
    format_and_render_plot(prediction, 'Image Result')


