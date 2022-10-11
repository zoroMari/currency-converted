import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IFetchingArgs, IApiResponse } from "./interfaces";

@Injectable({ providedIn: 'root' })
export class ConverterService {
  constructor(private _http: HttpClient) {}

  public fetchExchangeRate(args: IFetchingArgs): Observable<IApiResponse> {
    const { amountFrom, curFrom, curTo } = args;
    return this._http.get<IApiResponse>(`https://api.exchangerate.host/convert?from=${curFrom}&to=${curTo}&amount=${amountFrom}`)
  }
}

