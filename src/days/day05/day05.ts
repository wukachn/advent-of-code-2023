import readFile from "../../util/readFile";

const createRange = (start: number, end: number) => {
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

const solve_ex2 = async () => {
    const puzzleInput = await readFile(`./input.txt`);
    const inputParts = puzzleInput.split('\n\n')
    const rawSeeds = inputParts[0].split(':')[1].trim().split(' ').map(Number)

    const seedRanges: number[][] = []
    for (let i = 0; i < rawSeeds.length; i += 2) {
        seedRanges.push([rawSeeds[i], rawSeeds[i] + rawSeeds[i + 1]])
    }

    const rawMaps = inputParts.slice(1, inputParts.length).map(map => {
        const parts = map.split('\n')
        return parts.slice(1, parts.length).map(part => part.split(' ').map(Number))
    })

    let currentRanges: number[][] = seedRanges
    for (const rawMap of rawMaps) {
        const newRanges: number[][] = []
        for (const currentRange of currentRanges) {
            let noCorrespondingMap = true
            for (const mapLine of rawMap) {
                const outputStart = mapLine[0]
                const outputEnd = outputStart + mapLine[2]
                const mapMin = mapLine[1]
                const mapMax = mapLine[1] + mapLine[2]
                if ((currentRange[0] >= mapMin) && (currentRange[1] <= mapMax)) {
                    noCorrespondingMap = false

                    const outputMin = outputStart + (currentRange[0] - mapMin)
                    const outputMax = outputMin + (currentRange[1] - currentRange[0])
                    newRanges.push([outputMin, outputMax])
                }
                else if ((currentRange[0] >= mapMin) && (currentRange[0] < mapMax) && (currentRange[1] > mapMax)) {
                    noCorrespondingMap = false

                    const outputMin = outputStart + (currentRange[0] - mapMin)
                    newRanges.push([outputMin, outputEnd])

                    currentRanges.push([mapMax, currentRange[1]])
                } else if ((currentRange[0] < mapMin) && (currentRange[1] > mapMin) && (currentRange[1] <= mapMax)) {
                    noCorrespondingMap = false

                    const outputMax = outputStart + (currentRange[0] - mapMin) + (currentRange[1] - currentRange[0])
                    newRanges.push([outputStart, outputMax])

                    currentRanges.push([currentRange[0], mapMin])
                }
            }
            if (noCorrespondingMap) {
                newRanges.push(currentRange)
            }
        }
        currentRanges = [...newRanges]
    }

    const minimum = Math.min(...currentRanges.map(range => range[0]))
    console.log("Ex 2: " + minimum) // 9622622
}

solve_ex1()
solve_ex2()