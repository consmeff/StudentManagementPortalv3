import { ParamMap } from '@angular/router';
import { PAYMENT_REFERENCE_QUERY_PARAMS } from '../constants/admitted-flow.constants';

export function readPaymentReferenceFromQuery(queryParamMap: ParamMap): string | null {
  for (const paramName of PAYMENT_REFERENCE_QUERY_PARAMS) {
    const reference = queryParamMap.get(paramName)?.trim();
    if (reference) {
      return reference;
    }
  }
  return null;
}
