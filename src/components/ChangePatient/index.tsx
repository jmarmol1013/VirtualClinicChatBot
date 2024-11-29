'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface ChatContainerProps {
    patientType: Types;
}

const chats: Types[] = ['Adult', 'Child', 'Adolescent', 'Elderly', 'Emotionally'];

export const ChangePatient = ({ patientType }: ChatContainerProps) => {
    const router = useRouter();

    return chats.map((chat, index) => {
        return (
            <button
                key={index}
                className={`${patientType == chat ? 'bg-gray-400 text-white' : null} my-4 w-full rounded-xl p-4 text-left`}
                onClick={() => router.push(`?patientType=${chat}`)}
            >
                {chat}
            </button>
        );
    });
};
