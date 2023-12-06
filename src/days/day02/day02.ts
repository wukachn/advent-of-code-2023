import readFile from "../../util/readFile";

const solve_ex1 = async () => {
    const puzzleInput = await readFile(`./input.txt`);
    const lines = puzzleInput.split('\n')

    const possibleGames: number[] = []
    for (const line of lines) {
        let possible = true

        const parts = line.split(':')

        const game = parts[0]
        const id = game.split(' ')[1]

        const rounds = parts[1].split(';')
        for (const round of rounds) {
            const parts = round.split(',').map(part => part.trim())
            for (const part of parts) {
                const numAndColour = part.split(' ')
                const num = Number(numAndColour[0])
                const colour = numAndColour[1]
                if (colour == 'red') {
                    if (num > 12) {
                        possible = false
                        break
                    }
                } else if (colour == 'green') {
                    if (num > 13) {
                        possible = false
                        break
                    }
                } else {
                    if (num > 14) {
                        possible = false
                        break
                    }
                }
            }
            if (!possible) {
                break
            }
        }
        if (possible) {
            possibleGames.push(Number(id))
        }
    }

    const total = possibleGames.reduce((acc, val) => acc + val, 0)
    console.log("Ex 1: " + total) // 2283
}

const solve_ex2 = async () => {
    const puzzleInput = await readFile(`./input.txt`);
    const lines = puzzleInput.split('\n')

    const powers: number[] = []
    for (const line of lines) {
        const parts = line.split(':')

        const game = parts[0]
        const id = game.split(' ')[1]

        const rounds = parts[1].split(';')

        let red = 0
        let green = 0
        let blue = 0
        for (const round of rounds) {
            const parts = round.split(',').map(part => part.trim())
            for (const part of parts) {
                const numAndColour = part.split(' ')
                const num = Number(numAndColour[0])
                const colour = numAndColour[1]
                if (colour == 'red') {
                    if (num > red) {
                        red = num
                    }
                } else if (colour == 'green') {
                    if (num > green) {
                        green = num
                    }
                } else {
                    if (num > blue) {
                        blue = num
                    }
                }
            }
        }
        powers.push(red * green * blue)
    }

    const total = powers.reduce((acc, val) => acc + val, 0)
    console.log("Ex 2: " + total) // 78669
}

solve_ex1()
solve_ex2()