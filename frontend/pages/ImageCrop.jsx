import React, { useState } from 'react';
import BG from '../images/bg.svg';
import Cropper from 'react-easy-crop';
import getCroppedImg from './croppedImage';
import Button from '@mui/joy/Button';

const aspectRatios = [{ value: 1 / 1, text: '1/1' }];

function ImageCrop({
  id,
  imageUrl,
  cropInit,
  zoomInit,
  aspectInit,
  onCancel,
  setCroppedImageFor,
  resetImage,
}) {
  if (zoomInit == null) {
    zoomInit = 1;
  }
  if (cropInit == null) {
    cropInit = { x: 0, y: 0 };
  }
  if (aspectInit == null) {
    aspectInit = aspectRatios[0];
  }

  const [zoom, setZoom] = useState(zoomInit);
  const [crop, setCrop] = useState(cropInit);
  const [aspect, setAspect] = useState(aspectInit);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = (crop) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom) => {
    setZoom(zoom);
  };

  const onAspectChange = (e) => {
    const value = e.target.value;
    const ratio = aspectRatios.find((ratio) => ratio.value == value);
    setAspect(ratio);
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const onCrop = async () => {
    const croppedImageUrl = await getCroppedImg(imageUrl, croppedAreaPixels);
    setCroppedImageFor(id, crop, zoom, aspect, croppedImageUrl);
  };

  const onResetImage = () => {
    resetImage(id);
  };

  return (
    <div>
      {/* <BG className='background' /> */}
      <div className='backdrop'></div>
      <div className='crop-container'>
        <Cropper
          image={imageUrl}
          zoom={zoom}
          crop={crop}
          aspect={aspect.value}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onCropComplete={onCropComplete}
        />
      </div>
      <div className='controls'>
        <div className='controls-upper-area'>
          <input
            type='range'
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onInput={(e) => {
              onZoomChange(e.target.value);
            }}
            className='slider'></input>
          <select onChange={onAspectChange}>
            {aspectRatios.map((ratio) => (
              <option
                key={ratio.text}
                // value={ratio.value}
                value={ratio.value === aspect.value}>
                {ratio.text}
              </option>
            ))}
          </select>
        </div>
        <div className='button-area'>
          <Button variant='soft' onClick={onCancel}>
            Cancel
          </Button>
          <Button variant='soft' onClick={onResetImage}>
            Reset
          </Button>
          <Button variant='soft' onClick={onCrop}>
            Crop
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ImageCrop;
