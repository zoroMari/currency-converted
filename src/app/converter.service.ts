import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IArguments, IApiResponse } from "./interfaces";

@Injectable({ providedIn: 'root' })
export class ConverterService {
  constructor(private _http: HttpClient) {}

  public fetchExchangeRate(args: IArguments): Observable<IApiResponse> {
    const { amount_from, cur_from, cur_to } = args;
    return this._http.get<IApiResponse>(`https://api.exchangerate.host/convert?from=${cur_from}&to=${cur_to}&amount=${amount_from}`)
  }
}

