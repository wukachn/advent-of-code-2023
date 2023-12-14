import readFile from "../../util/readFile"
import { transpose } from "../../util/matrix"

const rollForward = (platform: string[][]): string[][] => {
    platform = transpose(platform)
    platform.forEach((column, id) => platform[id] = column.join('').split('#').map(part => part.split('').sort().reverse().join('')).join('#').split(''))
    return transpose(platform)
}

const rollBackwards = (platform: string[][]): string[][] => {
    platform = transpose(platform)
    platform.forEach((column, id) => platform[id] = column.join('').split('#').map(part => part.split('').sort().join('')).join('#').split(''))
    return transpose(platform)
}

const rollLeft = (platform: string[][]): string[][] => {
    platform.forEach((row, id) => platform[id] = row.join('').split('#').map(part => part.split('').sort().reverse().join('')).join('#').split(''))
    return platform
}

const rollRight = (platform: string[][]): string[][] => {
    platform.forEach((row, id) => platform[id] = row.join('').split('#').map(part => part.split('').sort().join('')).join('#').split(''))
    return platform
}

const rollCycle = (platform: string[][]): string[][] => {
    return rollRight(rollBackwards(rollLeft(rollForward(platform))))
}

const calculateTotalLoad = (platform: string[][]): number => {
    let total: number = 0
    for (let i = 0; i < platform.length; i++) {
        for (const object of platform[i]) {
            if (object === 'O') {
                total += platform.length - i
            }
        }
    }
    return total
}

const platformToString = (platform: string[][]): string => {
    return platform.map(line => line.join('')).join('\n')
}

const run = async () => {
    let platform: string[][] = await (await readFile(`./input.txt`)).split('\n').map(line => line.split(''))

    console.log("Ex 1: " + calculateTotalLoad(rollForward(platform))) // 113525

    const platfromHistory: string[] = []
    let cycle: number = 0
    while (true) {
        platform = rollCycle(platform)
        // Using string format here, as I want to find by value.
        const platformString: string = platformToString(platform)
        if (platfromHistory.includes(platformString)) {
            break
        }
        platfromHistory.push(platformString)
        cycle += 1
    }
    const cycleStartIndex: number = platfromHistory.indexOf(platformToString(platform))
    const cyclesLeft: number = (1000000000 - cycleStartIndex) % (cycle - cycleStartIndex) - 1
    for (cycle = 0; cycle < cyclesLeft; cycle++) {
        platform = rollCycle(platform)
    }
    console.log("Ex 2: " + calculateTotalLoad(platform)) // 101292
}

run()