const execOrDie = require('./internal/execOrDie');

execOrDie('npm run -s prepublish');
execOrDie('git add -f dist');
