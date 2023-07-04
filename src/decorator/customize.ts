import {
  ExecutionContext,
  SetMetadata,
  createParamDecorator,
} from "@nestjs/common";
import { ApiProperty, ApiPropertyOptions } from "@nestjs/swagger";

export const IS_PUBLIC_KEY = "isPublic";
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true); // key:value

export const RESPONSE_MESSAGE = "response_message";
export const ResponseMessage = (message: string) =>
  SetMetadata(RESPONSE_MESSAGE, message);

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export const ApiFile =
  (options?: ApiPropertyOptions): PropertyDecorator =>
  (target: any, propertyKey: string | symbol) => {
    if (options?.isArray) {
      ApiProperty({
        type: "array",
        items: {
          type: "file",
          properties: {
            [propertyKey]: {
              type: "string",
              format: "binary",
            },
          },
        },
      })(target, propertyKey);
    } else {
      ApiProperty({
        type: "file",
        properties: {
          [propertyKey]: {
            type: "string",
            format: "binary",
          },
        },
      })(target, propertyKey);
    }
  };
