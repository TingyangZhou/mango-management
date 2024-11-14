import { useState } from 'react'
import './PortfolioStocksList.css'
// import { addToWatchlistThunk } from '../../redux/watchlist'
// import { useDispatch } from 'react-redux'
// import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

export default function PortfolioStocksList({stocks, pageSize, heightPx}) {
    const [currPage, setCurrPage] = useState(1)
    // const dispatch = useDispatch()
    // const navigate = useNavigate()

    const stocksFormatter = stocks => {
        const startingPoint = (currPage - 1) * pageSize
        const finalHTMLItems = [(
            <div key={-1} className="stock-list-header">
                <div className="company-name-list-item"><p>Company Name</p></div>
                <div className="ticker-list-item"><p>Ticker</p></div>
                <div className="updated-price-list-item"><p>Market Price</p></div>
                <div className="quantity-list-item"><p>Quantity</p></div>
                <div className="market-value-list-item"><p>Value</p></div>
            </div>
        )]


        const arrStocks = Object.values(stocks)
        for(let i = startingPoint; i < startingPoint + pageSize && i < Object.keys(stocks).length ; i++){
            finalHTMLItems.push((
                <Link key={arrStocks[i].stock_id} to={`/stocks/${arrStocks[i].stock_id}`}>
                <div key={i} className="stock-list-item">
                    <div className="company-name-list-item"><p>{arrStocks[i].company_name.length > 12 ? arrStocks[i].company_name.substring(0, 11) + "...": arrStocks[i].company_name+"  ".repeat(15-arrStocks[i].company_name.length)}</p></div>
                    <div className="ticker-list-item"><p>{arrStocks[i].ticker}</p></div>
                    <div className="updated-price-list-item"><p>${arrStocks[i].updated_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p></div>
                    <div className="quantity-list-item"><p>{arrStocks[i].share_quantity.toLocaleString(undefined)}</p></div>
                    <div className="market-value-list-item"><p>${(arrStocks[i].updated_price * arrStocks[i].share_quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p></div>
                </div>
                </Link>
            ))
        }
        return finalHTMLItems
    }

    const paginationFooterFormatter = stocks => {
        const finalHTMLItems = []
        const numStocks = Object.keys(stocks).length
        const numPages = Math.ceil(numStocks / pageSize)
        for(let i = 1; i <= numPages; i++){
            finalHTMLItems.push((
                <p onClick={() => setCurrPage(i)}key={i}className={currPage == i ? "current-page-link": ""}>{i}</p>
            ))
        }
        return finalHTMLItems


    }
    return (
        <section className="stocks-all-list-container">
            <h2>Stocks</h2>
            <div className='stocks-all-list'style={{ height: `${heightPx}px`}}>
                {stocksFormatter(stocks)}
                </div>
            <footer className="pagination-footer"><p>Page {currPage}</p><div className="pagination-footer-items-container">{paginationFooterFormatter(stocks)}</div></footer>
        </section>
    )
}