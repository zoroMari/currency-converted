import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class ConverterService {
  constructor(private _http: HttpClient) {}

  public fetchExchangeRate(amount_from: number, cur_from: string, cur_to: string) {
    return this._http.get(`https://api.exchangerate.host/convert?from=${cur_from}&to=${cur_to}&amount=${amount_from}`)
  }
}
