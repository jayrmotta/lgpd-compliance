const { setDefaultTimeout } = require('@cucumber/cucumber');

// Set default timeout for all steps to 60 seconds for initial loads (compilation is slow)
setDefaultTimeout(60000);