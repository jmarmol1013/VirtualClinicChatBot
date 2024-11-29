'use client';

import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from '@/components/ui/chat/chat-bubble';
import { ChatInput } from '@/components/ui/chat/chat-input';
import { ChatMessageList } from '@/components/ui/chat/chat-message-list';
import { Button } from '@/components/ui/button';
import { CopyIcon, CornerDownLeft, Mic, Paperclip, RefreshCcw, Send, Volume2 } from 'lucide-react';
import { createContext, useEffect, useRef, useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeDisplayBlock from '@/components/CodeDisplayBlock';
import { useAppSelector, useAppStore } from '@/lib/hooks';
import { addMessage, openChat } from '@/state/chatSlice';
import { useDispatch } from 'react-redux';
import { getRespond, sendAudio } from '@/actions/openAiActions';

interface ChatContextProps {
    activeChat: string | null;
    openChat: (chatId: string) => void;
    closeChat: (chatId: string) => void;
    addMessageToChat: (chatId: string, userId: string, content: string) => void;
    switchChat: (chatId: string) => void;
}

interface ChatProps {
    patientType: Types;
}

export const Chat = ({ patientType }: ChatProps) => {
    const [isRecording, setIsRecording] = useState(false);
    const store = useAppStore();
    const currentChatId = useAppSelector((state) => state.currentChatId);
    const messages = currentChatId ? store.getState().chats[currentChatId]?.messages : [];
    const dispatch = useDispatch();
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);

    useEffect(() => {
        dispatch(openChat(patientType));
    }, [patientType]);

    const [isGenerating, setIsGenerating] = useState(false);
    const [isGeneratingUser, setIsGeneratingUser] = useState(false);
    const [input, setInput] = useState<string>('');

    const messagesRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        isGeneratingUser ? null : setIsGenerating(true);
        e.preventDefault();
        if (input.trim()) {
            dispatch(
                addMessage({
                    chatId: currentChatId!,
                    userId: patientType,
                    content: input,
                }),
            );

            setInput('');
            const formData = new FormData();
            formData.append('type', patientType);
            formData.append('question', input);

            const response = await getRespond(formData);
            if (response) {
                dispatch(
                    addMessage({
                        chatId: currentChatId!,
                        userId: 'machine',
                        content: response,
                    }),
                );
            }

            setIsGenerating(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleSubmit(e);
    };

    const startRecording = async () => {
        try {
            setIsRecording(true);
            setIsGeneratingUser(true);
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);

            mediaRecorderRef.current = mediaRecorder;

            const audioChunks: Blob[] = [];

            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = async () => {
                const audio = new Blob([...audioChunks], { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audio);
                const formData = new FormData();
                formData.append('type', patientType);
                formData.append('question', audio);
                dispatch(
                    addMessage({
                        chatId: currentChatId!,
                        userId: patientType,
                        content: '',
                        audioUrl,
                    }),
                );
                setIsGeneratingUser(false);

                setIsGenerating(true);

                const response = await sendAudio(formData);
                const blob = new Blob([response], { type: 'audio/wav' });
                const audioResponse = URL.createObjectURL(blob);
                console.log(audioUrl);

                dispatch(
                    addMessage({
                        chatId: currentChatId!,
                        userId: 'machine',
                        content: '',
                        audioUrl: audioResponse,
                    }),
                );
                setIsGenerating(false);
            };

            mediaRecorder.start();
        } catch (err) {
            console.error('Error accessing microphone', err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    return (
        <>
            <div className="sticky top-0 z-50 w-full border-b py-2 text-white">
                <p className="text-xl font-bold">{patientType} user</p>
            </div>
            <div className="flex h-full flex-col">
                <ChatMessageList ref={messagesRef}>
                    {messages.length === 0 && (
                        <div className="flex w-full flex-col gap-2 rounded-lg border bg-background p-8 text-black shadow-sm">
                            <h1 className="font-bold">Welcome to Patient Care Hub app.</h1>
                            <p className="text-muted-foreground text-sm">
                                This application is designed to assist doctors in providing
                                efficient and tailored consultations for children, adults, and
                                elderly patients, as well as managing critical or emergency (MAD)
                                cases. Whether addressing routine health concerns or urgent care
                                needs, this chatbot ensures every interaction is smooth and
                                productive.
                            </p>
                        </div>
                    )}
                    {[...messages]
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                        .map((message, index) => (
                            <ChatBubble
                                key={index}
                                variant={message.userId != 'machine' ? 'sent' : 'received'}
                            >
                                <ChatBubbleAvatar
                                    src=""
                                    fallback={message.userId != 'machine' ? '👨🏽' : '🤖'}
                                />
                                <ChatBubbleMessage>
                                    {message.audioUrl == null ? (
                                        message.content
                                            .split('```')
                                            .map((part: string, index: number) => {
                                                if (index % 2 === 0) {
                                                    return (
                                                        <Markdown
                                                            key={index}
                                                            remarkPlugins={[remarkGfm]}
                                                        >
                                                            {part}
                                                        </Markdown>
                                                    );
                                                } else {
                                                    return (
                                                        <pre
                                                            className="whitespace-pre-wrap pt-2"
                                                            key={index}
                                                        >
                                                            <CodeDisplayBlock code={part} lang="" />
                                                        </pre>
                                                    );
                                                }
                                            })
                                    ) : (
                                        <audio controls src={message.audioUrl} />
                                    )}
                                </ChatBubbleMessage>
                            </ChatBubble>
                        ))}
                    {isGenerating && (
                        <ChatBubble variant="received">
                            <ChatBubbleAvatar src="" fallback="🤖" />
                            <ChatBubbleMessage isLoading />
                        </ChatBubble>
                    )}
                    {isGeneratingUser && (
                        <ChatBubble variant="sent" className="text-white">
                            <ChatBubbleAvatar src="" fallback="👨🏽" />
                            <ChatBubbleMessage isLoading />
                        </ChatBubble>
                    )}
                </ChatMessageList>
                <div className="mt-auto h-[20%]">
                    <form
                        ref={formRef}
                        onSubmit={onSubmit}
                        className="focus-within:ring-ring rounded-lg border bg-background focus-within:ring-1"
                    >
                        <ChatInput
                            value={input}
                            onChange={handleInputChange}
                            placeholder="Type your message here..."
                            className="min-h-12 w-full resize-none rounded-lg border-0 p-3 text-black shadow-none focus-visible:ring-0"
                        />
                        <div className="flex items-center p-3 pt-0">
                            <Button
                                className="mx-2"
                                variant="default"
                                size="icon"
                                onClick={isRecording ? stopRecording : startRecording}
                            >
                                <Mic className="size-4" />
                                <span className="sr-only">Use Microphone</span>
                            </Button>

                            <Button
                                disabled={!input}
                                type="submit"
                                size="sm"
                                className="ml-auto gap-1.5"
                            >
                                Send Message
                                <CornerDownLeft className="size-3.5" />
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};
