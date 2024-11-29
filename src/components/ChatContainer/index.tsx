import React from 'react';
import { Chat } from '../Chat';
import { ChangePatient } from '../ChangePatient';

interface ChatContainerProps {
    patientType: Types;
}

export const ChatContainer = ({ patientType }: ChatContainerProps) => {
    return (
        <div className="mt-8 flex h-[700px] items-stretch">
            <div className="h-full w-[20%] rounded-s-xl bg-gray-200">
                <p className="p-4 text-2xl">Chats (5)</p>
                <div className="p-6 text-black">
                    <ChangePatient patientType={patientType} />
                </div>
            </div>
            <div className="h-full w-[80%] rounded-r-xl bg-gray-500 p-4 text-white">
                <Chat patientType={patientType} />
            </div>
        </div>
    );
};
