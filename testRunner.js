const glob = require('glob');
const enableTypescript = require('./jasmine.typescript');
const path = require('path');
const Jasmine = require('jasmine');
const SpecReporter = require('jasmine-spec-reporter').SpecReporter;

enableTypescript(path.join(__dirname, 'tsconfig.spec.json'));


const projectBaseDir = path.join(__dirname, '');

// Create a Jasmine runner and configure it.
const jasmine = new Jasmine({projectBaseDir: projectBaseDir});
jasmine.loadConfig({});
jasmine.clearReporters();
jasmine.addReporter(new SpecReporter({
  spec: {
    displayPending: true
  }
}));

// Manually set exit code (needed with custom reporters)
jasmine.onComplete((success) => process.exitCode = !success);

// Run the tests.
const allTests =
  glob.sync(path.join(__dirname, '**/*.spec.ts'))
    .map(p => path.relative(projectBaseDir, p));

jasmine.execute(allTests);
