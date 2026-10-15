# Tapfiliate npm module

This is a simple wrapper for the Tapfiliate [JavaScript integration](https://developers.tapfiliate.com/tracking/javascript) library to help with implementation in modern frontend applications.

### Table of content

- [Installation](#installation)
- [Test your integration](#test-your-integration)
- [API](#api)

## Installation

With npm:

`npm install @tapfiliate/tapfiliate-js`

With yarn:

`yarn add @tapfiliate/tapfiliate-js`

Import and initialize your tracking using the init function. Get your account id from your [account settings](https://support.tapfiliate.com/en/articles/1353356-your-account-id).

`import Tap from "@tapfiliate/tapfiliate-js";`

`Tap.init(accountId);`

The init function will add the Tapfiliate script to your webiste's head tag. This is needed for you to be able to use the rest of the Tap functions.

## Test your integration

To test your Tapfiliate setup you can simply add `?tap_test=true` at the end of your url to open the tapfiliate tester.
Read more about testing your integration [here](https://support.tapfiliate.com/en/articles/1918010-test-your-integration).

## API

This npm module mirrors the Tapfiliate [JavaScript integration](https://developers.tapfiliate.com/tracking/javascript) library and all functions from the Javascript Docs can be used with this wrapper with the only difference that the first parameter is now the function name.

e.g. instead of:
`tap('conversion', external id, amount, options, commission type, callback);`
You can now use:
`Tap.conversion(external id, amount, options, commission type, callback)`

### Init

To make the initialization easier we added the init function. Use Tap.init to initialize Tapfiliate. The function loads the tapfiliate javascript to your site's head tag and then calls the two functions Create & Detect to initialize the Tap object.

`Tap.init(accountId, createOptions, createCallback, detectOptions, detectCallback);`

#### Arguments

| Name           | Value                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| accountId      | `String`. [Your account id](https://support.tapfiliate.com/en/articles/1353356-your-account-id).                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| createOptions  | `Object`. Currently no options. This argument only functions as a stub for possible future options.                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| createCallback | `Function`. Callback, to be called after the tracking code has been initialized. In case a visitor id exists for the current visitor, tap.vids will be populated at this point.                                                                                                                                                                                                                                                                                                                                                                      |
| detectOptions  | `Object`. See table 'detectOptions' below                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| detectCallback | `Function`. Callback, to be called after a click is tracked. **Important**: This callback will only fire upon successfully tracked clicks. We are aware this is against convention. However, we're keeping it in place in order to not cause any BC breaks. The method will be deprecated in the future in favour of a new method, that uses conventional callback behaviour. For now you can pass always_callback: true in the options to make the callback always fire. In this case the callback will look as follows: function(error, result) {} |

##### DetectOptions

| Options             | Option values                                                                                                                                                          |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| cookie_domain       | `string`. Explicitly define the domain to place the cookie on. Can be used when users land on subdomain A and later convert on subdomain B.                            |
| referral_code       | `String` Use this to explicitly pass a specific referral code for this click.                                                                                          |
| referral_code_param | `String`. Use an alternative query parameter for the referral code, instead of ref. For example if you would like your links to look like: https://.../?via=, pass via |
| always_callback     | `Boolean` Set to true to also make your callback fire on failed tracking attempts. [More info](https://developers.tapfiliate.com/tracking/javascript#callbacks)                |
