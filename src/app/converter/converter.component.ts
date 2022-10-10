import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ConverterService } from '../converter.service';
import { currencies_available } from '../currencies_available';
import { IArguments } from '../interfaces';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.sass']
})
export class ConverterComponent implements OnInit, OnDestroy {
  private _cur_avail = currencies_available;
  public currencies = [this._cur_avail.usd, this._cur_avail.eur, this._cur_avail.uah];
  public formCurrency_1!: FormGroup;
  public formCurrency_2!: FormGroup;
  public error: boolean = false;

  private _cur_1: string;
  private _amount_1: number;
  private _cur_2: string;
  private _amount_2: number;

  private _sub_1: Subscription;
  private _sub_2: Subscription;

  constructor(private converterService: ConverterService ) { }

  ngOnInit(): void {
    this.error = false;

    this.formCurrency_1 = new FormGroup({
      amount: new FormControl('0', Validators.required),
      currency: new FormControl(this._cur_avail.usd, Validators.required)
    })

    this.formCurrency_2 = new FormGroup({
      amount: new FormControl('0', Validators.required),
      currency: new FormControl(this._cur_avail.uah, Validators.required)
    })

    this._sub_1 = this.formCurrency_1.valueChanges.subscribe(
      newValue => {
        this._cur_1 = this.formCurrency_1.get('currency')?.value;
        this._amount_1 = +this.formCurrency_1.get('amount')?.value;
        this._cur_2 = this.formCurrency_2.get('currency')?.value;

        this._convertCurrency({
          form_to: this.formCurrency_2,
          cur_from: this._cur_1,
          amount_from: this._amount_1,
          cur_to: this._cur_2,
        })
      }
    )

    this._sub_2 = this.formCurrency_2.valueChanges.subscribe(
      newValue => {
        this._cur_1 = this.formCurrency_1.get('currency')?.value;
        this._cur_2 = this.formCurrency_2.get('currency')?.value;
        this._amount_2 = +this.formCurrency_2.get('amount')?.value;

        this._convertCurrency({
          form_to: this.formCurrency_1,
          cur_from: this._cur_2,
          amount_from: this._amount_2,
          cur_to: this._cur_1,
        })
      }
    )
  }

  private _convertCurrency(args: IArguments) {
    const { form_to, cur_from, amount_from, cur_to } = args;
    if(amount_from === 0) return;

    this.converterService.fetchExchangeRate({ cur_from, amount_from, cur_to })
      .subscribe(
        amount => {
          this.error = false;
          const newAmount: number = +(amount.result).toFixed(3);
          form_to.patchValue({ 'amount': newAmount }, { emitEvent: false });
        },
        error => {
          this.error = true;
        }
    );
  }

  ngOnDestroy(): void {
    this._sub_1.unsubscribe();
    this._sub_2.unsubscribe();
  }
}

