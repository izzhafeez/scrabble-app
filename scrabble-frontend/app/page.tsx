import Game from "./components/Game";

export const metadata = {
  title: 'Scrabble Score Calculator',
  description: 'Enter a word to see its Scrabble score and view the leaderboard!',
  openGraph: {
    title: 'Scrabble Score Calculator',
    description: 'Enter a word to see its Scrabble score and view the leaderboard!',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function Home() {

  return (
    <div className="grid min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen mx-auto max-w-6xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="grid gap-8">
          <h1 className="text-6xl font-extrabold">Scrabble Points Calculator</h1>
          <p className="text-md">Enter any word in the box below to calculate its Scrabble score. Each letter contributes points according to standard Scrabble rules, and the total will be displayed instantly. Use this tool to check words, plan your strategy, or practice your Scrabble skills!</p>
          <Game />
        </div>
      </main>
    </div>
  );
}
