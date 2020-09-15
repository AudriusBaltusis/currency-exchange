import { Service } from 'typedi';
import { CurrenciesService } from '../services/currencies.service';
import { CurrenciesRequest, CurrenciesResponse, CurrencyRate } from '../interfaces/currencies.interfaces';
import { availableCurrencies } from '../constants/currencies.constants';
import { LRU } from '../utils/lru';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { EnvDev } from '../../env/env.dev';

@Service()
export class CurrenciesFacade {
    constructor(
        private readonly currenciesService: CurrenciesService
    ) {
    }

    private currencySource = new LRU(EnvDev.LRU_CACHE_SIZE);

    public calculateCurrencyRate(query: CurrenciesRequest): Promise<CurrenciesResponse> {
        return this.queryExchangeRates(query.base_currency).pipe(
            switchMap((exchangeRates) => of(this.buildResponseData(exchangeRates, query))
            )).toPromise();
    }

    private queryExchangeRates(base_currency: string): Observable<CurrencyRate[]> {
        if (this.currencySource.get(base_currency)) {
            return of(this.currencySource.get(base_currency));
        } else {
            const currenciesObservable = this.currenciesService.getCurrencies(base_currency);
            currenciesObservable.subscribe((currencyRates) => {
                this.currencySource.set(base_currency, currencyRates);
            })
            return currenciesObservable;
        }
    }

    private buildResponseData(exchangeRates: CurrencyRate[], query: CurrenciesRequest): CurrenciesResponse {
        const exchangeRateToUse = this.getSelectedCurrencyExchangeRate(exchangeRates, query.quote_currency);
        return {
            exchange_rate: exchangeRateToUse.rate,
            quote_amount: this.calculateExchangeRate(query.base_amount, exchangeRateToUse.rate),
        }
    }

    private getSelectedCurrencyExchangeRate(exchangeRates: CurrencyRate[], quoteCurrency: string): CurrencyRate {
        return exchangeRates.filter((rate) => rate.name === quoteCurrency)[0];

    }

    public validateQueryParams(query: CurrenciesRequest) {
        return availableCurrencies.indexOf(query.base_currency) !== -1 &&
            availableCurrencies.indexOf(query.quote_currency) !== -1 &&
            query.base_currency !== query.quote_currency &&
            Number(query.base_amount) > 0;
    }

    private calculateExchangeRate(amount: number, exchangeRate: number): number {
        return Number((amount * exchangeRate).toFixed(0));
    }
}
