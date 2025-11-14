'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/layout/header';
import CreateCapsuleForm from '@/components/create-capsule-form';
import MyCapsulesList from '@/components/my-capsules-list';

export default function Home() {
  return (
    <div
      className="relative min-h-screen w-full"
      style={{
        backgroundImage: 'radial-gradient(ellipse at top, hsl(var(--secondary)), hsl(var(--background)))'
      }}
    >
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="create" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 bg-primary/20">
            <TabsTrigger value="create">Create Capsule</TabsTrigger>
            <TabsTrigger value="view">My Capsules</TabsTrigger>
          </TabsList>
          <TabsContent value="create">
            <CreateCapsuleForm />
          </TabsContent>
          <TabsContent value="view">
            <MyCapsulesList />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
