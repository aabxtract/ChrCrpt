'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/layout/header';
import CreateCapsuleForm from '@/components/create-capsule-form';
import MyCapsulesList from '@/components/my-capsules-list';
import TransactionHistory from '@/components/transaction-history';

export default function Home() {
  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
    >
      <div className="absolute inset-0 z-0 bg-background" style={{
        backgroundImage: 'radial-gradient(ellipse at top, hsl(var(--secondary)), hsl(var(--background)))'
      }} />
      <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'url("/grid.svg")', backgroundSize: '30px 30px' }} />

      <Header />
      <main className="container mx-auto px-4 py-8 relative z-10">
        <Tabs defaultValue="create" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 bg-card/50 border border-border backdrop-blur-sm">
            <TabsTrigger value="create">Create Capsule</TabsTrigger>
            <TabsTrigger value="view">My Capsules</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <TabsContent value="create">
            <CreateCapsuleForm />
          </TabsContent>
          <TabsContent value="view">
            <MyCapsulesList />
          </TabsContent>
          <TabsContent value="history">
            <TransactionHistory />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
