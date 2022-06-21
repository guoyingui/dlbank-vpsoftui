
const initState = {
    language: 'zh'
};
export default function reducer(state = initState, action) {
    switch (action.type) {
      case 'CHANGE_lANGUAGE':
        return {
          ...state,
          language: action.language
        };
    default: 
        return state;
    }
}