// src/users/usersController.ts
import { Controller, Get, Query, Route } from 'tsoa';

@Route('buttons')
export class ButtonController extends Controller {
    @Get()
    public async getButtons(@Query() extra?: string): Promise<string[]> {
        console.log('get buttons, extra = ', { extra });
        return ['Twilight', 'Imperium', 'Rules', ...(extra ? [extra] : [])];
    }
}
