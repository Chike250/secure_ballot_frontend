"use client";

import type React from "react";

import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Navbar } from "@/components/navbar";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, you would send the form data to your backend here
    toast({
      title: "Message Sent Successfully!",
      description:
        "Thank you for contacting us. We'll get back to you as soon as possible.",
      duration: 5000,
    });
    // Reset form fields
    e.currentTarget.reset();
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <Button variant="ghost" size="sm" className="mb-4" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <h1 className="text-2xl md:text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">
            Have questions or need assistance? We're here to help you with any
            inquiries about Secure Ballot.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 mb-12 md:mb-16">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send Us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as
                  possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input
                        id="first-name"
                        placeholder="Enter your first name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input
                        id="last-name"
                        placeholder="Enter your last name"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Inquiry Type</Label>
                    <RadioGroup defaultValue="general" required>
                      <div className="flex flex-wrap gap-6">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="general" id="general" />
                          <Label htmlFor="general">General Inquiry</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="technical" id="technical" />
                          <Label htmlFor="technical">Technical Support</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="voting" id="voting" />
                          <Label htmlFor="voting">Voting Assistance</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="feedback" id="feedback" />
                          <Label htmlFor="feedback">Feedback</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Please describe your inquiry in detail"
                      rows={5}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full md:w-auto">
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Reach out to us directly</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-sm text-muted-foreground">
                      support@secureballot.ng
                    </p>
                    <p className="text-sm text-muted-foreground">
                      info@secureballot.ng
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p className="text-sm text-muted-foreground">
                      +234 800 VOTE NOW (8683 669)
                    </p>
                    <p className="text-sm text-muted-foreground">
                      +234 700 SECURE BALLOT (732873 225568)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Headquarters</h3>
                    <p className="text-sm text-muted-foreground">
                      Secure Ballot Tower
                      <br />
                      Plot 1234, Shehu Shagari Way
                      <br />
                      Central Business District
                      <br />
                      Abuja, FCT, Nigeria
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Support Hours</CardTitle>
                <CardDescription>When you can reach our team</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span>8:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span>9:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span>10:00 AM - 4:00 PM</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    During election periods, our support team is available 24/7.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regional Offices</CardTitle>
                <CardDescription>Find us across Nigeria</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Lagos Office</p>
                      <p className="text-sm text-muted-foreground">
                        Victoria Island, Lagos
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Kano Office</p>
                      <p className="text-sm text-muted-foreground">
                        Kano Municipal, Kano
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Port Harcourt Office</p>
                      <p className="text-sm text-muted-foreground">
                        GRA, Port Harcourt
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Enugu Office</p>
                      <p className="text-sm text-muted-foreground">
                        New Haven, Enugu
                      </p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">
            Frequently Asked Support Questions
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>I can't log in to my account</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  If you're having trouble logging in, make sure you're using
                  the correct NIN and VIN. If you've forgotten your credentials,
                  you can verify your identity at your local INEC office.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/faq#technical-issues">Learn More</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>I didn't receive my OTP</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  If you don't receive your OTP, check that you're using the
                  phone number registered with INEC. You can request a new OTP
                  after 5 minutes. If issues persist, contact our support team.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/faq#technical-issues">Learn More</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How do I update my information?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Personal information updates (address, phone number, etc.)
                  must be made through INEC's voter registration update process.
                  Visit your local INEC office with your identification
                  documents.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/faq#voting-process">Learn More</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Our Team</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="flex flex-col items-center text-center">
              <CardContent className="pt-6">
                <div className="mb-4 rounded-full overflow-hidden w-32 h-32 mx-auto border-4 border-primary/20">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_20240623_155213_773.jpg-tnpHKjbiTk47zfdERM0zBtB6I0BR1N.webp"
                    alt="Okoye Chikeluba Arthur"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">Okoye Chikeluba Arthur</h3>
                <p className="text-primary font-medium mb-2">
                  Founder & Chief Innovator
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Visionary leader behind Secure Ballot, committed to
                  transforming Nigeria's electoral system through secure and
                  transparent technology.
                </p>
                <div className="flex justify-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() =>
                      window.open("https://twitter.com/secureballot", "_blank")
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-twitter"
                    >
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                    </svg>
                    <span className="sr-only">Twitter</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() =>
                      window.open(
                        "https://linkedin.com/in/secureballot",
                        "_blank"
                      )
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-linkedin"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect width="4" height="12" x="2" y="9" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                    <span className="sr-only">LinkedIn</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() =>
                      (window.location.href = "mailto:arthur@secureballot.ng")
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-mail"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    <span className="sr-only">Email</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="flex flex-col items-center text-center">
              <CardContent className="pt-6">
                <div className="mb-4 rounded-full overflow-hidden w-32 h-32 mx-auto border-4 border-primary/20">
                  <img
                    src="/placeholder.svg?height=128&width=128"
                    alt="Team Member"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">Adebayo Oluwaseun</h3>
                <p className="text-primary font-medium mb-2">
                  Chief Technology Officer
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Leading our technical team to build robust, secure, and
                  scalable voting infrastructure for Nigeria's future.
                </p>
                <div className="flex justify-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() =>
                      window.open(
                        "https://twitter.com/secureballot_cto",
                        "_blank"
                      )
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-twitter"
                    >
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                    </svg>
                    <span className="sr-only">Twitter</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() =>
                      window.open("https://linkedin.com/in/adebayo", "_blank")
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-linkedin"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect width="4" height="12" x="2" y="9" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                    <span className="sr-only">LinkedIn</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() =>
                      (window.location.href = "mailto:adebayo@secureballot.ng")
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-mail"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    <span className="sr-only">Email</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="flex flex-col items-center text-center">
              <CardContent className="pt-6">
                <div className="mb-4 rounded-full overflow-hidden w-32 h-32 mx-auto border-4 border-primary/20">
                  <img
                    src="/placeholder.svg?height=128&width=128"
                    alt="Team Member"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">Ngozi Chukwu</h3>
                <p className="text-primary font-medium mb-2">
                  Head of Security
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Expert in cybersecurity ensuring that every vote is protected
                  with state-of-the-art encryption and security protocols.
                </p>
                <div className="flex justify-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() =>
                      window.open(
                        "https://twitter.com/secureballot_sec",
                        "_blank"
                      )
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-twitter"
                    >
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                    </svg>
                    <span className="sr-only">Twitter</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() =>
                      window.open("https://linkedin.com/in/ngozi", "_blank")
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-linkedin"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect width="4" height="12" x="2" y="9" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                    <span className="sr-only">LinkedIn</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() =>
                      (window.location.href = "mailto:ngozi@secureballot.ng")
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-mail"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    <span className="sr-only">Email</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-4">
            Need Immediate Assistance?
          </h2>
          <p className="mb-6 text-muted-foreground max-w-2xl mx-auto">
            For urgent matters during the voting period, our support team is
            available 24/7 via phone or live chat.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => {
                toast({
                  title: "Support Call Initiated",
                  description: "Connecting you to our support team...",
                });
                // In a real app, this would initiate a call
              }}
            >
              <Phone className="mr-2 h-4 w-4" />
              Call Support
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                toast({
                  title: "Live Chat",
                  description: "Opening live chat support...",
                });
                // In a real app, this would open a chat widget
              }}
            >
              Start Live Chat
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 text-lg font-semibold">Secure Ballot</h3>
              <p className="text-sm text-muted-foreground">
                Nigeria's most secure and transparent voting platform for the
                2027 General Elections.
              </p>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-primary"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="text-muted-foreground hover:text-primary"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/privacy"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/security"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Security
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">Connect</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      window.open("https://twitter.com/secureballot", "_blank");
                    }}
                  >
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(
                        "https://facebook.com/secureballot",
                        "_blank"
                      );
                    }}
                  >
                    Facebook
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(
                        "https://instagram.com/secureballot",
                        "_blank"
                      );
                    }}
                  >
                    Instagram
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
            <p>© 2027 Secure Ballot. All rights reserved. Powered by INEC.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
