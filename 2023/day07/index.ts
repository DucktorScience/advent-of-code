import { assert } from "console";
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

const getHandRankNoWildCards = (hand: Readonly<Array<number>>) => {
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

const getHandRank = (hand: Readonly<Array<number>>, wildCard?: number) => {
  if (!wildCard || (wildCard && !hand.includes(wildCard))) {
    return getHandRankNoWildCards(hand);
  }

  const withoutWilds = hand.filter(n => n !== wildCard);

  const counted = _countBy(withoutWilds);
  const counts = Object.values(counted).sort((a, b) => b - a);
  const totalWilds = 5 - withoutWilds.length

  if ((counts[0] ?? 0) + totalWilds === 5) {
    return FIVE_OF_A_KIND;
  }

  if (counts[0] + totalWilds === 4) {
    return FOUR_OF_A_KIND;
  }

  if (totalWilds === 1) {
    if (counts[0] === 2 && counts[1] === 2) {
      return FULL_HOUSE;
    }

  }

  if (counts[0] + totalWilds === 3) {
    return THREE_OF_A_KIND;
  }

  if (totalWilds === 2) {
    return THREE_OF_A_KIND;
  }

  return ONE_PAIR;
}


assert(getHandRank([11, 2, 2, 11, 11], 11) === FIVE_OF_A_KIND, 'a');
assert(getHandRank([11, 11, 11, 11, 11], 11) === FIVE_OF_A_KIND, 'b');
assert(getHandRank([5, 5, 5, 5, 5], 11) === FIVE_OF_A_KIND, 'c');

assert(getHandRank([11, 2, 2, 1, 11], 11) === FOUR_OF_A_KIND, 'd');
assert(getHandRank([11, 11, 11, 2, 1], 11) === FOUR_OF_A_KIND, 'e');
assert(getHandRank([5, 5, 5, 5, 1], 11) === FOUR_OF_A_KIND, 'f');

assert(getHandRank([3, 2, 3, 11, 5], 11) === THREE_OF_A_KIND, 'g');
assert(getHandRank([11, 11, 4, 2, 1], 11) === THREE_OF_A_KIND, 'h');
assert(getHandRank([5, 5, 5, 4, 1], 11) === THREE_OF_A_KIND, 'i');

assert(getHandRank([11, 2, 2, 4, 4], 11) === FULL_HOUSE, 'j');
assert(getHandRank([3, 9, 8, 11, 3], 11) === THREE_OF_A_KIND, 'k');
assert(getHandRank([5, 5, 5, 4, 4], 11) === FULL_HOUSE, 'l');

assert(getHandRank([4, 2, 2, 5, 4], 11) === TWO_PAIR, 'm');

assert(getHandRank([11, 9, 8, 7, 6], 11) === ONE_PAIR, 'n');
assert(getHandRank([2, 6, 8, 7, 11], 11) === ONE_PAIR, 'o');

assert(getHandRank([10, 9, 8, 7, 6], 11) === HIGH_CARD, 'p');
assert(getHandRank([5, 5, 11, 4, 4], 11) === FULL_HOUSE, 'q');
assert(getHandRank([5, 5, 5, 4, 11], 11) === FOUR_OF_A_KIND, 'r');

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

const buildHandWithJokers = (line: string): Hand => {
  const [rawCardData, rawStake] = line.split(' ');
  const cards = rawCardData.split('').map(cardStringToValue);

  return {
    cards,
    rank: getHandRank(cards, 11),
    stake: Number(rawStake),
  };
}

const originalHands = ORIGINAL_LINES.map(buildHand);

const createHandComparator = (wildCard?: number) => {
  return (a: Hand, b: Hand) => {
    const rankSort = a.rank - b.rank;
    if (rankSort !== 0) {
      // These are different ranks, can use only that knowledge to sort
      return rankSort;
    }

    // We have the same rank, the winner will be hand with the first unique position that is higher than the other hand
    for (let i = 0; i < 5; ++i) {

      if (a.cards[i] !== b.cards[i]) {
        if (wildCard) {
          if (a.cards[i] === 11) {
            return -1;
          }
          if (b.cards[i] === 11) {
            return 1;
          }
        }

        return a.cards[i] - b.cards[i];
      }
    }

    throw new Error('Did not expect to find 2 identical hands - if this is expected, return zero here instead of throwing');
  }
}

const sortedHands = [...originalHands].sort(createHandComparator());

const part1 = sortedHands.reduce((totalWinnings, thisHand, handIndex, arr) => {
  const positionalRank = handIndex + 1;

  return totalWinnings + (thisHand.stake * positionalRank);
}, 0);

const wildHands = ORIGINAL_LINES.map(buildHandWithJokers);
const sortedWildHands = [...wildHands].sort(createHandComparator(11));

const part2 = sortedWildHands.reduce((totalWinnings, thisHand, handIndex, arr) => {
  const positionalRank = handIndex + 1;

  return totalWinnings + (thisHand.stake * positionalRank);
}, 0);

console.log({
  part1, // 250120186
  part2, // 250665248
})
