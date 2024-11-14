import cluster from "cluster";
import { cpus } from "os";
import { pid } from "process";

const startCluster = async () => {
  if (cluster.isPrimary) {
    const cpuCount = cpus().length;
    console.log(`Master process ${pid} is starting ${cpuCount} workers`);

    // Fork workers equal to the number of CPUs
    for (let i = 0; i < cpuCount; i++) {
      const worker = cluster.fork();
      worker.on("online", () =>
        console.log(`Worker ${worker.process.pid} started`)
      );
    }
  } else {
    // Each worker imports the main module
    await import("./main");
    console.log(`Worker ${cluster.worker?.id} with pid ${pid} started`);
  }
};

// Initialize the cluster
startCluster();
