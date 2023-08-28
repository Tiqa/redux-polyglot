/* eslint-disable no-console */
/* eslint-disable no-undef */
require("shelljs/global");

console.info("--- PREPUBLISH ...");
const noError = (result) => result.code === 0;

const execOrDie = (cmd, text) =>
  noError(exec(cmd)) ? console.info(text) : exit(-1);

execOrDie("npm run -s build", "--- Build OK ---");

execOrDie("cp ./src/types.d.ts ./dist/types.d.ts", "--- Copied types OK ---");
echo("... Prepublish OK ---");
