import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsNumberLengthBetween(min: number, max: number, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isNumberLengthBetween',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [min, max],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const [min, max] = args.constraints;
                    const length = value.toString().length;
                    return typeof value === 'number' && length >= min && length <= max;
                },
                defaultMessage(args: ValidationArguments) {
                    const [min, max] = args.constraints;
                    return `${args.property} must be a number with length between ${min} and ${max} digits`;
                },
            },
        });
    };
}
