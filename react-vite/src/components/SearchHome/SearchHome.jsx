import { Navigate} from 'react-router-dom';
import { useSelector } from "react-redux";
import { useDispatch } from 'react-redux';

import { useEffect } from 'react';

import WatchlistStocksList from '../WatchlistStocksList';



// import { getAllWatchlistThunk, addToWatchlistThunk, removeFromWatchlistThunk } from '../../redux/watchlist';
import { getAllWatchlistThunk} from '../../redux/watchlist';

export default function SearchHome() {
    // const data = useLoaderData();
    // const navigate = useNavigate()
    const dispatch = useDispatch()
    const sessionUser = useSelector((state) => state.session.user);


    useEffect(() => {
        dispatch(getAllWatchlistThunk())
    }, [dispatch])

    


    if (!sessionUser) {
        return <Navigate to='/login'></Navigate>
    }


    return (
        <main>
            {/* <AllStocksList stocks={allStocks} pageSize={11} heightPx={675}/> */}
            <WatchlistStocksList/>
        </main>
    );
}