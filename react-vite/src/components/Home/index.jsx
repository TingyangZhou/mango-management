import { Navigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useDispatch } from 'react-redux';
import { getAllStocksThunk } from '../../redux/stocks';
import { useEffect } from 'react';
import AllStocksList from '../AllStocksList';
import WatchlistStocksList from '../WatchlistStocksList';
import "./indexHome.css"

import { getAllWatchlistThunk } from '../../redux/watchlist';

export default function Home() {
    // const data = useLoaderData();
    const dispatch = useDispatch()
    const sessionUser = useSelector((state) => state.session.user);
    const allStocks = useSelector((state) => state.stocks.stocks);


    // useEffect(() => {
    //     dispatch(getAllStocksThunk())
    // }, [dispatch])




    useEffect(() => {
        dispatch(getAllWatchlistThunk())
        dispatch(getAllStocksThunk())
    }, [dispatch])


    // useEffect(() => {
    //     async function testDeleteToWatchlist() {
    //         try {
    //             const result = await dispatch(removeFromWatchlistThunk(9));
    //         } catch (error) {
    //             console.error("Error adding to watchlist:", error);
    //         }
    //     }
    //     testDeleteToWatchlist();
    // }, [dispatch]);




    if (!sessionUser) {
        return <Navigate to='/login'></Navigate>
    }


    return (
        <main>
            <AllStocksList stocks={allStocks} pageSize={11} heightPx={675}/>
            <WatchlistStocksList/>
        </main>
    );
}

