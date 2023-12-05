import readFile from "../../util/readFile";

function createRange(start: number, end: number) {
    let range: number[] = [];
    for (let i = start; i <= end; i++) {
        range.push(i)
    }
    return range;
}

const solve_ex1 = async () => {
    const puzzleInput = await readFile(`./input.txt`);
    const inputParts = puzzleInput.split('\n\n')
    const seeds = inputParts[0].split(':')[1].trim().split(' ').map(Number)
    const rawMaps = inputParts.slice(1, inputParts.length).map(map => {
        const parts = map.split('\n')
        return parts.slice(1, parts.length).map(part => part.split(' ').map(Number))
    })

    let minimum = Infinity
    for (const seed of seeds) {
        let currentValue = seed
        for (const rawMap of rawMaps) {
            for (const line of rawMap) {
                const min = line[1]
                const max = line[1] + line[2]
                if ((currentValue >= min) && (currentValue < max)) {
                    const outputStart = line[0]
                    currentValue = outputStart + (currentValue - min)
                    break;
                }
            }
        }
        if (currentValue < minimum) {
            minimum = currentValue
        }
    }

    console.log("Ex 1: " + minimum) // 510109797
}


// Currently brute forcing. Look into better solution
const solve_ex2 = async () => {
    const puzzleInput = await readFile(`./input.txt`);
    const inputParts = puzzleInput.split('\n\n')
    const rawSeeds = inputParts[0].split(':')[1].trim().split(' ').map(Number)

    const seedGroups: number[][] = []
    for (let i = 0; i < rawSeeds.length; i += 2) {
        seedGroups.push([rawSeeds[i], rawSeeds[i] + rawSeeds[i + 1]])
    }

    const rawMaps = inputParts.slice(1, inputParts.length).map(map => {
        const parts = map.split('\n')
        return parts.slice(1, parts.length).map(part => part.split(' ').map(Number))
    })

    let minimum = Infinity
    for (const seedGroup of seedGroups) {
        console.log("loop")
        const seedMin = seedGroup[0]
        const seedMax = seedGroup[1]
        for (let s = seedMin; s < seedMax; s++) {
            let currentValue = s
            for (const rawMap of rawMaps) {
                for (const line of rawMap) {
                    const min = line[1]
                    const max = line[1] + line[2]
                    if ((currentValue >= min) && (currentValue < max)) {
                        const outputStart = line[0]
                        currentValue = outputStart + (currentValue - min)
                        break;
                    }
                }
            }
            if (currentValue < minimum) {
                minimum = currentValue
            }
        }
    }

    console.log("Ex 2: " + minimum) // 9622622
}

solve_ex1()
solve_ex2()