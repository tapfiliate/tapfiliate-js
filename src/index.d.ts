// Types for the tapfiliate.js methods documented at https://developers.tapfiliate.com/tracking/javascript.
// Options stay open (`[option: string]: unknown`) so a new tapfiliate.js option does not need a new release.

/** Callbacks fire only on success unless `always_callback: true` is passed; then they get `(error, result)`. */
export type TapCallback = (...args: any[]) => void;

export interface TapCallbackOptions {
  /** Also call the callback when tracking fails, with the signature `(error, result)`. */
  always_callback?: boolean;
  [option: string]: unknown;
}

export interface TapCreateOptions {
  integration?: string;
  [option: string]: unknown;
}

export interface TapDetectOptions extends TapCallbackOptions {
  /** Domain to set the cookie on, when visitors land on one subdomain and convert on another. */
  cookie_domain?: string;
  /** Referral code to use for this click instead of the one in the URL. */
  referral_code?: string;
  /** Query parameter that carries the referral code instead of `ref`, for example `via`. */
  referral_code_param?: string;
}

/** Extra data stored with a conversion or customer: up to 10 properties, no personal data. */
export type TapMetaData = Record<string, string | number | boolean>;

export interface TapConversionOptions extends TapCallbackOptions {
  /** Your ID of the customer; with recurring commissions the conversion goes to the affiliate who referred them. */
  customer_id?: string;
  /** Three-letter ISO currency code, if it differs from the program currency. */
  currency?: string;
  /** Coupon codes used in the order. A coupon linked to an affiliate wins over the cookie. */
  coupons?: string | string[];
  meta_data?: TapMetaData;
  /** Legacy: identifier of a program group. */
  program_group?: string;
}

export interface TapCustomerOptions extends TapCallbackOptions {
  coupons?: string | string[];
  meta_data?: TapMetaData;
}

export interface TapCommission {
  /** The part of the order amount for this commission. */
  sub_amount: number;
  /** Identifier of the commission type. */
  commission_type: string;
}

/** A referral code, or an asset ID and source ID. */
export interface TapTrackingParameters {
  referral_code?: string;
  asset_id?: string;
  source_id?: string;
}

export interface Tap {
  /**
   * Loads tapfiliate.js once, then runs `create` and `detect`. Calls made before `init` wait in a queue and run
   * after it. On the server (no `window`) it does nothing, as do all other methods.
   */
  init(
    accountId: string,
    createOptions?: TapCreateOptions,
    createCallback?: TapCallback,
    detectOptions?: TapDetectOptions,
    detectCallback?: TapCallback
  ): void;
  /** Records a click if the URL carries affiliate tracking parameters. `init` already calls it. */
  detect(options?: TapDetectOptions, callback?: TapCallback): void;
  /** Tracks a conversion, usually a purchase. A second conversion with the same `externalId` is not tracked. */
  conversion(
    externalId: string,
    amount?: number | null,
    options?: TapConversionOptions,
    commissionType?: string | null,
    callback?: TapCallback
  ): void;
  /** Tracks one conversion with several commissions. */
  conversionMulti(
    externalId: string,
    options: TapConversionOptions,
    commissions: TapCommission[],
    callback?: TapCallback
  ): void;
  /** Tracks a referred customer at sign-up, before they pay. */
  customer(customerId: string, options?: TapCustomerOptions, callback?: TapCallback): void;
  /** Like `customer`, with the initial status trial. */
  trial(customerId: string, options?: TapCustomerOptions, callback?: TapCallback): void;
  /** Like `customer`, with the initial status lead. */
  lead(customerId: string, options?: TapCustomerOptions, callback?: TapCallback): void;
  /** Records a click from tracking parameters you pass explicitly. For standard setups use `detect`. */
  click(trackingParameters: TapTrackingParameters, options?: TapCallbackOptions, callback?: TapCallback): void;
  /** Any other tapfiliate.js method is forwarded as is. */
  [method: string]: (...args: any[]) => void;
}

declare const Tap: Tap;
export default Tap;
