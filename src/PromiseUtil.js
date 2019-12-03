export const PromiseAllWithProgress = (proms, progress_cb) => {
  let d = 0;
  progress_cb(0);
  const onCompleted = () => {
    d ++;
    progress_cb(d/proms.length);
  }
  for (const p of proms) {
    p.then(onCompleted, onCompleted);
  }
  return Promise.all(proms);
}