import ConnectWallet from '@/components/connect-wallet';

export default function Header() {
  return (
    <header className="py-4 px-4 sm:px-6">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-300 via-white to-purple-300">
          ChronoCrypt
        </h1>
        <ConnectWallet />
      </div>
    </header>
  );
}
