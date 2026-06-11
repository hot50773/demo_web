const express = require('express');
const router = express.Router();

// Memory store to hold references for memory stress
const memoryStore = [];

/**
 * CPU Stress: Heavy computation (Fibonacci)
 * Query params: n (number of iterations, default 40)
 */
router.get('/cpu', (req, res) => {
  const n = parseInt(req.query.n) || 40;
  
  const fibonacci = (num) => {
    if (num <= 1) return num;
    return fibonacci(num - 1) + fibonacci(num - 2);
  };

  const start = Date.now();
  const result = fibonacci(n);
  const duration = Date.now() - start;

  res.json({
    type: 'CPU Stress',
    input: n,
    result: result,
    duration_ms: duration
  });
});

/**
 * Memory Stress: Allocate memory in heap
 * Query params: mb (Megabytes to allocate, default 50)
 */
router.get('/memory', (req, res) => {
  const mb = parseInt(req.query.mb) || 50;
  
  // Allocate memory by creating a large buffer
  const buffer = Buffer.alloc(mb * 1024 * 1024, 'X');
  memoryStore.push(buffer); // Keep reference to prevent GC

  res.json({
    type: 'Memory Stress',
    allocated_mb: mb,
    total_allocated_count: memoryStore.length,
    process_memory_usage: process.memoryUsage()
  });
});

/**
 * Memory Clear: Release allocated memory
 */
router.get('/memory/clear', (req, res) => {
  memoryStore.length = 0;
  if (global.gc) {
    global.gc();
  }
  res.json({
    message: 'Memory store cleared',
    process_memory_usage: process.memoryUsage()
  });
});

/**
 * I/O Stress: Simulate latency
 * Query params: delay (ms, default 2000)
 */
router.get('/io', async (req, res) => {
  const delay = parseInt(req.query.delay) || 2000;
  
  await new Promise(resolve => setTimeout(resolve, delay));

  res.json({
    type: 'I/O Stress',
    delay_ms: delay
  });
});

/**
 * Error Stress: Random or forced errors
 * Query params: rate (0-1, default 1)
 */
router.get('/error', (req, res) => {
  const rate = parseFloat(req.query.rate) || 1.0;
  const isError = Math.random() <= rate;

  if (isError) {
    res.status(500).json({
      type: 'Error Stress',
      status: 'failed',
      message: 'Simulated internal server error'
    });
  } else {
    res.json({
      type: 'Error Stress',
      status: 'success',
      message: 'Lucky day! No error triggered'
    });
  }
});

/**
 * Concurrency Stress: Long-lived connection
 * Query params: duration (ms, default 10000)
 */
router.get('/concurrency', (req, res) => {
  const duration = parseInt(req.query.duration) || 10000;
  
  // Keep connection open but don't block event loop
  setTimeout(() => {
    if (!res.writableEnded) {
      res.json({
        type: 'Concurrency Stress',
        duration_ms: duration,
        message: 'Connection closed after duration'
      });
    }
  }, duration);
});

module.exports = router;
