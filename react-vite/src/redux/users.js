// getting current user info including user cash balance
const GET_USER ='sessions/getUser'

const getUserInfo = (user) => ({
  type: GET_USER,
  payload : user
})

export const getUserInfoThunk= () => async (dispatch) => {
  const res = await fetch('/api/users/current');
  if (res.ok) {
      const data = await res.json();
      dispatch(getUserInfo(data));
  } else {
      const errors = await res.json();
      return errors;
  }
};

//update user cash balance 

const SET_USER_BAL ='sessions/setUserBal'

const setUserBal = (user) => ({
  type: SET_USER_BAL,
  payload : user
})

export const updateUserBalanceThunk= (change_amount) => async (dispatch) => {
  const res = await fetch('/api/users/current', 
    {
      method :'PATCH',
      headers : {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ New_balance: change_amount })
    }
  );
  if (res.ok) {
      const userData = await res.json();
      dispatch(setUserBal(userData));
  } else {
      const errors = await res.json();
      return errors;
  }
};


const initialState = { userInfo: null };

function userInfoReducer(state = initialState, action) {
  switch (action.type) {
    case GET_USER:
      return { ...state, userInfo: action.payload };
    case SET_USER_BAL:
      return { ...state, userInfo: action.payload };
    default:
      return state;
  }
}

export default userInfoReducer


