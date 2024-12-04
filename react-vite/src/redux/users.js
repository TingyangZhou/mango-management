const GET_USER ='sessions/getUser'

const getUserInfo = (userInfo) => ({
  type: GET_USER,
  payload : userInfo
})

export const getUserInfoThunk= () => async (dispatch) => {
  const res = await fetch('/api/users/current');  
  try{
    if (res.ok) {
      const data = await res.json();
      // console.log("==========================")
      dispatch(getUserInfo(data));
  } else {
      // console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeee")
      const errors = await res.json();
      throw errors;
  }
  } catch(error){
      throw error;
  }
};




function userInfoReducer(state = {}, action) {
  switch (action.type) {
    case GET_USER:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export default userInfoReducer


