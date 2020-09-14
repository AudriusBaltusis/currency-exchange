export interface CurrenciesRequest {
    base_currency: string;
    quote_currency: string;
    base_amount: number;
}

export interface CurrenciesResponse {
    quote_amount: number;
    exchange_rate: number;
}

export interface CurrencyRate {
    name: string;
    rate: number;
}
