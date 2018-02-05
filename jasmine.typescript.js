const fs = require('fs');
const ts = require('typescript');

module.exports = function enableTypescript(tsConfig) {
  const compilerOptions = JSON.parse(fs.readFileSync(tsConfig));

  const oldRequireTs = require.extensions['.ts'];
  require.extensions['.ts'] = function (m, filename) {

    if (filename.match(/node_modules/)) {
      if (oldRequireTs) {
        return oldRequireTs(m, filename);
      }
      return m._compile(fs.readFileSync(filename), filename);
    }

    // Node requires all require hooks to be sync.
    const source = fs.readFileSync(filename).toString();

    try {
      const result = ts.transpile(source, compilerOptions['compilerOptions']);

      // Send it to node to execute.
      return m._compile(result, filename);
    } catch (err) {
      console.error('Error while running script "' + filename + '":');
      console.error(err.stack);
      throw err;
    }
  };

};
