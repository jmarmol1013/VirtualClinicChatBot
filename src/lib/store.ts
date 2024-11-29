import { configureStore } from '@reduxjs/toolkit';
import chatReducer from '../state/chatSlice';

export const makeStore = () => {
    return configureStore({
        reducer: chatReducer,
    });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
