import readFile from "../../util/readFile"

const memoize = require('just-memoize')

const newSolution = memoize((spring: string, backup: number[]): number => {
    if (spring === '') {
        return backup.length === 0 ? 1 : 0
    }

    const firstChar: string = spring.charAt(0)
    if (firstChar === '.') {
        return newSolution(spring.slice(1), backup)
    } else if (firstChar === '#') {
        let c: number;
        for (c = 1; c < spring.length; c++) {
            if (spring.charAt(c) === '.') {
                if (c === backup[0]) {
                    return newSolution(spring.slice(c), backup.slice(1))
                } else {
                    return 0
                }
            }
            if (spring.charAt(c) === '?') {
                if (c > backup[0]) {
                    return 0
                } else if (c === backup[0]) {
                    return newSolution('.' + spring.slice(c + 1), backup.slice(1))
                } else {
                    const newSpring = spring.slice(0, c) + '#' + spring.slice(c + 1)
                    return newSolution(newSpring, backup)
                }
            }
        }
        // '#' chain hits end of line
        if (c === backup[0] && backup.length == 1) {
            return 1
        } else {
            return 0
        }
    } else {
        return newSolution('.' + spring.slice(1), backup) + newSolution('#' + spring.slice(1), backup)
    }
})

const solve_ex1 = (puzzleInput: string) => {
    const springsPartOne: string[] = []
    const backupPartOne: number[][] = []
    puzzleInput.split('\n').forEach(line => {
        const parts: string[] = line.split(' ')
        springsPartOne.push(parts[0])
        backupPartOne.push(parts[1].split(',').map(Number))
    })

    let totalSolutionsPartOne: number = 0
    for (let i = 0; i < springsPartOne.length; i++) {
        totalSolutionsPartOne += newSolution(springsPartOne[i], backupPartOne[i])
    }

    console.log("Ex 1: " + totalSolutionsPartOne) // 7506
}

const solve_ex2 = (puzzleInput: string) => {
    const springsPartTwo: string[] = []
    const backupPartTwo: number[][] = []
    puzzleInput.split('\n').forEach(line => {
        const parts: string[] = line.split(' ')
        springsPartTwo.push(`${parts[0]}?`.repeat(5).slice(0, -1))
        const backup = parts[1].split(',').map(Number)
        backupPartTwo.push(Array.from({ length: 5 }, () => [...backup]).flat())
    })

    let totalSolutionsPartTwo: number = 0
    for (let i = 0; i < springsPartTwo.length; i++) {
        totalSolutionsPartTwo += newSolution(springsPartTwo[i], backupPartTwo[i])
    }

    console.log("Ex 2: " + totalSolutionsPartTwo) // 548241300348335
}

const run = async () => {
    const puzzleInput: string = await readFile(`./input.txt`)
    solve_ex1(puzzleInput)
    solve_ex2(puzzleInput)
}

run()