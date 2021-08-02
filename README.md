# Getting Started

To start this project please first create a `.env` file in the root of your project with the following:

```
REACT_APP_ASTRA_TOKEN={your_astra-token}
```

In your Datastax Astra Dashboard, create a keyspace called 'coins'. Then navigate to your GraphQL playground and make sure you are at the endpoint ending with graphql-admin.

Eg: `https://5892dddf-ff9a-4b40-aa31-aa97de1a0966-westeurope.apps.astra.datastax.com/api/graphql-admin`

Once there, make sure to add the following to the HTTP Header to authorize access:

```
{
  "x-cassandra-token": {your_astra-token}
}
```

And deploy the following Schema:

```
mutation {
  deploySchema(
    keyspace: "coins"
    schema: """
    type Coin @key @cql_input {
      asset_id: String! @cql_column(partitionKey: true)
      name: String
      category: String @cql_index
      price_usd: Float
    }
    type Mutation {
      insertCoin(coin: CoinInput): Coin
    }
    type Query {
      coinsByAssetIds(
        asset_ids: [String] @cql_where(field: "asset_id", predicate: IN)
      ): [Coin]
      coinsByCategory(
        category: String
      ): [Coin]
    }
    """
  ) {
    version
  }
}
```

Next, go to the endpoint with your keyspace name:

Eg: `https://5892dddf-ff9a-4b40-aa31-aa97de1a0966-westeurope.apps.astra.datastax.com/api/graphql/coins`

And create some coins:
```
mutation {
  c1: insertCoin(
    coin: {
      asset_id: "BTC"
      name: "Bitcoin"
      category: "Crypto"
      price_usd: 30724.60
    }
  ) {
    asset_id
  }
  c2: insertCoin(
    coin: {
      asset_id: "ETH"
      name: "Ethereum"
      category: "Crypto"
      price_usd: 1817.46
    }
  ) {
    asset_id
  }
    c3: insertCoin(
    coin: {
      asset_id: "GBP"
      name: "Great British Pounds"
      category: "Currency"
      price_usd: 1.37
    }
  ) {
    asset_id
  }
}
```


To run this project please type the following commands:

### `npm i`

This will install all the necessary dependencies.

### `npm run start-deals`

This will start the Deals Service on [http://localhost:4001](http://localhost:4001) 

### `npm run start-gateway` (in a new tab)

This will start the gateway with data from both the Deals Service and DataStax on [http://localhost:4000](http://localhost:4000) 

### `npm run start` (in a new tab)

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

To learn React, check out the [React documentation](https://reactjs.org/).
