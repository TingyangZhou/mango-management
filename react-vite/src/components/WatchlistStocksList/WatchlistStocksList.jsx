import "./WatchlistStockslist.css"
import { removeFromWatchlistThunk } from "../../redux/watchlist"
import { useDispatch, useSelector } from 'react-redux'
// import { useEffect } from "react"
import { useNavigate } from "react-router-dom"


export default function WatchlistStocksList() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const stocks = useSelector(state => state.watchlist)

    const redirectToStockPage = stockId => {
        navigate(`/stocks/${stockId}`)
    }

    const stocksFormatter = () => {
        const finalHTMLItems = []
        finalHTMLItems.push((
            <div key="watchlist-header" className="watchlist-item" id="Watchlist-header">
                <h2>Watchlist</h2>
            </div>

        ))
        for(const key in stocks){
            finalHTMLItems.push((
                <div onClick={() => redirectToStockPage(stocks[key].stock_id)}key={key}className="watchlist-item">
                    <div className="watchlist-item-ticker"><p>{stocks[key].ticker}</p></div>
                    <div className="watchlist-item-updated-price"><p>${stocks[key].updated_price}</p></div>
                    <div className="watchlist-item-button"><button className="watchlist-item-button-inner"onClick={(e) => {
                        e.stopPropagation()
                        dispatch(removeFromWatchlistThunk(stocks[key].id))
                        }}>-</button></div>
                </div>
            ))
        }
        return finalHTMLItems
    }

    
    return (
        <section className="watchlist-list-container">
            <div className='watchlist-list'>
                {stocksFormatter(stocks)}
                </div>
        </section>
    )
}