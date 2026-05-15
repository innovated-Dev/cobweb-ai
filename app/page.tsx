import { WebBackground } from '@/components/WebBackground';
import { ChatInterface } from '@/components/ChatInterface';

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <WebBackground />
      <ChatInterface />
    </main>
  );
}
