import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ConverterService } from '../converter.service';
import { currenciesAvailable } from '../currencies_available';
import { IConverterArgs } from '../interfaces';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.sass']
})
export class ConverterComponent implements OnInit, OnDestroy {
  private _curAvail = currenciesAvailable;
  public currencies = [this._curAvail.usd, this._curAvail.eur, this._curAvail.uah];
  public formCurrencyFirst!: FormGroup;
  public formCurrencySecond!: FormGroup;
  public error: boolean = false;

  private _curFirst: string;
  private _amountFirst: number;
  private _curSecond: string;
  private _amountSecond: number;

  private _subFirst: Subscription;
  private _subSecond: Subscription;

  constructor( private converterService: ConverterService ) { }

  ngOnInit(): void {
    this._initilizeForms();
  }

  private _initilizeForms() {
    this.error = false;

    this.formCurrencyFirst = new FormGroup({
      amount: new FormControl('0', Validators.required),
      currency: new FormControl(this._curAvail.usd, Validators.required)
    });

    this.formCurrencySecond = new FormGroup({
      amount: new FormControl('0', Validators.required),
      currency: new FormControl(this._curAvail.uah, Validators.required)
    });

    this._subFirst = this.formCurrencyFirst.valueChanges.subscribe(
      (newValue) => {
        this._curFirst = this.formCurrencyFirst.get('currency')?.value;
        this._amountFirst = +this.formCurrencyFirst.get('amount')?.value;
        this._curSecond = this.formCurrencySecond.get('currency')?.value;

        this._convertCurrency({
          formTo: this.formCurrencySecond,
          curFrom: this._curFirst,
          amountFrom: this._amountFirst,
          curTo: this._curSecond,
        })
      }
    );

    this._subSecond = this.formCurrencySecond.valueChanges.subscribe(
      (newValue) => {
        this._curFirst = this.formCurrencyFirst.get('currency')?.value;
        this._curSecond = this.formCurrencySecond.get('currency')?.value;
        this._amountSecond = +this.formCurrencySecond.get('amount')?.value;

        this._convertCurrency({
          formTo: this.formCurrencyFirst,
          curFrom: this._curSecond,
          amountFrom: this._amountSecond,
          curTo: this._curFirst,
        })
      }
    );
  }

  private _convertCurrency(args: IConverterArgs) {
    const { formTo, curFrom, amountFrom, curTo } = args;

    this.converterService.fetchExchangeRate({ curFrom, amountFrom, curTo })
      .subscribe(
        (amount) => {
          this.error = false;
          const newAmount: number = +(+amount.result).toFixed(3);
          formTo.patchValue({ 'amount': newAmount }, { emitEvent: false });
        },
        (error) => {
          this.error = true;
        }
    );
  }

  ngOnDestroy(): void {
    this._subFirst.unsubscribe();
    this._subSecond.unsubscribe();
  }
}

