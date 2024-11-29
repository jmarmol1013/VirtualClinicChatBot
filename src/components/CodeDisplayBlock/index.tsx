'use client';
import React, { useState } from 'react';
import { CodeBlock } from 'react-code-blocks';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { CheckIcon, CopyIcon } from 'lucide-react';

interface ButtonCodeblockProps {
    code: string;
    lang: string;
}

export default function CodeDisplayBlock({ code, lang }: ButtonCodeblockProps) {
    const [isCopied, setisCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        setisCopied(true);
        toast.success('Code copied to clipboard!');
        setTimeout(() => {
            setisCopied(false);
        }, 1500);
    };

    return (
        <div className="relative flex flex-col text-start">
            <Button
                onClick={copyToClipboard}
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 h-5 w-5"
            >
                {isCopied ? (
                    <CheckIcon className="h-4 w-4 scale-100 transition-all" />
                ) : (
                    <CopyIcon className="h-4 w-4 scale-100 transition-all" />
                )}
            </Button>
            <CodeBlock text={code} language="tsx" showLineNumbers={false} />
        </div>
    );
}
