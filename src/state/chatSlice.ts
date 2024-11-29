import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChatState {
    messages: {
        userId: string;
        content: string;
        date: string;
        audioUrl?: string;
    }[];
}

interface ChatSliceState {
    chats: {
        [chatId: string]: ChatState;
    };
    currentChatId: string | null;
}

const initialState: ChatSliceState = {
    chats: {},
    currentChatId: null,
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        addMessage: (
            state,
            action: PayloadAction<{
                chatId: string;
                userId: string;
                content: string;
                audioUrl?: string;
            }>,
        ) => {
            const { chatId, userId, content, audioUrl } = action.payload;
            const chat = state.chats[chatId] || { messages: { input: [], output: [] } };
            chat.messages.push({ userId, content, date: new Date().toISOString(), audioUrl });
            state.chats[chatId] = chat;
        },

        setActiveChat: (state, action: PayloadAction<string>) => {
            state.currentChatId = action.payload;
        },

        openChat: (state, action: PayloadAction<string>) => {
            const chatId = action.payload;
            if (!state.chats[chatId]) {
                state.chats[chatId] = { messages: [] };
            }
            state.currentChatId = chatId;
        },

        closeChat: (state, action: PayloadAction<string>) => {
            delete state.chats[action.payload];
            if (state.currentChatId === action.payload) {
                state.currentChatId = null;
            }
        },
    },
});

export const { addMessage, setActiveChat, openChat, closeChat } = chatSlice.actions;
export default chatSlice.reducer;
