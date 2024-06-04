import { parentPort, workerData } from "worker_threads";
import bcrypt from "bcryptjs";

const { start, end } = workerData;
const hashes = [];

for (let i = start; i < end; i++) {
  const combination = i.toString().padStart(3, "0"); // Generate combinations 000-999
  const hash = bcrypt.hashSync(combination, 10);
  hashes.push({ combination, hash });
}

parentPort.postMessage(hashes);
