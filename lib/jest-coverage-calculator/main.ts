import * as core from "@actions/core";

const coverageJson = core.getInput("coverage", { required: true });
const coverage = JSON.parse(coverageJson);

const sumBy = (list: any, callback: any) =>
  list.reduce((acc: any, item: any) => acc + callback(item), 0);

const percent = [Object.values(coverage.total)]
  .map((group) => [
    sumBy(group, ({ covered }: any) => covered),
    sumBy(group, ({ total }: any) => total),
  ])
  .map(([covered, total]) => (total > 0 ? covered / total : 0))
  .map((percent) => parseFloat((percent * 100).toFixed(2)))
  .shift();

core.setOutput("percent", percent);
