import { ChatContainer } from '@/components/ChatContainer';

export default async function Page({ searchParams }: { searchParams: { [key: string]: string } }) {
    const patientType = ((await searchParams).patientType as Types) || 'Adult';

    return (
        <main className="mx-auto mt-4 min-h-screen w-[80%] text-black">
            <h3 className="text-2xl font-bold">Welcome to the Virtual Clinic</h3>
            <h2 className="mt-2 text-lg">Streamline Consultations with AI-Powered Assistance</h2>
            <ChatContainer patientType={patientType} />
        </main>
    );
}
