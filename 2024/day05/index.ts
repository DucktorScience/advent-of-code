import { update } from "lodash";
import { INPUT } from "./input"
import { sumArray } from "utilities/number";

const lines = INPUT.split('\n');

type Rule = {
  pageId: number;
  mustComeBefore: number;
}

const rules: Array<Rule> = [];
const updates: Array<Array<number>> = [];

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

const isCorrect = (update: ReadonlyArray<number>) => {
  const printedPages = new Set<number>();

  return update.every(page => {
    const mustComeBefore = rules
      .filter(rule => update.includes(rule.mustComeBefore) && update.includes(rule.pageId))
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

const middles = updates.map(update => {
  if (isCorrect(update)) {
    const middleIndex = Math.floor(update.length / 2);
    return update[middleIndex];
  }

  return 0;
})

console.log({ part1: sumArray(middles) });
