import React, { useState } from 'react';
import BG from '../images/bg.svg';
import ImageCrop from './ImageCrop';
import Button from '@mui/joy/Button';
import ChevronRight from '@mui/icons-material/ChevronRight';
import aiImage from '../images/testImg/img3.png';
import loading from '../images/pulse.gif';

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
    const newImage = {
      croppedImageUrl: loading,
    };
    setImage(newImage);
    fetch('/api/generate/image/createVariation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image }),
    })
      .then((res) => res.json())
      .then((data) => {
        const newImage = {
          croppedImageUrl: `data:image/png;base64,${data.data[0].b64_json}`,
        };
        setImage(newImage);
        // console.log(data);
      });
  };

  const addToGallary = (e) => {
    e.preventDefault();
    fetch('/api/cards/variate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageUrl: image.croppedImageUrl,
      }),
    })
      .then((d) => {
        console.log('response d on line 234', d);
        if (d.status === 401) window.location.href = '/login';
        if (d.status !== 200) {
          setError(true);
        }
        window.location.href = '/cards';
      })
      .catch((e) => {
        console.log(
          'error caught in line 243 in the fetch request on createcardpage'
        );
        setError(true);
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
      <div className='alterButtons'>
        <Button variant='soft' onClick={submitToVariate}>
          Alter
        </Button>
        <Button variant='soft' onClick={addToGallary}>
          Save
        </Button>
      </div>

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
