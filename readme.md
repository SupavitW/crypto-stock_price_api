# Crypto-Stock price checker API

## Description :pencil:

A web application that allows users to check cryptos and stocks prices by either ticker symbol or company/crypto name. This app is a take-home test for Coderbyte platform for Backend Developer position application at Zimpligital.

## Key Features :pushpin:
- **GET Stock Price**: Allow users to a single or multiple stocks prices through companies's names or ticker symbols.
  
- **GET Crypto Price**: Allow users to a single or multiple cryptos prices through their names or ticker symbols.
  
- **Caching**: The app is integrated with Redis caching in lazy-pattern. The frequent API call for specific stocks or cryptos are cached for better performance.
  
## Technologies :computer:
- **Backend**: Typescript + Node.js with Express.js
- **Cache**: Redis through docker

## Third Party Services :two_men_holding_hands:
- **CoinGecko**: Library from CoinGecko API for searching crypto coins data through tickers.
- **yfinance2**: Library from Yahoo Finance for searching stock data through tickers as well as getting ticker symbols through names.

## Environment variables :deciduous_tree:
The following variables are required to run the program.
- `REDIS_HOST`
- `REDIS_PORT`
  
`REDIS_HOST` and `REDIS_PORT` can be configured from your local configuration or use the default configuration from source code.

## How to run this app :zap:
1) Clone this repo in your desired directory: `git clone https://github.com/SupavitW/crypto-stock_price_api.git`
2) Run `npm i -A` to install all dependencies
3) Create and configure your local .env file
4) Run Redis container in your local docker: `docker run --name redis-container -p 6379:6379 -d redis`
5) Start the app in your terminal: `npm run start`

## API Endpoints :twisted_rightwards_arrows:
![crypto-stock_price_endpoints](https://github.com/user-attachments/assets/8816eccb-78c3-47df-931d-b184d2238b31)
1) `GET` stocks price: **/stock/getStockPrice/**
   - Accept two query parameters, _option_ and _search_
   - _option_ accept either "company" to search by company names or "ticker" to search by ticker symbols
   - _search_ accept single input string to search eg: `"Facebook"`, `"META"` or array of string for multiple inputs eg: `["Facebook", "Apple"]`, `["META", "AAPL"]`
     
2) `GET` crypto price: **/crypto/getCryptoPrice/**
   - Also accept two query parameters, _option_ and _search_
   - _option_ accept either "name" to search by coin's names or "ticker" to search by ticker symbols
   - _search_ accept single input string to search eg: `"Bitcoin"`, `"BTC"` or array of string for multiple inputs eg: `["Bitcoin", "Ethereum"]`, `["BTC", "ETH"]` 

## Limitation :warning:
- CoinGecko has a rate limit of 5 to 15 calls per minute
- yfinance does not have strict calls limitation, but very frequent duplicate requests might result in the temporary ban. However, the app implemented caching to prevent this. 
