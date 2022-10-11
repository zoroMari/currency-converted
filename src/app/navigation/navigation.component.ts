import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { ConverterService } from "../converter.service";
import { currenciesAvailable } from "../currencies_available";

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
  private _subFirst: Subscription;
  private _subSecond: Subscription;

  constructor(private converterService: ConverterService) {}

  ngOnInit(): void {
    this._fetchEur();
    this._fetchUsd();
  }

  private _fetchEur() {
    this._subFirst = this.converterService.fetchExchangeRate(
      {
        amountFrom: 1,
        curFrom: this.currencies.uah,
        curTo: this.currencies.eur,
      }
    )
      .subscribe(
        amount => {
          this.eur = +(amount.result).toFixed(3);
        }
    )
  }

  private _fetchUsd() {
    this._subSecond = this.converterService.fetchExchangeRate(
      {
        amountFrom: 1,
        curFrom: this.currencies.uah,
        curTo: this.currencies.usd,
      }
    )
      .subscribe(
        amount => {
          this.usd = +(amount.result).toFixed(3);
        }
    )
  }

  ngOnDestroy(): void {
    this._subFirst.unsubscribe();
    this._subSecond.unsubscribe();
  }

}
