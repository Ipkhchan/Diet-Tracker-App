function rootReducer(state = {isLoggedIn: Boolean(localStorage.getItem("token"))}, action) {
  switch(action.type) {
    case 'TOGGLE':
      return {
        isLoggedIn: !state.isLoggedIn
      };
    default:
      return state;
  }
}

export default rootReducer
