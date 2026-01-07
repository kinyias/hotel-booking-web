'use client';
import { Building2, TrendingUp, ShieldCheck, Mail, Phone, Send } from 'lucide-react';
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export default function PartnerPage() {
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
        title="Become our Partner"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Partner', href: '/partner' },
        ]}
        description="Join our global network of hotels and reach more guests than ever before."
      />

      <div className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Benefit Cards */}
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Global Network</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground leading-relaxed">
                Reach millions of travelers worldwide and increase your hotel's visibility across different markets and demographics.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Revenue Growth</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-2">
              <p className="text-muted-foreground leading-relaxed">
                Leverage our advanced pricing tools, marketing insights, and loyalty programs to maximize your occupancy and revenue.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Dedicated Support</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground leading-relaxed">
                Our partnership team is available to help you optimize your listings, manage bookings, and provide expert industry advice.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Partnership Form Section */}
        <div className="max-w-4xl mx-auto">
          <Card className="border-none shadow-xl">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold">Partner With Us</CardTitle>
              <CardDescription className="text-base mt-2">
                Tell us about your property and our dedicated partnership team will reach out to you within 24 hours.
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
                          <FormLabel className="text-base">Hotel/Property Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your Luxury Hotel Name"
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
                            Work Email Address
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="management@yourhotel.com"
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
                            Contact Phone Number
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
                          Property Details <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about your property (location, number of rooms, star rating, etc.)..."
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
                          Applying...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Apply for Partnership
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Contact Info Section */}
        <div className="max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
           <Card className="border-none shadow-xl">
             <CardHeader>
               <CardTitle className="text-xl flex items-center gap-2">
                 <Mail className="w-5 h-5 text-primary" />
                 Partnership Inquiries
               </CardTitle>
             </CardHeader>
             <CardContent>
               <p className="text-muted-foreground">
                 partners@hotelo.com
               </p>
             </CardContent>
           </Card>
           <Card className="border-none shadow-xl">
             <CardHeader>
               <CardTitle className="text-xl flex items-center gap-2">
                 <Phone className="w-5 h-5 text-primary" />
                 Partner Support Line
               </CardTitle>
             </CardHeader>
             <CardContent>
               <p className="text-muted-foreground">
                 +1 (555) 987-6543
               </p>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}

