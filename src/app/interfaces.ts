import { FormGroup } from "@angular/forms";

export interface IConverterArgs {
  formTo: FormGroup;
  amountFrom: number;
  curFrom: string;
  curTo: string;
}

export interface IFetchingArgs {
  amountFrom: number;
  curFrom: string;
  curTo: string;
}

export interface IApiResponse {
  result: number;
}
