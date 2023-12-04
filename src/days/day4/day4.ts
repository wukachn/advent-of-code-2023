import readFile from "../../util/readFile";

const getNewValue = (currentValue: number) => {
    if (currentValue == 0) {
        return 1
    }
    return currentValue * 2
}

const solve_ex1 = async () => {
    const puzzleInput = await readFile(`./input.txt`);
    const cards = puzzleInput.split('\n').map((line) => line.split(':')[1].split('|').map(nums => nums.split(' ').filter(element => element != '').map(num => Number(num))))
    let totalValue = 0
    for (const card of cards) {
        let currentValue = 0
        for (const winningNum of card[0]) {
            if (card[1].includes(winningNum)) {
                currentValue = getNewValue(currentValue)
            }
        }
        totalValue += currentValue
    }
    console.log("Ex 1: " + totalValue) // 21568
}

const solve_ex2 = async () => {
    const puzzleInput = await readFile(`./input.txt`);
    const cards = puzzleInput.split('\n').map((line) => line.split(':')[1].split('|').map(nums => nums.split(' ').filter(element => element != '').map(num => Number(num))))

    // Get first batch of copies
    const copies: number[][][] = []
    for (let cardIndex = 0; cardIndex < cards.length; cardIndex++) {
        const winningNums = cards[cardIndex][0]
        const numsToCheck = cards[cardIndex][1]

        let score = 0
        for (const winningNum of winningNums) {
            if (numsToCheck.includes(winningNum)) {
                score += 1
            }
        }
        // Get copies won, attach index of card
        const currentCopies = cards.slice(cardIndex + 1, cardIndex + score + 1)
        for (let j = 0; j < score; j++) {
            copies.push([[cardIndex + j + 1], currentCopies[j][0], currentCopies[j][1]])
        }
    }

    // Loop through until we have no more copies to process
    let numOfCopiesProcessed = 0
    for (const copy of copies) {
        const cardIndex = copy[0][0]
        const winningNums = copy[1]
        const numsToCheck = copy[2]

        let score = 0
        for (const winningNum of winningNums) {
            if (numsToCheck.includes(winningNum)) {
                score += 1
            }
        }
        // Get copies won, attach index of card
        const currentCopies = cards.slice(cardIndex + 1, cardIndex + score + 1)
        for (let j = 0; j < score; j++) {
            copies.push([[cardIndex + j + 1], currentCopies[j][0], currentCopies[j][1]])
        }
        numOfCopiesProcessed += 1
    }
    const total = numOfCopiesProcessed + cards.length
    console.log("Ex 2: " + total) // 11827296
}

solve_ex1()
solve_ex2()