import os
import cv2 as cv
import numpy as np
import imageio
import matplotlib.pyplot as plt
import scipy.ndimage as ndi
# from keras.utils import normalize
from keras.models import  load_model
import sys
# import tensorflow as tf
import keras
from keras.models import Model
from keras.callbacks import ModelCheckpoint, LearningRateScheduler, EarlyStopping, TensorBoard, ReduceLROnPlateau
from keras.layers import Input, concatenate, Conv2D, MaxPooling2D, UpSampling2D, Reshape, core, Dropout, Activation, Flatten, Lambda, BatchNormalization
from keras.layers import *
import random
ImgName=""


def Create_Model():
    inputs = Input((128, 128, 1))
    s = Lambda(lambda x: x / 255)(inputs)
    #Contraction path
    c1 = Conv2D(16, (3, 3), activation='relu', kernel_initializer='he_normal', padding='same')(s)
    c1 = Dropout(0.1)(c1)
    c1 = Conv2D(16, (3, 3), activation='relu', kernel_initializer='he_normal', padding='same')(c1)
    p1 = MaxPooling2D((2, 2))(c1)
    
    c2 = Conv2D(32, (3, 3), activation='relu', kernel_initializer='he_normal', padding='same')(p1)
    c2 = Dropout(0.1)(c2)
    c2 = Conv2D(32, (3, 3), activation='relu', kernel_initializer='he_normal', padding='same')(c2)
    p2 = MaxPooling2D((2, 2))(c2)
     
    c3 = Conv2D(64, (3, 3), activation='relu', kernel_initializer='he_normal', padding='same')(p2)
    c3 = Dropout(0.2)(c3)
    c3 = Conv2D(64, (3, 3), activation='relu', kernel_initializer='he_normal', padding='same')(c3)
    p3 = MaxPooling2D((2, 2))(c3)
     
    c4 = Conv2D(128, (3, 3), activation='relu', kernel_initializer='he_normal', padding='same')(p3)
    c4 = Dropout(0.2)(c4)
    c4 = Conv2D(128, (3, 3), activation='relu', kernel_initializer='he_normal', padding='same')(c4)
    p4 = MaxPooling2D(pool_size=(2, 2))(c4)
     
    c5 = Conv2D(256, (3, 3), activation='relu', kernel_initializer='he_normal', padding='same')(p4)
    c5 = Dropout(0.3)(c5)
    c5 = Conv2D(256, (3, 3), activation='relu', kernel_initializer='he_normal', padding='same')(c5)
    u6 = Conv2DTranspose(128, (2, 2), strides=(2, 2), padding='same')(c5)
    u6 = concatenate([u6, c4])
    c6 = Conv2D(128, (3, 3), activation='relu', kernel_initializer='he_normal', padding='same')(u6)
    c6 = Dropout(0.2)(c6)
    c6 = Conv2D(128, (3, 3), activation='relu', kernel_initializer='he_normal', padding='same')(c6)
     
    u7 = Conv2DTranspose(64, (2, 2), strides=(2, 2), padding='same')(c6)
    u7 = concatenate([u7, c3])
    c7 = Conv2D(64, (3, 3), activation='relu', kernel_initializer='he_normal', padding='same')(u7)
    c7 = Dropout(0.2)(c7)
    c7 = Conv2D(64, (3, 3), activation='relu', kernel_initializer='he_normal', padding='same')(c7)
     
    u8 = Conv2DTranspose(32, (2, 2), strides=(2, 2), padding='same')(c7)
    u8 = concatenate([u8, c2])
    c8 = Conv2D(32, (3, 3), activation='relu', kernel_initializer='he_normal', padding='same')(u8)
    c8 = Dropout(0.1)(c8)
    c8 = Conv2D(32, (3, 3), activation='relu', kernel_initializer='he_normal', padding='same')(c8)
     
    u9 = Conv2DTranspose(16, (2, 2), strides=(2, 2), padding='same')(c8)
    u9 = concatenate([u9, c1], axis=3)
    c9 = Conv2D(16, (3, 3), activation='relu', kernel_initializer='he_normal', padding='same')(u9)
    c9 = Dropout(0.1)(c9)
    c9 = Conv2D(16, (3, 3), activation='relu', kernel_initializer='he_normal', padding='same')(c9)
    outputs = Conv2D(1, (1, 1), activation='sigmoid')(c9)
    model = Model(inputs=[inputs], outputs=[outputs])
    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

    return model




def format_and_render_plot(image, title = "Image", cmap_type = "gray"):
  '''Custom function to simplify common formatting operations for exercises. Operations include: 
  1. Turning off axis grids.
  2. Calling `plt.tight_layout` to improve subplot spacing.
  3. Calling `plt.show()` to render plot.'''
  fig = plt.gcf()
  rund= random.randint(1,5000)

  for ax in fig.axes:
    ax.axis('off')    
  plt.tight_layout()
  plt.imshow(image, cmap= cmap_type)
   
  plt.xticks([]), plt.yticks([])
  for spine in plt.gca().spines.values():
        spine.set_visible(False)
  ImgName="result"
  plt.savefig('Out_img/'+ImgName)
  return ImgName+str(rund)+".png"
  
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



def main():
    ImgName=sys.argv[1]

    img=get_image('Input_img/'+ImgName)
    model =Create_Model()
    model.load_weights('HDT_Segmentation_W.hdf5')
    prediction = (model.predict(img)[0,:,:,0] > 0.2).astype(np.uint8)   
    NewImgName= format_and_render_plot(prediction)
    return NewImgName

if __name__ == '__main__':
    x= main()
    sys.stdout.write(x)
    sys.exit()

