import readFile from "../../util/readFile";

const checkIfSymbolAround = (lines: string[], lineIndex: number, charIndex: number) => {
    let maxUp = -1
    let maxDown = 1
    let maxLeft = -1
    let maxRight = 1
    if (lineIndex == 0) {
        maxUp = 0
    }
    if (lineIndex == lines.length - 1) {
        maxDown = 0
    }
    if (charIndex == 0) {
        maxLeft = 0
    }
    if (charIndex == lines[0].length - 1) {
        maxRight = 0
    }
    for (let i = maxUp; i <= maxDown; i++) {
        for (let j = maxLeft; j <= maxRight; j++) {
            const foundChar = lines[lineIndex + i][charIndex + j]
            if (isNaN(parseInt(foundChar)) && foundChar !== '.') {
                return true
            }
        }
    }
    return false
}

const findNumsAround = (lines: string[], lineIndex: number, charIndex: number) => {
    let maxUp = -1
    let maxDown = 1
    let maxLeft = -1
    let maxRight = 1
    if (lineIndex == 0) {
        maxUp = 0
    }
    if (lineIndex == lines.length - 1) {
        maxDown = 0
    }
    if (charIndex == 0) {
        maxLeft = 0
    }
    if (charIndex == lines[0].length - 1) {
        maxRight = 0
    }

    const numberCoords: number[][] = [] // [lineNum, substringStart, substringEnd]
    for (let i = maxUp; i <= maxDown; i++) {
        for (let j = maxLeft; j <= maxRight; j++) {
            const currentLineNum = lineIndex + i
            const currentCharNum = charIndex + j
            const foundChar = lines[currentLineNum][currentCharNum]
            if (!isNaN(parseInt(foundChar))) {
                let substringStart
                let substringEnd
                for (substringStart = currentCharNum; substringStart >= 0; substringStart--) {
                    if (isNaN(parseInt(lines[currentLineNum][substringStart]))) {
                        break
                    }
                }
                for (substringEnd = currentCharNum; substringEnd < lines[0].length; substringEnd++) {
                    if (isNaN(parseInt(lines[currentLineNum][substringEnd]))) {
                        break
                    }
                }
                numberCoords.push([currentLineNum, substringStart + 1, substringEnd])
            }
        }
    }
    const uniqueNumbers = [...new Set(numberCoords.map(coords => Number(lines[coords[0]].substring(coords[1], coords[2]))))]
    return uniqueNumbers
}

const solve_ex1 = async () => {
    const puzzleInput = await readFile(`./input.txt`);
    const lines = puzzleInput.split('\n')

    const nums: number[] = []
    for (let currentLineNum = 0; currentLineNum < lines.length; currentLineNum++) {
        let currentNum = ""
        let isSymbolAround = false
        for (let currentCharNum = 0; currentCharNum < lines[0].length; currentCharNum++) {
            const currentCharacter = lines[currentLineNum][currentCharNum]
            if (!isNaN(parseInt(currentCharacter))) {
                currentNum += currentCharacter
                isSymbolAround = checkIfSymbolAround(lines, currentLineNum, currentCharNum) || isSymbolAround
            } else {
                if (isSymbolAround) {
                    nums.push(Number(currentNum))
                }
                currentNum = ""
                isSymbolAround = false
            }
        }
        if (isSymbolAround) {
            nums.push(Number(currentNum))
        }
    }

    const sum = nums.reduce((acc, val) => acc + val, 0)
    console.log("Ex 1: " + sum) // 512794
}

const solve_ex2 = async () => {
    const puzzleInput = await readFile(`./input.txt`);
    const lines = puzzleInput.split('\n')

    let total = 0
    for (let i = 0; i < lines.length; i++) {
        for (let j = 0; j < lines[0].length; j++) {
            if (lines[i][j] == '*') {
                const numbersAround = findNumsAround(lines, i, j)
                if (numbersAround.length == 2) {
                    total += numbersAround[0] * numbersAround[1]
                }
            }
        }
    }

    console.log("Ex 2: " + total) // 67779080
}

solve_ex1()
solve_ex2()