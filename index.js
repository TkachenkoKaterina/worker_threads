import { Worker } from 'worker_threads';
import path from 'path';

const __dirname = process.cwd(); // Get the current working directory

const totalThreads = 4;
const combinationsPerThread = 250;
let results = [];

console.log('Main thread is running...');

for (let i = 0; i < totalThreads; i++) {
  const start = i * combinationsPerThread;
  const end = start + combinationsPerThread;
  const worker = new Worker(path.resolve(__dirname, 'worker.js'), {
    workerData: { start, end },
  });

  worker.on('message', data => {
    results = results.concat(data);
    if (results.length === 1000) {
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
