'use client';

import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '@/lib/store';
import { openChat } from '@/state/chatSlice';

export default function StoreProvider({
    initialChatId,
    children,
}: {
    initialChatId: string | null;
    children: React.ReactNode;
}) {
    const storeRef = useRef<AppStore | null>(null);

    if (!storeRef.current) {
        storeRef.current = makeStore();

        if (initialChatId) {
            storeRef.current.dispatch(openChat(initialChatId));
        }
    }

    return <Provider store={storeRef.current}>{children}</Provider>;
}
