import { Component, OnDestroy, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { mergeMap, Subscription, map } from "rxjs";
import { ConverterService } from "../converter.service";
import { currenciesAvailable } from "../currencies_available";
import { IApiResponse } from "../interfaces";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.sass'],
})
export class NavigationComponent implements OnInit, OnDestroy {
  public currencies = currenciesAvailable;
  public uah: number = 1;
  public eur: number;
  public usd: number;
  private _sub: Subscription;

  constructor(private converterService: ConverterService) {}

  ngOnInit(): void {
    this._fetchCurrencyRates();
  }

  private _fetchEur(): Observable<IApiResponse> {
   return this.converterService.fetchExchangeRate(
      {
        amountFrom: 1,
        curFrom: this.currencies.uah,
        curTo: this.currencies.eur,
      }
    )
  }

  private _fetchUsd(): Observable<IApiResponse> {
    return this.converterService.fetchExchangeRate(
      {
        amountFrom: 1,
        curFrom: this.currencies.uah,
        curTo: this.currencies.usd,
      }
    )
  }

  private _fetchCurrencyRates() {
    this._sub = this._fetchEur().pipe(mergeMap(
      valueEur => {
        return this._fetchUsd().pipe(map(
          valueUsd => {
            const curr = {
              'eur': valueEur.result,
              'usd': valueUsd.result,
            }
            return curr
          }
        ))
      }
    )).subscribe(
        values => {
          this.eur = +(+values.eur).toFixed(3);
          this.usd = +(+values.usd).toFixed(3);
        }
    )
  }

  ngOnDestroy(): void {
    this._sub.unsubscribe();
  }

}

