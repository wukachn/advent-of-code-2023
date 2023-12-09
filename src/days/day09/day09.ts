import readFile from "../../util/readFile"

const findHistorySequences = (histories: number[][]): number[][][] => {
    const sequences: number[][][] = []
    for (const history of histories) {
        let currentSequence: number[] = history
        const historySequences: number[][] = [[...currentSequence]]
        while (new Set(currentSequence).size !== 1) {
            const currentDiffs: number[] = currentSequence.slice(1).map((v, i) => v - currentSequence[i])
            historySequences.push(currentDiffs)
            currentSequence = currentDiffs
        }
        sequences.push(historySequences)
    }
    return sequences
}

const calculateResults = (sequences: number[][][], isPartOne: boolean): number => {
    let result: number = 0
    for (const line of sequences) {
        let lineValue: number = 0
        for (let s = line.length - 1; s >= 0; s--) {
            const row: number[] = line[s]
            if (isPartOne) {
                lineValue += row[row.length - 1]
            } else {
                lineValue = row[0] - lineValue
            }
        }
        result += lineValue
    }
    return result
}

const solve_ex1 = (sequences: number[][][]) => {
    const result = calculateResults(sequences, true)
    console.log("Ex 1: " + result) // 1581679977
}

const solve_ex2 = (sequences: number[][][]) => {
    const result = calculateResults(sequences, false)
    console.log("Ex 2: " + result) // 889
}

const run = async () => {
    const puzzleInput = await readFile(`./input.txt`)
    const histories: number[][] = puzzleInput.split('\n').map(line => line.split(' ').map(Number))

    const sequences = findHistorySequences(histories)

    solve_ex1(sequences)
    solve_ex2(sequences)
}

run()