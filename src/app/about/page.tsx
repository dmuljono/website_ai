import TransitionWrapper from '@/components/TransitionWrapper';

export default function About() {
  return (
    <TransitionWrapper>
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl font-bold mb-4">About Me</h2>
        <p className="text-gray-300 max-w-xl mb-2">
          I'm Daniel Muljono — a 25-year-old tech-driven professional working at DBS Bank through the Graduate Associate Programme.
        </p>
        <p className="text-gray-300 max-w-xl">
          I’m passionate about AI, investing, luxury goods, anime, gaming, and golf. This site’s chatbot is trained to reflect my personality so you can chat with “me” even when I’m offline.
        </p>
      </div>
    </TransitionWrapper>
  );
}
