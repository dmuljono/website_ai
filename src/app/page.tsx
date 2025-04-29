import ChatBot from '@/components/ChatBot';
import TransitionWrapper from '@/components/TransitionWrapper';

export default function Home() {
  return (
    <TransitionWrapper>
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-bold mb-6">Say Hello to Daniel-Bot 🤖</h1>
        <ChatBot />
      </div>
    </TransitionWrapper>
  );
}
