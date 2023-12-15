import readFile from "../../util/readFile"

interface lens {
    label: string
    value: number
}

const findValueOfCode = (code: string): number => {
    let currentValue: number = 0
    for (let c = 0; c < code.length; c++) {
        currentValue = ((currentValue + code.charCodeAt(c)) * 17) % 256
    }
    return currentValue
}

const fillBoxes = (codes: string[]): lens[][] => {
    const boxes: lens[][] = Array.from(Array(256), () => [])
    codes.forEach(code => {
        let op: string
        const removeIndex: number = code.indexOf('-')
        if (removeIndex !== -1) {
            op = '-'
        } else {
            op = '='
        }
        const [label, value] = code.split(op)
        const boxIndex: number = findValueOfCode(label)
        if (op === '-') {
            boxes[boxIndex] = removeLensIfPresent(boxes[boxIndex], label)
        } else {
            boxes[boxIndex] = replaceOrAddLens(boxes[boxIndex], label, Number(value))
        }
    })
    return boxes
}

const removeLensIfPresent = (box: lens[], label: string): lens[] => {
    const index = box.findIndex(val => val.label === label)
    if (index === -1) {
        return box
    }
    return [...box.slice(0, index), ...box.slice(index + 1)]
}

const replaceOrAddLens = (box: lens[], label: string, value: number): lens[] => {
    const index = box.findIndex(val => val.label === label)
    if (index === -1) {
        box.push({ label, value })
    } else {
        box[index] = { label, value }
    }
    return box
}

const calculateFocusingPower = (boxes: lens[][]): number => {
    let focusingPower: number = 0
    for (let b = 0; b < boxes.length; b++) {
        for (let l = 0; l < boxes[b].length; l++) {
            focusingPower += (b + 1) * (l + 1) * boxes[b][l].value
        }
    }
    return focusingPower
}

const run = async () => {
    let puzzleInput: string = await readFile(`./input.txt`)
    const codes = puzzleInput.split(',')

    const result: number = codes.map(findValueOfCode).reduce((acc, val) => acc + val, 0)
    console.log("Ex 1: " + result) // 505427

    const focusingPower: number = calculateFocusingPower(fillBoxes(codes))
    console.log("Ex 2: " + focusingPower) // 243747
}

run()