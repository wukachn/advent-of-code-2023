import readFile from "../../util/readFile";

const solve_ex1 = async () => {
  const puzzleInput = await readFile(`./input.txt`);
  let total = puzzleInput.split('\n').map(line => line.replace(/\D/g, '')).map(nums => Number(nums.substring(0, 1) + nums.substring(nums.length - 1))).reduce((acc, val) => acc + val, 0)
  console.log("Ex 1: " + total)
}

const solve_ex2 = async () => {
  const puzzleInput = await readFile(`./input.txt`);

  const numDict: Record<string, string> = {
    'one': '1',
    'two': '2',
    'three': '3',
    'four': '4',
    'five': '5',
    'six': '6',
    'seven': '7',
    'eight': '8',
    'nine': '9'
  }

  const regex = /(?=(\d|one|two|three|four|five|six|seven|eight|nine))/g;
  let total = puzzleInput.split('\n').map(line => [...line.matchAll(regex)]).map(nums => nums.map(match => match[1])).map(actualNums => actualNums.map(num => {
    if (num.length > 1) {
      return numDict[num]
    }
    return num
  })).map(nums => Number(nums[0] + nums[nums.length - 1])).reduce((acc, val) => acc + val, 0)

  console.log("Ex 2: " + total)
}

solve_ex1()
solve_ex2()