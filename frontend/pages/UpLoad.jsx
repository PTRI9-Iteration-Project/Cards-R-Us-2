import React, { useState } from 'react';
import BG from '../images/bg.svg';
import ImageCrop from './ImageCrop';

const initData = {
  id: 1,
  imageUrl: 'https://i.imgur.com/k170R.png',
  croppedImageUrl: null,
};

function UpLoad() {
  const [image, setImage] = useState(initData);
  const [selectedImage, setSelectedImage] = useState(null);

  const onCancel = () => {
    setSelectedImage(null);
  };

  const setCroppedImageFor = (id, crop, zoom, aspect, croppedImageUrl) => {
    const newImage = { ...image, croppedImageUrl, crop, zoom, aspect };
    setImage(newImage);
    setSelectedImage(null);
  };

  const resetImage = (id) => {
    setCroppedImageFor(id);
  };

  const onImageUpload = (event) => {
    const uploadedImage = {...image}
    uploadedImage.imageUrl = URL.createObjectURL(event.target.files[0])
    setImage(uploadedImage)
  }

  return (
    <div className='CreateCard'>
      <BG className='background' />
      {selectedImage ? (
        <ImageCrop
          id={selectedImage.id}
          imageUrl={selectedImage.imageUrl}
          cropInit={selectedImage.crop}
          zoomInit={selectedImage.zoom}
          aspectInit={selectedImage.aspect}
          onCancel={onCancel}
          setCroppedImageFor={setCroppedImageFor}
          resetImage={resetImage}
        />
      ) : null}
        <div>upload</div>
        <input type='file' accept='image/*' name='myImage' onChange={onImageUpload}/>
      {/* Displays the current step */}
      {/* <div>upload</div> */}
      {/* <input type='file' name='myImage' /> */}
      <div className='imageCard'>
        <img
          src={image.croppedImageUrl ? image.croppedImageUrl : image.imageUrl}
          alt=''
          onClick={() => setSelectedImage(image)}
        />
      </div>
    </div>
  );
}

export default UpLoad;
