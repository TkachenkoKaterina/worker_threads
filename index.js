import { Worker } from 'worker_threads';
import path from 'path';

const __dirname = process.cwd();

const totalThreads = 4;
const combinationsPerThread = 250;
let results = [];

console.log('Main thread is running...');

for (let i = 0; i < totalThreads; i++) {
  const start = i * combinationsPerThread;
  const end = (i + 1) * combinationsPerThread;
  const worker = new Worker(path.resolve(__dirname, 'worker.js'), {
    workerData: { start, end },
  });

  worker.on('message', data => {
    results = results.concat(data);
    if (results.length === totalThreads * combinationsPerThread) {
      console.log('All threads have finished processing.');
      console.log(results);
    }
  });

  worker.on('error', err => {
    console.error('Worker error:', err);
  });
  worker.on('exit', code => {
    if (code !== 0) {
      console.error(`Worker stopped with exit code ${code}`);
    }
  });
}
