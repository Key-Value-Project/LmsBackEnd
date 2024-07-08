import extractValidationErrors from "../../src/utils/extractValidationErrors";

describe("extractValidationErrors", () => {
	it("should return all validation errors", () => {
		const err = [
			{
				target: {
					name: "monny",
					email: "akka123gmail.com",
					age: "13",
					address: {
						line1: "kochi infopark",
						pincode: "879546",
					},
					password: "fjnfkjdsd%fsdkjfbsdsjdnskjfns",
					role: "HR",
				},
				value: "akka123gmail.com",
				property: "email",
				children: [],
				constraints: {
					isEmail: "email must be an email",
				},
			},
			{
				target: {
					name: "monny",
					email: "akka123gmail.com",
					age: "13",
					address: {
						line1: "kochi infopark",
						pincode: "879546",
					},
					password: "fjnfkjdsd%fsdkjfbsdsjdnskjfns",
					role: "HR",
				},
				value: "13",
				property: "age",
				children: [],
				constraints: {
					isNumber: "age must be a number conforming to the specified constraints",
				},
			},
		];

		const result = extractValidationErrors(err);
		expect(result).toEqual([
			"email must be an email",
			"age must be a number conforming to the specified constraints",
		]);
	});

	it("should return all validation errors", () => {
		const err = [
			{
				target: {
					name: "monny",
					email: "akka123gmail.com",
					age: "13",
					address: {
						line1: "kochi infopark",
						pincode: 879546,
					},
					password: "fjnfkjdsd%fsdkjfbsdsjdnskjfns",
					role: "HRR",
				},
				value: "akka123gmail.com",
				property: "email",
				children: [],
				constraints: {
					isEmail: "email must be an email",
				},
			},
			{
				target: {
					name: "monny",
					email: "akka123gmail.com",
					age: "13",
					address: {
						line1: "kochi infopark",
						pincode: 879546,
					},
					password: "fjnfkjdsd%fsdkjfbsdsjdnskjfns",
					role: "HRR",
				},
				value: "13",
				property: "age",
				children: [],
				constraints: {
					isNumber: "age must be a number conforming to the specified constraints",
				},
			},
			{
				target: {
					name: "monny",
					email: "akka123gmail.com",
					age: "13",
					address: {
						line1: "kochi infopark",
						pincode: 879546,
					},
					password: "fjnfkjdsd%fsdkjfbsdsjdnskjfns",
					role: "HRR",
				},
				value: {
					line1: "kochi infopark",
					pincode: 879546,
				},
				property: "address",
				children: [
					{
						target: {
							line1: "kochi infopark",
							pincode: 879546,
						},
						value: 879546,
						property: "pincode",
						children: [],
						constraints: {
							isString: "pincode must be a string",
						},
					},
				],
			},
			{
				target: {
					name: "monny",
					email: "akka123gmail.com",
					age: "13",
					address: {
						line1: "kochi infopark",
						pincode: 879546,
					},
					password: "fjnfkjdsd%fsdkjfbsdsjdnskjfns",
					role: "HRR",
				},
				property: "department",
				children: [],
				constraints: {
					isNotEmpty: "department should not be empty",
				},
			},
			{
				target: {
					name: "monny",
					email: "akka123gmail.com",
					age: "13",
					address: {
						line1: "kochi infopark",
						pincode: 879546,
					},
					password: "fjnfkjdsd%fsdkjfbsdsjdnskjfns",
					role: "HRR",
				},
				value: "HRR",
				property: "role",
				children: [],
				constraints: {
					isEnum: "role must be one of the following values: ADMIN, UI, UX, DEVELOPER, HR, TESTER",
				},
			},
		];

		const result = extractValidationErrors(err);
		expect(result).toEqual([
			"email must be an email",
			"age must be a number conforming to the specified constraints",
			"pincode must be a string",
			"department should not be empty",
			"role must be one of the following values: ADMIN, UI, UX, DEVELOPER, HR, TESTER",
		]);
	});
});
