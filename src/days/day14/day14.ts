import readFile from "../../util/readFile"
import { transpose } from "../../util/matrix"

const rollNorth = (platform: string[][]): string[][] => {
    platform = transpose(platform)
    platform.forEach((column, id) => platform[id] = column.join('').split('#').map(part => part.split('').sort().reverse().join('')).join('#').split(''))
    return transpose(platform)
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

const run = async () => {
    let platform: string[][] = await (await readFile(`./input.txt`)).split('\n').map(line => line.split(''))

    console.log("Ex 1: " + calculateTotalLoad(rollNorth(platform))) // 113525
}

run()