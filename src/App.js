import './App.css'
import { useState, useEffect } from 'react'

const App = () => {
    const [deals, setDeals ] = useState(null)

    const fetchData = async () => {
        const url = 'http://localhost:4000/'
        const query = `
            query {
              deals {
                id
                volume
                timestamp
                coin {
                  asset_id
                  category
                  name
                  price_usd
                }
              }
            }
        `

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-cassandra-token': process.env.REACT_APP_ASTRA_TOKEN
            },
            body: JSON.stringify({query})
        })

        const responseBody = await response.json()
        setDeals(responseBody.data.deals)
    }

    useEffect(() => {
        fetchData()
    }, [])

    console.log(deals)

    const formatDate = (string) => {
        return new Date(string).toDateString()
    }
    const formatPrice = (price) => {
        return price.toFixed(2)
    }

    const assignImage = (asset_id) => {
        return `../images/${asset_id}.png`
    }


    return (
        <>
            {deals &&
            <div className="app">
                <h1>My Crypto Dashboard</h1>
                <div className="overview">
                    <table>
                        <thead>
                        <tr className="header">
                            <th></th>
                            <th>Asset ID</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Volume</th>
                            <th>Gain/Loss</th>
                            <th>Time</th>
                        </tr>
                        </thead>
                        {deals.map((deal, index) => (
                            <tbody key={index}>
                            <tr>
                                <td>
                                    <img
                                        src={assignImage(deal.coin.asset_id)}
                                        alt={`${deal.coin.asset_id} Logo`}
                                    />
                                </td>
                                <td>{deal.coin.asset_id}</td>
                                <td>{deal.coin.name}</td>
                                <td>{`$${formatPrice(deal.coin.price_usd)}`}</td>
                                <td>{deal.volume}</td>
                                <td>{`$${formatPrice(deal.volume * deal.coin.price_usd)}`}</td>
                                <td>{formatDate(deal.timestamp)}</td>
                        </tr>
                        </tbody>))}
                    </table>
                </div>
            </div>}
        </>
    );
}

export default App
