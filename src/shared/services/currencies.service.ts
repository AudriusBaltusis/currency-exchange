import axios from 'axios'
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Service } from "typedi";
import { availableCurrencies } from '../constants/currencies.constants';
import { CurrencyRate } from '../interfaces/currencies.interfaces';
import { EnvDev } from '../../env/env.dev';
import { InternalServerError } from 'routing-controllers';

@Service()
export class CurrenciesService {
    public getCurrencies(base: string): Observable<Array<CurrencyRate>> {
        return from(
            axios
                .get(EnvDev.CURRENCY_EXCHANGE_RATE_URL, {
                    params: {base}
                })
                .catch((error) => {
                    throw new InternalServerError('Internal Server Error');
                })
        ).pipe(
            map((data) => data.data.rates),
            map((rates) => availableCurrencies.map(currency => {
                return {
                    name: currency,
                    rate: rates[currency]
                };
            }))
        )
    }
}
