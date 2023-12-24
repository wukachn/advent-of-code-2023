import readFile from "../../util/readFile"

type Line = {
    atZero: number,
    velocity: number
}

type Hail = {
    x: Line,
    y: Line,
    z: Line
}

const getHail = async (): Promise<Hail[]> => {
    const puzzleInput: string = await readFile(`./input.txt`)
    const hail: Hail[] = puzzleInput.split('\n').map(line => {
        const parts: string[] = line.split(' @ ')
        const atZeros: number[] = parts[0].split(', ').map(Number)
        const velocities: number[] = parts[1].split(', ').map(Number)
        return {
            x: {
                atZero: atZeros[0],
                velocity: velocities[0]
            },
            y: {
                atZero: atZeros[1],
                velocity: velocities[1]
            },
            z: {
                atZero: atZeros[2],
                velocity: velocities[2]
            }
        }
    })
    return hail
}

const findBasicIntersection = (hail1: Hail, hail2: Hail): [number, number] | null => {
    const slope1: number = (hail1.y.velocity / hail1.x.velocity)
    const slope2: number = (hail2.y.velocity / hail2.x.velocity)

    if (slope1 === slope2) return null

    const xIntersection: number = ((slope2 * hail2.x.atZero) - (slope1 * hail1.x.atZero) + hail1.y.atZero - hail2.y.atZero) / (slope2 - slope1)
    const yIntersection: number = (slope1 * (xIntersection - hail1.x.atZero)) + hail1.y.atZero

    return [xIntersection, yIntersection]
}

const getIntersectionsInRange = (hail: Hail[], min: number, max: number): number => {
    let total: number = 0
    for (let i = 0; i < hail.length; i++) {
        for (let j = i; j < hail.length; j++) {
            const hail1 = hail[i]
            const hail2 = hail[j]

            const [xIntersection, yIntersection] = findBasicIntersection(hail1, hail2) ?? [-1, -1]

            if ((xIntersection < hail1.x.atZero && hail1.x.velocity > 0) || (xIntersection > hail1.x.atZero && hail1.x.velocity < 0) ||
                (xIntersection < hail2.x.atZero && hail2.x.velocity > 0) || (xIntersection > hail2.x.atZero && hail2.x.velocity < 0)) {
                continue
            }

            if (xIntersection >= min && yIntersection >= min && xIntersection <= max && yIntersection <= max) {
                total += 1
            }
        }
    }
    return total
}

const solveThrow = async (hail: Hail[]): Promise<number> => {
    const { init } = require('z3-solver')
    const { Context } = await init();
    const { Int, Solver } = new Context("main")
    const solver = new Solver();

    // Create unknown starting throw position/velocities
    const x_me = Int.const('x_me'), y_me = Int.const('y_me'), z_me = Int.const('z_me')
    const xv_me = Int.const('xv_me'), yv_me = Int.const('yv_me'), zv_me = Int.const('zv_me')

    for (let i = 0; i < 3; i++) {
        const t_i = Int.const(`t_${i}`) // Create a new unknown time value (for the current collision).
        solver.add(t_i.mul(hail[i].x.velocity).add(hail[i].x.atZero).eq(x_me.add(t_i.mul(xv_me)))) // xstart + (t_i * xv) === xstart_me + (t_i * xv_me)
        solver.add(t_i.mul(hail[i].y.velocity).add(hail[i].y.atZero).eq(y_me.add(t_i.mul(yv_me)))) // ystart + (t_i * yv) === ystart_me + (t_i * yv_me)
        solver.add(t_i.mul(hail[i].z.velocity).add(hail[i].z.atZero).eq(z_me.add(t_i.mul(zv_me)))) // zstart + (t_i * zv) === zstart_me + (t_i * zv_me)
    }

    // Solve system for unknown values
    await solver.check()

    const model = solver.model()
    const x_start: number = model.eval(x_me).value()
    const y_start: number = model.eval(y_me).value()
    const z_start: number = model.eval(z_me).value()

    return x_start + y_start + z_start

}

const run = async () => {
    const hail: Hail[] = await getHail()

    const total = getIntersectionsInRange(hail, 200000000000000, 400000000000000)
    console.log("Ex 1: " + total) // 21679

    const result = await solveThrow(hail)
    console.log("Ex 2: " + result) // 566914635762564
}

run()