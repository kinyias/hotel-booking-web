'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, MapPin, Phone, Clock, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PageTitle from '@/components/sections/PageTitle';
import { useCreateContactMutation } from '@/features/contact/mutations';
import { createContactSchema, CreateContactFormValues } from '@/features/contact/validator';

export default function ContactPage() {
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
    <div className="min-h-screen bg-background">
      <PageTitle
        title="Contact Us"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Contact', href: '/contact' },
        ]}
        description="We'd love to hear from you. Get in touch with us today!"
      />

      <div className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Information Cards */}
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Our Location</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground leading-relaxed">
                123 Luxury Avenue<br />
                Times Square<br />
                New York, NY 10036<br />
                United States
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Phone className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Phone & Email</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-2">
              <p className="text-muted-foreground">
                <strong className="text-foreground">Phone:</strong><br />
                +1 (555) 123-4567
              </p>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Email:</strong><br />
                reservations@hotelo.com
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Business Hours</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Mon - Fri:</strong> 9:00 AM - 6:00 PM<br />
                <strong className="text-foreground">Saturday:</strong> 10:00 AM - 4:00 PM<br />
                <strong className="text-foreground">Sunday:</strong> Closed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form Section */}
        <div className="max-w-4xl mx-auto">
          <Card className="border-none shadow-xl">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold">Send Us a Message</CardTitle>
              <CardDescription className="text-base mt-2">
                Fill out the form below and we'll get back to you as soon as possible.
                Please provide either an email or phone number so we can reach you.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">
                            Full Name <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John Doe"
                              className="h-11"
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
                          <FormLabel className="text-base">Subject</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="What is this regarding?"
                              className="h-11"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">
                            Email Address
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="john.doe@example.com"
                              className="h-11"
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
                          <FormLabel className="text-base">
                            Phone Number
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="+1 (555) 123-4567"
                              className="h-11"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">
                          Message <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us more about your inquiry, questions, or feedback..."
                            rows={6}
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-4">
                    <p className="text-sm text-muted-foreground">
                      <span className="text-destructive">*</span> Required fields
                    </p>
                    <Button 
                      type="submit" 
                      size="lg"
                      className="w-full sm:w-auto min-w-[200px] gap-2"
                      disabled={mutation.isPending}
                    >
                      {mutation.isPending ? (
                        <>
                          <span className="animate-spin">⏳</span>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Map Section (Optional) */}
        <div className="max-w-4xl mx-auto mt-12">
          <Card className="border-none shadow-xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-2xl">Find Us Here</CardTitle>
              <CardDescription>
                Visit our office during business hours or schedule an appointment
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="w-full h-[400px] bg-muted relative">
                {/* Placeholder for map - you can integrate Google Maps or other map services */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.6174339374953!2d-73.98823492346468!3d40.75797097138558!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1703234567890!5m2!1sen!2sus"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Office Location Map"
                  className="w-full h-full"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
