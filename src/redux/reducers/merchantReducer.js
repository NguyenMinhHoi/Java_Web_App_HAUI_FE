const SET_MERCHANT = 'SET_MERCHANT';
const UPDATE_MERCHANT = 'UPDATE_MERCHANT';
const CLEAR_MERCHANT = 'CLEAR_MERCHANT';
const SET_PRODUCT = 'SET_PRODUCT';

// Initial State
const initialState = {
    id: null,
    products: null,
};

// Reducer
const merchantReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_MERCHANT:
            return {
                ...state,
                ...action.payload,
            };
        case UPDATE_MERCHANT:
            return {
                ...state,
                ...action.payload,
            };
        case CLEAR_MERCHANT:
            return initialState;
        case SET_PRODUCT:
            return {
                ...state,
                products: action.payload,
            };
        default:
            return state;
    }
};

// Action Creators
export const setMerchant = (merchantData) => ({
    type: SET_MERCHANT,
    payload: merchantData,
});

export const updateMerchant = (updates) => ({
    type: UPDATE_MERCHANT,
    payload: updates,
});

export const clearMerchant = () => ({
    type: CLEAR_MERCHANT,
});

export const setProduct = (payload) => ({
    type: SET_PRODUCT,
    payload: payload,
});

export default merchantReducer;