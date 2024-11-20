const GET_USER ='sessions/getUser'

const getUserInfo = (userInfo) => ({
  type: GET_USER,
  payload : userInfo
})

export const getUserInfoThunk= () => async (dispatch) => {
  const res = await fetch('/api/current');
  try{
    if (res.ok) {
      const data = await res.json();
      dispatch(getUserInfo(data));
  } else {
      const errors = await res.json();
      throw errors;
  }
  } catch(error){
       throw error;
  }
};


const initialState = { userInfo: {} };

function userInfoReducer(state = initialState, action) {
  switch (action.type) {
    case GET_USER:
      return { ...state, userInfo: action.payload };
    default:
      return state;
  }
}

export default userInfoReducer


