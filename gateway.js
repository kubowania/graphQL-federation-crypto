const {ApolloServer} = require('apollo-server')
const {ApolloGateway, RemoteGraphQLDataSource} = require('@apollo/gateway')
require('dotenv').config()

const astraToken = process.env.REACT_APP_ASTRA_TOKEN

class StargateGraphQLDataSource extends RemoteGraphQLDataSource {
    willSendRequest({request, context}) {
        request.http.headers.set('x-cassandra-token', astraToken)
    }
}

const gateway = new ApolloGateway({
        serviceList: [
            {
                name: 'coins',
                url: 'https://1c671ec1-e2c9-4690-bc2f-8af68e897517-westeurope.apps.astra.datastax.com/api/graphql/coins'
            },
            {
                name: 'deals',
                url: 'http://localhost:4001/graphql'
            }
        ],

        introspectionHeaders: {
            'x-cassandra-token': astraToken,
        },

        buildService({name, url}) {
            if (name == 'coins') {
                return new StargateGraphQLDataSource({url})
            } else {
                return new RemoteGraphQLDataSource({url})
            }
        },
        __exposeQueryPlanExperimental: true,
    })

;(async () => {
    const server = new ApolloServer({
        gateway,
        engine: false,
        subscriptions: false,
    })

    server.listen().then(({url}) => {
        console.log(`🚀 Gateway ready at ${url}`)
    })
})()




