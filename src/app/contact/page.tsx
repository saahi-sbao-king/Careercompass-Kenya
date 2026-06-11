"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MessageCircle, Instagram, Youtube, ArrowRight, MapPin, ShieldCheck } from 'lucide-react';

export default function ContactPage() {
  const contactInfo = [
    {
      title: "Call Us",
      description: "Available Mon-Fri, 8am-5pm",
      value: "+254 117448455",
      link: "tel:+254117448455",
      icon: Phone,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Email Us",
      description: "We'll respond within 24 hours",
      value: "sadiq14526@gmail.com",
      link: "mailto:sadiq14526@gmail.com",
      icon: Mail,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      title: "WhatsApp Admin",
      description: "Direct line to management",
      value: "+254 117448455",
      link: "https://wa.me/254117448455",
      icon: ShieldCheck,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "WhatsApp (Main)",
      description: "Chat with our counselors",
      value: "+254 713 451194",
      link: "https://wa.me/254713451194",
      icon: MessageCircle,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "WhatsApp (Support)",
      description: "Technical assistance",
      value: "+254 755 648409",
      link: "https://wa.me/254755648409",
      icon: MessageCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    },
    {
      title: "YouTube Channel",
      description: "Mentorship & Guidance",
      value: "Kizazi Kipya Mentorship",
      link: "https://www.youtube.com/@kizazikipyamentorshipyouth7377",
      icon: Youtube,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      title: "Instagram",
      description: "Follow our latest updates",
      value: "@saahi_sbao",
      link: "https://www.instagram.com/saahi_sbao?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
      icon: Instagram,
      color: "text-pink-600",
      bgColor: "bg-pink-50"
    }
  ];

  return (
    <div className="container mx-auto py-12 px-4 max-w-5xl">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">Get in Touch</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Have questions about your career path or the CBE system? Reach out to the Frere Town Career Compass team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {contactInfo.map((info, index) => (
          <a key={index} href={info.link} target="_blank" rel="noopener noreferrer" className="block group">
            <Card className="hover:shadow-lg transition-all border-primary/10 h-full flex flex-col group-hover:border-primary/30">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className={`p-4 rounded-2xl ${info.bgColor} ${info.color} group-hover:scale-110 transition-transform`}>
                  <info.icon className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-lg">{info.title}</CardTitle>
                  <CardDescription className="text-xs">{info.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="mt-auto">
                <p className="text-base font-semibold text-primary">{info.value}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2 group-hover:text-primary transition-colors">
                  Reach out now <ArrowRight className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>

      <a 
        href="https://maps.app.goo.gl/cNqhAEj8pv1RZLuQA" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="block bg-primary/5 rounded-3xl p-12 border border-primary/10 text-center hover:bg-primary/10 transition-all group"
      >
        <MapPin className="h-12 w-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
        <h2 className="text-3xl font-bold mb-2">Visit Our Office</h2>
        <p className="text-lg text-muted-foreground mb-6">
          Frere Town Secondary School<br />
          Mombasa, Kenya
        </p>
        <Button variant="outline" size="lg" className="gap-2 group-hover:bg-primary group-hover:text-white transition-colors">
          View on Google Maps <ArrowRight className="h-4 w-4" />
        </Button>
      </a>
    </div>
  );
}
