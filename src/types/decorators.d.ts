// Types for class-validator decorators
declare module 'class-validator' {
  export function IsEmail(): PropertyDecorator;
  export function IsString(): PropertyDecorator;
  export function IsNotEmpty(): PropertyDecorator;
  export function IsOptional(): PropertyDecorator;
  export function IsNumber(): PropertyDecorator;
  export function MinLength(min: number): PropertyDecorator;
}
