function extractValidationErrors(errorResponse: any): string[] {
    const errorMessages = errorResponse.map((error: any) => {
        if (error.constraints) {
            return Object.values(error.constraints);
        } else if (error.children && error.children.length) {
            return extractValidationErrors(error.children);
        }
    }
    );
    return errorMessages.flat();
}

// const err = [
//         {
//             target: {
//                 name: "monny",
//                 "email": "akka123gmail.com",
//                 "age": "13",
//                 "address": {
//                     "line1": "kochi infopark",
//                     "pincode": "879546"
//                 },
//                 "password": "fjnfkjdsd%fsdkjfbsdsjdnskjfns",
//                 "role": "HR"
//             },
//             "value": "akka123gmail.com",
//             "property": "email",
//             "children": [],
//             "constraints": {
//                 "isEmail": "email must be an email"
//             }
//         },
//         {
//             target: {
//                 name: "monny",
//                 "email": "akka123gmail.com",
//                 "age": "13",
//                 "address": {
//                     "line1": "kochi infopark",
//                     "pincode": "879546"
//                 },
//                 "password": "fjnfkjdsd%fsdkjfbsdsjdnskjfns",
//                 "role": "HR"
//             },
//             "value": "13",
//             "property": "age",
//             "children": [],
//             "constraints": {
//                 "isNumber": "age must be a number conforming to the specified constraints"
//             }
//         }
// ];

// console.log(extractValidationErrors(err));

export default extractValidationErrors;
