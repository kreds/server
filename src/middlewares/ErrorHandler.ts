import { Context } from 'koa';
import { Middleware, KoaMiddlewareInterface } from 'routing-controllers';

@Middleware({ type: 'before' })
export class ErrorHandler implements KoaMiddlewareInterface {
    async use(context: Context, next: (err?: any) => Promise<any>): Promise<any> {
        try {
            await next();
        } catch (error) {
            context.response.status = 500;
            context.response.body = JSON.stringify({
                success: false,
                error: {
                    message: error.message
                }
            });
        }
    }
}