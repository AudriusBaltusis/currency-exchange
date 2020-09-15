import {
    BadRequestError,
    Controller,
    Get,
    QueryParams,
} from "routing-controllers";
import { CurrenciesRequest } from '../../shared/interfaces/currencies.interfaces';
import { CurrenciesFacade } from '../../shared/facades/currencies.facade';

@Controller()
export class CurrenciesController {
    constructor(
        private readonly currenciesFacade: CurrenciesFacade
    ) {
    }

    @Get("/quote")
    async quoteCurrencies(@QueryParams() params: CurrenciesRequest) {
        if (this.currenciesFacade.validateQueryParams(params)) {
            return await this.currenciesFacade.calculateCurrencyRate(params);
        } else {
            return new BadRequestError('Invalid parameters');
        }
    }
}
