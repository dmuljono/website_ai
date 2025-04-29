import TransitionWrapper from '@/components/TransitionWrapper';

export default function Resume() {
  return (
    <TransitionWrapper>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Resume</h2>
        <ul className="list-disc text-gray-300 ml-6 space-y-2">
          <li>👨‍💼 Associate, DBS Bank – Tech Graduate Programme (2024–Present)</li>
          <li>🎓 B.S. in Information Systems, [Your University]</li>
          <li>💼 Projects: Data automation, internal AI chatbot integration, API platform rollout</li>
          <li>📈 Skills: Python, SQL, JavaScript, Next.js, Git, DataOps, Tailwind</li>
        </ul>
        <p className="mt-4 text-blue-400 underline">
          <a href="/resume.pdf" target="_blank">Download PDF Resume</a>
        </p>
      </div>
    </TransitionWrapper>
  );
}
