import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConverterService } from '../converter.service';
import { currencies_available } from '../currencies_available';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.sass']
})
export class ConverterComponent implements OnInit {
  private _cur_avail = currencies_available;
  public currencies = [this._cur_avail.usd, this._cur_avail.eur, this._cur_avail.uah];
  public formCurrency_1!: FormGroup;
  public formCurrency_2!: FormGroup;
  public error: boolean = false;

  private _cur_1: string;
  private _amount_1: number;
  private _cur_2: string;
  private _amount_2: number;

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

    this._cur_1 = this.formCurrency_1.get('currency')?.value;
    this._amount_1 = +this.formCurrency_1.get('amount')?.value;
    this._cur_2 = this.formCurrency_2.get('currency')?.value;
    this._amount_2 = +this.formCurrency_2.get('amount')?.value;
  }

  public handleChange_1() {
    this._cur_1 = this.formCurrency_1.get('currency')?.value;
    this._amount_1 = +this.formCurrency_1.get('amount')?.value;
    this._cur_2 = this.formCurrency_2.get('currency')?.value;

    this._converCurrency(this.formCurrency_2, this._cur_1, this._amount_1, this._cur_2)
  }

  public handleChange_2() {
    this._cur_1 = this.formCurrency_1.get('currency')?.value;
    this._cur_2 = this.formCurrency_2.get('currency')?.value;
    this._amount_2 = +this.formCurrency_2.get('amount')?.value;

    this._converCurrency(this.formCurrency_1, this._cur_2, this._amount_2, this._cur_1)
  }

  private _converCurrency(to_form: FormGroup, from_cur: string, from_amount: number, to_cur: string) {
    if(from_amount === 0) return;

    this.converterService.fetchExchangeRate(
      {
        amount_from: from_amount,
        cur_from: from_cur,
        cur_to: to_cur,
      }
    )
      .subscribe(
        amount => {
          this.error = false;
          const newAmount: number = +(amount.result).toFixed(3);
          to_form.patchValue({ 'amount': newAmount });
        },
        error => {
          this.error = true;
        }
    );
  }



}
