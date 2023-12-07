import { INPUT } from "./input";
import _countBy from 'lodash/countBy';

const ORIGINAL_LINES = INPUT.split('\n');

const FIVE_OF_A_KIND = 7;
const FOUR_OF_A_KIND = 6;
const FULL_HOUSE = 5;
const THREE_OF_A_KIND = 4;
const TWO_PAIR = 3;
const ONE_PAIR = 2;
const HIGH_CARD = 1;

const FaceValueLookup: Record<string, number> = {
  'A': 14,
  'K': 13,
  'Q': 12,
  'J': 11,
  'T': 10,
}

const cardStringToValue = (cardString: string) => {
  return FaceValueLookup[cardString] ?? Number(cardString);
}

const getSortedHand = (hand: Readonly<Array<number>>): Readonly<Array<number>> => {
  return [...hand].sort((a, b) => a - b);
}

const getHandRank = (hand: Readonly<Array<number>>) => {
  const counted = _countBy(hand);
  const counts = Object.values(counted).sort((a, b) => b - a);

  switch (counts[0]) {
    case 5:
      return FIVE_OF_A_KIND;
    case 4:
      return FOUR_OF_A_KIND;
    case 3:
      return counts.length === 2 ? FULL_HOUSE : THREE_OF_A_KIND;
    case 2:
      return counts[1] === 2 ? TWO_PAIR : ONE_PAIR;
    case 1:
      return HIGH_CARD;
  }

  throw new Error('Unexpected');
}

type Hand = {
  cards: Readonly<Array<number>>;
  rank: number;
  stake: number;
}

const buildHand = (line: string): Hand => {
  const [rawCardData, rawStake] = line.split(' ');
  const cards = rawCardData.split('').map(cardStringToValue);

  return {
    cards,
    rank: getHandRank(cards),
    stake: Number(rawStake),
  };
}

const originalHands = ORIGINAL_LINES.map(buildHand);

const sortedHands = [...originalHands].sort((a, b) => {
  const rankSort = a.rank - b.rank;
  if (rankSort !== 0) {
    // These are different ranks, can use only that knowledge to sort
    return rankSort;
  }

  // We have the same rank, the winner will be hand with the first unique position that is higher than the other hand
  for (let i = 0; i < 5; ++i) {
    if (a.cards[i] !== b.cards[i]) {
      return a.cards[i] - b.cards[i];
    }
  }

  throw new Error('Did not expect to find 2 identical hands - if this is expected, return zero here instead of throwing');
});

const part1 = sortedHands.reduce((totalWinnings, thisHand, handIndex, arr) => {
  const positionalRank = handIndex + 1;

  const nextHand = arr[handIndex + 1];
  if (nextHand && nextHand.rank === thisHand.rank) {

    let done = false;
    for (let i = 0; i < 5; ++i) {
      if (!done) {
        const thisCard = thisHand.cards[i];
        const otherCard = nextHand.cards[i];

        if (thisCard !== otherCard) {
          done = true;
        }

        if (thisCard > otherCard) {
          console.log('was not actually in order?');
        }
      }
    }
  }

  return totalWinnings + (thisHand.stake * positionalRank);
}, 0);

console.log({
  part1, // 250120186
})
