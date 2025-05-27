// reader-worker.js
self.onmessage = ({ data }) => {
  const { sab, id } = data;
  const ia = new Int32Array(sab);

  const LOCK = 0;
  const DATA = 1;

  // Acquire read lock: bump reader count if ≥0, else wait
  function acquireRead() {
    for (;;) {
      const state = Atomics.load(ia, LOCK);
      if (state >= 0) {
        if (Atomics.compareExchange(ia, LOCK, state, state + 1) === state) {
          return;
        }
        continue;
      }
      Atomics.wait(ia, LOCK, state);
    }
  }

  // Release read lock: decrement count, wake writer if last reader
  function releaseRead() {
    const prev = Atomics.sub(ia, LOCK, 1);
    if (prev === 1) {
      Atomics.notify(ia, LOCK, 1);
    }
  }

  // Reader: poll every 200ms until DATA ≥ 5
  const readerInterval = setInterval(() => {
    acquireRead();
    const v = ia[DATA];
    console.log(`  [Reader ${id}] sees ${v}`);
    releaseRead();
    if (v >= 5) {
      clearInterval(readerInterval);
      console.log(`  [Reader ${id}] done`);
    }
  }, 200);
};

