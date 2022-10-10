import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConverterService } from '../converter.service';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.sass']
})
export class ConverterComponent implements OnInit {
  public currencies = ['USD', 'EUR', 'UAH'];
  public formCurrency_1!: FormGroup;
  public formCurrency_2!: FormGroup;
  public error: boolean = false;
  private resObj;

  private _cur_1: string;
  private _amount_1: number;

  private _cur_2: string;
  private _amount_2: number;

  constructor(private converterService: ConverterService ) { }

  ngOnInit(): void {
    this.error = false;

    this.formCurrency_1 = new FormGroup({
      amount: new FormControl('0', Validators.required),
      currency: new FormControl('USD', Validators.required)
    })

    this.formCurrency_2 = new FormGroup({
      amount: new FormControl('0', Validators.required),
      currency: new FormControl('UAH', Validators.required)
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
    this._amount_2 = +this.formCurrency_2.get('amount')?.value;

    this._converCurrency(this.formCurrency_2, this._cur_1, this._amount_1, this._cur_2)
  }

  public handleChange_2() {
    this._cur_1 = this.formCurrency_1.get('currency')?.value;
    this._amount_1 = +this.formCurrency_1.get('amount')?.value;
    this._cur_2 = this.formCurrency_2.get('currency')?.value;
    this._amount_2 = +this.formCurrency_2.get('amount')?.value;

    this._converCurrency(this.formCurrency_1, this._cur_2, this._amount_2, this._cur_1)
  }

  private _converCurrency(to_form: FormGroup, from_cur: string, from_amount:number, to_cur: string) {
    if(from_amount === 0) return;

    this.converterService.fetchExchangeRate(from_amount, from_cur, to_cur)
      .subscribe(
        result => {

          this.error = false;

          this.resObj = result;

          const newAmount: number = (this.resObj.result).toFixed(3);

          to_form.patchValue({ 'amount': newAmount });
        },
        error => {
          this.error = true;
        }
    );
  }



}
