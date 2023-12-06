import readFile from "../../util/readFile";

const findResult = (races: number[][]) => {
    let result = 1
    for (let r = 0; r < races[0].length; r++) {
        const time = races[0][r]
        const distance = races[1][r]
        let waysToBeat = 0
        for (let s = 1; s < time; s++) {
            if ((s * (time - s)) > distance) {
                waysToBeat += 1
            }
        }
        result *= waysToBeat
    }
    return result
}

const solve_ex1 = async () => {
    const puzzleInput = await readFile(`./input.txt`);
    const races = puzzleInput.split('\n').map(line => line.split(':')[1].split(' ').filter(val => val != '').map(Number))

    const result = findResult(races)
    console.log("Ex 1: " + result) // 303600
}

const solve_ex2 = async () => {
    const puzzleInput = await readFile(`./input.txt`)
    const races = puzzleInput.split('\n').map(line => line.split(':')[1].split(' ').join('')).map(str => [Number(str)])

    const result = findResult(races)
    console.log("Ex 2: " + result) // 23654842
}

solve_ex1()
solve_ex2()