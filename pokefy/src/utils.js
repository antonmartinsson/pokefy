// limits number to max
export const clamp = (num, max) => Math.min(Math.max(num, 0), max);

// sleep for [time] milliseconds
export const sleep = time =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, time);
  });
