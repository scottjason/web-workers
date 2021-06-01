import * as React from 'react';
/* eslint-disable-next-line import/no-webpack-loader-syntax */
import worker from 'workerize-loader!./worker';
import { log, styles } from './logger';

const FIVE_SECONDS = 5000;

const App = () => {
  const [imageUrls, setImageUrls] = React.useState([]);

  const blockMainThread = () => {
    log('Main Thread: Blocked', styles.main);
    let isBlocking = true;
    const startsAt = Date.now();
    while (isBlocking) {
      const now = Date.now();
      if (now - startsAt >= FIVE_SECONDS) {
        isBlocking = false;
        log('Main Thread: Unblocked', styles.main);
      }
    }
  };

  React.useEffect(() => {
    const requestWorker = worker();
    requestWorker.addEventListener('message', e => {
      switch (true) {
        case e.data.method === 'ready':
          const payload = {
            type: 'makeRequest',
          };
          requestWorker.postMessage(payload);
          break;
        case e.data.status === 'requestInFlight':
          blockMainThread();
          break;
        case e.data.status === 'requestComplete':
          setImageUrls(e.data.response);
          break;
        case e.data.status === 'requestError':
          console.log('request error', e.data.error);
          break;
        default:
          break;
      }
    });
  }, []);

  return (
    <>
      <div className='container'>
        <input type='text' placeholder='Type here...' />
        <div className='img-container'>
          {imageUrls.map((url, idx) => {
            return <img key={idx} src={url} alt='' />;
          })}
        </div>
      </div>
    </>
  );
};

export default App;
