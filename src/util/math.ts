export const findGCD = (num1: number, num2: number): number => {
    if (num2 === 0) {
        return num1
    }
    return findGCD(num2, num1 % num2)
}

export const findLCM = (nums: number[]): number => {
    let ans: number = nums[0]
    for (const num of nums) {
        ans = (((num * ans)) / (findGCD(num, ans)))
    }
    return ans
}