import { getMiddleValue } from "utilities/array";
import { INPUT } from "./input"
import { sumArray } from "utilities/number";

const lines = INPUT.split('\n');

type Rule = {
  pageId: number;
  mustComeBefore: number;
}

type Update = ReadonlyArray<number>;

const rules: Array<Rule> = [];
const updates: Array<Update> = [];

lines.forEach(line => {
  if (line === '') {
    return;
  }

  if (line.includes('|')) {
    const [pageId, mustComeBefore] = line.split('|');
    rules.push({
      pageId: Number(pageId),
      mustComeBefore: Number(mustComeBefore),
    })
  } else {
    updates.push(line.split(',').map(Number));
  }
});

const ruleAppliesToUpdate = (rule: Rule, update: Update) => update.includes(rule.mustComeBefore) && update.includes(rule.pageId);

const isCorrect = (update: Update) => {
  const printedPages = new Set<number>();

  return update.every(page => {
    const mustComeBefore = rules
      .filter(rule => ruleAppliesToUpdate(rule, update))
      .filter(rule => rule.pageId === page)
      .map(rule => rule.mustComeBefore);

    const allRulesAreObeyed = mustComeBefore.every(requiredPage => {
      return !printedPages.has(requiredPage);
    });

    if (allRulesAreObeyed) {
      printedPages.add(page);
      return true;
    }

    return false;
  })
}

const correctUpdates: Array<Update> = [];
const incorrectUpdates: Array<Update> = [];

updates.forEach(update => {
  if (isCorrect(update)) {
    correctUpdates.push(update);
  } else {
    incorrectUpdates.push(update);
  }
})

const correctMiddles = correctUpdates.map(getMiddleValue);

console.log({ part1: sumArray(correctMiddles) });

const repairUpdate = (update: Update): Update => {
  let output: number[] = [];
  const rulesForUpdate = rules.filter(rule => ruleAppliesToUpdate(rule, update));

  while (output.length !== update.length) {

    const pageToPrint = update.find(page => {
      // Printed pages can be skipped
      if (output.includes(page)) {
        return false;
      }

      const rulesForPage = rulesForUpdate.filter(rule => rule.pageId === page);
      return rulesForPage.every(rule => {
        return output.includes(rule.mustComeBefore);
      });
    });

    output.unshift(pageToPrint);
  }

  return output;
}

console.log(repairUpdate([75, 97, 47, 61, 53]))
console.log(repairUpdate([61, 13, 29]))
console.log(repairUpdate([97, 13, 75, 29, 47]))

const repaired = incorrectUpdates.map(repairUpdate);
const repairedMiddles = repaired.map(getMiddleValue);
console.log({ part2: sumArray(repairedMiddles) })