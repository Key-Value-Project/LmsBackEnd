class FizzBuzz {
    public fizzBuzz(n: number): any {
        if (n % 3 === 0 && n % 5 === 0) {
            return "FizzBuzz";
        }
        if (n % 3 === 0) {
            return "Fizz";
        }
        if (n % 5 === 0) {
            return "Buzz";
        }
        return n;
    }
}

const fizzBuzz = new FizzBuzz();
for (let i = 1; i <= 100; i++) {
    // console.log(fizzBuzz.fizzBuzz(i));
}

// const divisibleByThree = (n: number): boolean => n % 3 === 0;

export default FizzBuzz;

