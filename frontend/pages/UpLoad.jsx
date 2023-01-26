import React from 'react';
import BG from '../images/bg.svg';
import Button from '@mui/joy/Button';
import loading from '../images/loading.gif';

function UpLoad() {
  return (
    <div className='CreateCard'>
      <div className='CreateImg'>
        <BG className='background' />
        <div> empty space</div>
        <div className='imgDisplay'>
          <div className='img-result'>
            <div className='loading'>
              <img src={loading} />
              <h1>loading</h1>
            </div>
          </div>
        </div>
        <div className='Next'>
          <Button variant='soft'>upload</Button>
        </div>
      </div>
    </div>
  );
}

export default UpLoad;
