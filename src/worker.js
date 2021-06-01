import { log, styles } from './logger';

export const requestWorker = () => {
  const makeRequest = () => {
    log('Background Thread: Request Started', styles.worker);
    const payload = {
      status: 'requestInFlight',
    };
    postMessage(payload);
    fetch('https://dog.ceo/api/breeds/image/random/10').then(
      promise => {
        promise.json().then(response => {
          const { message } = response;
          log('Background Thread: Request Complete', styles.worker);
          console.log(message);
          const payload = {
            response: message,
            status: 'requestComplete',
          };
          postMessage(payload);
        });
      },
      error => {
        const payload = {
          error,
          status: 'requestError',
        };
        postMessage(payload);
      }
    );
  };
  onmessage = e => {
    switch (true) {
      case e.data?.type === 'makeRequest':
        makeRequest();
        break;
      default:
        break;
    }
  };
};

requestWorker();
