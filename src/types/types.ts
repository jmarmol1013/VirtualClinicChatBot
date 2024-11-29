interface ChatMessage {
    userId: string;
    content: string;
    date: string;
}

interface ChatState {
    messages: {
        input: ChatMessage[];
        output: {
            content: string;
            date: string;
        }[];
    };
}

interface ChatInfo {
    [chatId: string]: ChatState;
}

type Types = 'Child' | 'Adolescent' | 'Adult' | 'Elderly' | 'Emotionally';
