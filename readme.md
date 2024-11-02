# Crypto-Stock price checker API

## Description :pencil:
A web application that allows users to check cryptos and stocks prices by either ticker symbol or company/crypto name. This app is a take-home test for Coderbyte platform for Backend Developer position application at Zimpligital.

## API Endpoints Diagram :twisted_rightwards_arrows:
![awesome recipes API endpoints diagram](./media/path_diagram.jpg)

## Key Features :pushpin:
- **GET Stock Price**: Allow users to a single or multiple stocks prices through companies's names or ticker symbols.
  
- **GET Crypto Price**: Allow users to a single or multiple cryptos prices through their names or ticker symbols.
  
- **Caching**: The app is integrated with Redis caching in lazy-pattern. The frequent API call for specific stocks or cryptos are cached for better performance.
  
## Technologies :computer:
- **Backend**: Typescript + Node.js with Express.js
- **Cache**: Redis through docker

## Third Party Services 
- **CoinGeco**:
- **Finnhub**:
- **yfinance2**:

## Environment variables :deciduous_tree:
The following variables are required to run the program.
- `REDIS_HOST`
- `REDIS_PORT`
- `FINNHUB_API_KEY`
  
`REDIS_HOST` and `REDIS_PORT` can be configured from your local configuration or use the default configuration from source code.
`FINNHUB_API_KEY` This app use 3rd party API from Finnhun Stock API. It helps searching stocks's ticker symbols by passing companies's names. To get the key, you need to sign up at [Finnhub](https://finnhub.io/register) and get the free API key.

## How to run this app :zap:
1) Clone this repo in your desired directory: `git clone https://github.com/SupavitW/crypto-stock_price_api.git`
2) Run `npm i -A` to install all dependencies
3) Create and configure your local .env file
4) Run Redis container in your local docker: `docker run --name redis-container -p 6379:6379 -d redis`
5) Start the app in your terminal: `npm run start`

## Limitation :warning:
- Finnhub allows free API calls up to 60 calls per minute
- CoinGecko allows free API calls up to 30 calls per minute
- yfinance does not have strict calls limitation, but very frequent duplicate requests might result in the temporary ban. However, the app implemented caching to prevent this. 
