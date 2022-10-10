import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { ConverterService } from "../converter.service";
import { currencies_available } from "../currencies_available";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.sass'],
})
export class NavigationComponent implements OnInit, OnDestroy {
  public currencies = currencies_available;
  public uah: number = 1;
  public eur: number;
  public usd: number;
  private _resObj;
  private _sub_1: Subscription;
  private _sub_2: Subscription;

  constructor(private converterService: ConverterService) {}

  ngOnInit(): void {
    this._sub_1 = this.converterService.fetchExchangeRate(1, this.currencies.uah, this.currencies.eur)
      .subscribe(
        result => {
          this._resObj = result;
          this.eur = (this._resObj.result).toFixed(3);
        }
    )

    this._sub_2 = this.converterService.fetchExchangeRate(1, this.currencies.uah, this.currencies.usd)
      .subscribe(
        result => {
          this._resObj = result;
          this.usd = (this._resObj.result).toFixed(3);
        }
    )
  }

  ngOnDestroy(): void {
    this._sub_1.unsubscribe();
    this._sub_2.unsubscribe();
  }

}
