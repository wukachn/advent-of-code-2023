import readFile from "../../util/readFile"

enum handType {
    FiveOfAKind = 7,
    FourOfAKind = 6,
    FullHouse = 5,
    ThreeOfAKind = 4,
    TwoPair = 3,
    OnePair = 2,
    HighCard = 1
}

type CardValues = {
    [key: string]: number
}

const cardValue: CardValues = {
    'A': 14,
    'K': 13,
    'Q': 12,
    'T': 10,
    '9': 9,
    '8': 8,
    '7': 7,
    '6': 6,
    '5': 5,
    '4': 4,
    '3': 3,
    '2': 2
}

const getCardValue = (card: string, useJokerRules: boolean): number => {
    if (card == 'J') {
        if (useJokerRules) {
            return 1
        }
        return 11
    }
    return cardValue[card]
}

const getHandType = (cards: string, useJokerRules: boolean): handType => {
    const uniqueCards: Map<string, number> = new Map<string, number>()
    for (const card of cards) {
        if (uniqueCards.has(card)) {
            continue
        }
        const cardRegex = new RegExp(`${card}`, 'g')
        const occurrences = (cards.match(cardRegex) || []).length
        uniqueCards.set(card, occurrences)
    }

    if (useJokerRules && uniqueCards.has('J')) {
        const jokerOccurrences = uniqueCards.get('J') ?? 0
        let maximumCard: string = ""
        let maximumOccurences: number = -1
        for (const [card, value] of uniqueCards.entries()) {
            if (card !== 'J') {
                if (value > maximumOccurences) {
                    maximumCard = card
                    maximumOccurences = value
                }
            }
        }
        uniqueCards.delete('J')
        uniqueCards.set(maximumCard, maximumOccurences + jokerOccurrences)
    }

    switch (uniqueCards.size) {
        case 1: {
            return handType.FiveOfAKind
        }
        case 2: {
            for (const [_, value] of uniqueCards.entries()) {
                if (value === 4 || value === 1) {
                    return handType.FourOfAKind
                } else {
                    return handType.FullHouse
                }
            }
        }
        case 3: {
            for (const [_, value] of uniqueCards.entries()) {
                if (value === 3) {
                    return handType.ThreeOfAKind
                } else if (value === 2) {
                    return handType.TwoPair
                }
            }
        }
        case 4: {
            return handType.OnePair
        }
        default: {
            return handType.HighCard
        }
    }
}

const compareByCards = (cards1: string, cards2: string, useJokerRules: boolean): number => {
    for (let i = 0; i < 5; i++) {
        const card1 = cards1.charAt(i)
        const card2 = cards2.charAt(i)
        if (card1 == card2) {
            continue
        }
        return getCardValue(card1, useJokerRules) - getCardValue(card2, useJokerRules)
    }
    return 0
}

const compareHands = (hand1: string, hand2: string, useJokerRules: boolean): number => {
    const hand1Type: handType = getHandType(hand1, useJokerRules)
    const hand2Type: handType = getHandType(hand2, useJokerRules)
    if (hand1Type == hand2Type) {
        return compareByCards(hand1, hand2, useJokerRules)
    }
    return hand1Type - hand2Type
}

const calculateResult = (hands: string[][]): number => {
    let result = 0
    for (let r = 1; r <= hands.length; r++) {
        result += Number(hands[r - 1][1]) * r
    }
    return result
}

const solve_ex1 = async () => {
    const puzzleInput = await readFile(`./input.txt`)
    let hands = puzzleInput.split('\n').map(line => line.split(' '))

    hands.sort((hand1, hand2) => compareHands(hand1[0], hand2[0], false))

    const result = calculateResult(hands)
    console.log("Ex 1: " + result) // 250120186
}

const solve_ex2 = async () => {
    const puzzleInput = await readFile(`./input.txt`)
    let hands = puzzleInput.split('\n').map(line => line.split(' '))

    hands.sort((hand1, hand2) => compareHands(hand1[0], hand2[0], true))

    const result = calculateResult(hands)
    console.log("Ex 2: " + result) // 250665248
}

solve_ex1()
solve_ex2()