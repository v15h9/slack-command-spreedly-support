module.exports = {

    port: int(process.env.PORT) || 5000,
  
    // App behavior
    verbose: bool(process.env.VERBOSE) || false,                    // Log 200s?
    concurrency: int(process.env.CONCURRENCY) || 1,                 // Number of Cluster processes to fork in Server
    worker_concurrency: int(process.env.WORKER_CONCURRENCY) || 1,   // Number of Cluster processes to fork in Worker
    thrifty: bool(process.env.THRIFTY) || false,                    // Web process also executes job queue?
  };
  
  function bool(str) {
    if (str == void 0) return false;
    return str.toLowerCase() === 'true';
  }
  
  function int(str) {
    if (!str) return 0;
    return parseInt(str, 10);
  }
  