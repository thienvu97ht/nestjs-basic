import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export interface Response<T> {
  statusCode: number;
  message?: string;
  data: any;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        console.log("🏆 ~ map ~ data:", data);

        return {
          statusCode: context.switchToHttp().getResponse().statusCode,
          //   message: data.message,
          data: data,
        };
      }),
    );
  }
}
