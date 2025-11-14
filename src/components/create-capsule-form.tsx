'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { Calendar } from './ui/calendar';
import { format } from 'date-fns';
import { isAddress } from 'viem';
import { useTimeCapsule } from '@/hooks/use-time-capsule';
import { encryptMessage } from '@/lib/crypto';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty.'),
  recipient: z.string().refine(isAddress, { message: 'Please enter a valid Ethereum address.' }),
  unlockDate: z.date({
    required_error: 'An unlock date is required.',
  }).min(new Date(), { message: "Unlock date must be in the future." }),
});

export default function CreateCapsuleForm() {
  const { mintCapsule, isMinting } = useTimeCapsule();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
      recipient: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // In a real app, you'd get the recipient's public key for encryption.
      // Here, we'll use the recipient's address as a simplified "secret".
      const encryptedMessage = await encryptMessage(values.message, values.recipient);
      const unlockTimestamp = Math.floor(values.unlockDate.getTime() / 1000);

      await mintCapsule(values.recipient as `0x${string}`, encryptedMessage, unlockTimestamp);
      form.reset();
    } catch(e) {
      console.error("Encryption or minting failed", e);
      toast({
        title: "Error",
        description: "Could not create capsule. Please try again.",
        variant: "destructive"
      });
    }
  }
  
  return (
    <Card className="border-accent/30 shadow-glow-accent-sm bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-headline">Create a New Time Capsule</CardTitle>
        <CardDescription>Your message will be encrypted and stored on-chain as an NFT, locked until the date you choose.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Private Message</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Your secret message..." rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="recipient"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipient Address</FormLabel>
                    <FormControl>
                      <Input placeholder="0x..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unlockDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Unlock Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button type="submit" disabled={isMinting} className="w-full shadow-glow-accent hover:shadow-glow-accent-sm transition-all">
              {isMinting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Minting...</> : 'Create & Mint Capsule'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
