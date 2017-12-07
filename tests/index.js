var testsContext = require.context(".", true, /\.spec\.js$/);
testsContext.keys().forEach(testsContext);

// require all `src/components/**/index.js`
const componentsContext = require.context('../client/js/helpers/', true, /Builder\.js$/);
componentsContext.keys().forEach(componentsContext);