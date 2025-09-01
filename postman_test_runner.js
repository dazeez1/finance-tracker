const newman = require('newman');
const path = require('path');

// Configuration for running Postman collection
const collectionPath = path.join(__dirname, 'Finance_Tracker_API.postman_collection.json');
const environmentPath = path.join(__dirname, 'Finance_Tracker_Environment.postman_environment.json');

// Newman options
const newmanOptions = {
  collection: collectionPath,
  environment: environmentPath,
  reporters: ['cli', 'json'],
  reporter: {
    json: {
      export: './postman-test-results.json'
    }
  },
  iterationCount: 1,
  delayRequest: 1000, // 1 second delay between requests
  timeout: 30000, // 30 seconds timeout
  insecure: true, // Allow insecure connections for localhost
  verbose: true
};

console.log('🚀 Starting Postman Collection Test Runner...');
console.log('📁 Collection:', collectionPath);
console.log('🌍 Environment:', environmentPath);
console.log('⏱️  Delay between requests:', newmanOptions.delayRequest + 'ms');
console.log('⏰ Request timeout:', newmanOptions.timeout + 'ms');
console.log('');

// Run the collection
newman.run(newmanOptions, (err, summary) => {
  if (err) {
    console.error('❌ Error running collection:', err);
    process.exit(1);
  }

  console.log('');
  console.log('📊 Test Results Summary:');
  console.log('========================');
  console.log(`✅ Total Requests: ${summary.run.stats.requests.total}`);
  console.log(`✅ Successful: ${summary.run.stats.requests.passed}`);
  console.log(`❌ Failed: ${summary.run.stats.requests.failed}`);
  console.log(`⏱️  Total Time: ${summary.run.timings.completed - summary.run.timings.started}ms`);
  console.log('');

  if (summary.run.failures.length > 0) {
    console.log('❌ Failed Requests:');
    summary.run.failures.forEach((failure, index) => {
      console.log(`${index + 1}. ${failure.source.name}: ${failure.error.message}`);
    });
    console.log('');
  }

  if (summary.run.stats.requests.failed === 0) {
    console.log('🎉 All tests passed successfully!');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed. Check the details above.');
    process.exit(1);
  }
});
