'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/input';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { useCreateContactMutation } from '@/features/contact/mutations';
import { createContactSchema, CreateContactFormValues } from '@/features/contact/validator';

function ContactSection() {
  const mutation = useCreateContactMutation();

  const form = useForm<CreateContactFormValues>({
    resolver: zodResolver(createContactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = (data: CreateContactFormValues) => {
    mutation.mutate(data, {
      onSuccess: () => {
        form.reset();
      },
    });
  };

  return (
    <section
      id="contact"
      className="py-20 px-4 bg-primary text-primary-foreground"
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
              CONTACT US
            </h2>
            <p className="mb-8 leading-relaxed opacity-90">
              Do you have any questions or want to book a room today? Our team
              is always ready to assist you in planning the perfect luxury
              getaway.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Address</h3>
                  <p className="opacity-90">
                    123 Luxury Avenue, Times Square, NY 10036
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Phone Number</h3>
                  <p className="opacity-90">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="opacity-90">reservations@hotelo.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-card-foreground">Full Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your full name"
                          className="bg-background border-border text-foreground"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-card-foreground">Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your.email@example.com"
                          className="bg-background border-border text-foreground"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-card-foreground">Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="+84 123 456 789"
                          className="bg-background border-border text-foreground"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-card-foreground">Subject</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="What is this about?"
                          className="bg-background border-border text-foreground"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-card-foreground">Message *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us more about your inquiry..."
                          rows={4}
                          className="bg-background border-border text-foreground resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full bg-accent hover:bg-black/90 hover:text-white text-accent-foreground"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
