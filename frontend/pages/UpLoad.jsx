import React, { useState } from 'react';
import BG from '../images/bg.svg';
import ImageCrop from './ImageCrop';
import Button from '@mui/joy/Button';
import ChevronRight from '@mui/icons-material/ChevronRight';
import aiImage from '../images/testImg/img3.png';

const initData = {
  id: 1,
  imageUrl: 'https://i.imgur.com/k170R.png',
  croppedImageUrl: null,
};

function UpLoad() {
  const [image, setImage] = useState({});
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
    const uploadedImage = { ...image };
    uploadedImage.imageUrl = URL.createObjectURL(event.target.files[0]);
    setImage(uploadedImage);
  };

  const submitToVariate = (e) => {
    e.preventDefault();
    fetch('/api/generate/image/createVariation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(initData),
    })
      .then((res) => res.json())
      .then((data) => {
        setImage(data);
      });
  };

  return (
    <div className='Upload'>
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
      <label for='file-upload' class='custom-file'>
        <i class='fa fa-cloud-upload'></i>
        Upload
      </label>
      <input
        id='file-upload'
        type='file'
        accept='image/*'
        name='myImage'
        onChange={onImageUpload}
      />
      <Button variant='soft' onClick={submitToVariate}>
        Alter
      </Button>
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
