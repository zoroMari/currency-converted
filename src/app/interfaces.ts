import { FormGroup } from "@angular/forms";

export interface IArguments {
  form_to?: FormGroup;
  amount_from: number;
  cur_from: string;
  cur_to: string;
}

export interface IApiResponse {
  result: number;
}
