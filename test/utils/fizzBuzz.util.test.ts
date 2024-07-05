
import FizzBuzz from "../../src/utils/fizzBuzz.util";

describe("FizzBuzz", () => {
	const fizzBuzz = new FizzBuzz();
	it("should return FizzBuzz when the number is divisible by 3 and 5", () => {
		// Arrange
		const n = 15;
		expect(fizzBuzz.fizzBuzz(n)).toBe("FizzBuzz");
	});
	// it('using mocks', () => {
	// 	let divisibleByThreeMock = jest.fn(fizzBuzz.divisibleByThree).mockReturnValue(true)
	// 	fizzBuzz.divisibleByThree = divisibleByThreeMock;
	// 	expect(fizzBuzz.fizzBuzz(3)).toBe("Fizz");
	// 	expect(divisibleByThreeMock).toHaveBeenCalledTimes(2);
	// }

});
