/* global echo */
require('shelljs/global');
const execOrDie = require('./internal/execOrDie');

execOrDie('npm run -s clean-dist', '--- Clean OK ---');
execOrDie('npm run -s build', '--- Build OK ---');
execOrDie('npm run -s test', '--- Tests OK ---');
execOrDie('npm run -s lint', '--- Lint OK ---');
echo('... Prepublish OK ---');
