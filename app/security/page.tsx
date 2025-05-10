import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  Shield,
  Lock,
  Eye,
  Server,
  CheckCircle,
  Fingerprint,
  Database,
  Globe,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <Button variant="ghost" size="sm" className="mb-4" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold">Security & Privacy</h1>
            <p className="text-muted-foreground mt-2">How we protect your vote and personal information</p>
          </div>
          <div className="flex items-center gap-2 bg-primary/10 p-2 rounded-lg">
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">ISO 27001 Certified</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>End-to-End Encryption</CardTitle>
              <CardDescription>Your vote is encrypted from the moment it's cast</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                We use military-grade ECC & AES-256 encryption to ensure your vote remains confidential and tamper-proof
                throughout the entire process.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Blockchain Technology</CardTitle>
              <CardDescription>Immutable record of all votes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Our blockchain implementation creates a permanent, unalterable record of all votes while maintaining
                voter anonymity and preventing double-voting.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Fingerprint className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Multi-Factor Authentication</CardTitle>
              <CardDescription>Verify your identity securely</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                We use a combination of your NIN, VIN, biometrics, and one-time passwords to ensure only you can access
                your voting account.
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="mb-12">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="data">Data Protection</TabsTrigger>
            <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Our Security Approach</h2>
                <p className="mb-4">
                  At Secure Ballot, we've built our platform with security as the foundation. Our multi-layered approach
                  ensures the integrity of the electoral process while protecting voter privacy.
                </p>
                <p className="mb-4">
                  Our team includes cybersecurity experts from Nigeria's top institutions and international security
                  consultants with experience in electoral systems worldwide.
                </p>
                <div className="bg-muted p-4 rounded-lg mb-4">
                  <h3 className="font-medium mb-2 flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Security by Design
                  </h3>
                  <p className="text-sm">
                    Security isn't an afterthought—it's built into every aspect of our platform from the ground up,
                    following the principles of zero trust architecture.
                  </p>
                </div>
              </div>

              <div className="relative h-[300px] rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=600&width=800"
                  alt="Security Operations Center"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-4 text-white">
                    <p className="font-medium">24/7 Security Operations Center</p>
                    <p className="text-sm opacity-80">Continuous monitoring and threat detection</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Independent Audits</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Our systems undergo regular security audits by independent cybersecurity firms to verify integrity
                    and compliance with international standards.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Voter Privacy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Your personal information is stored separately from your voting choices, making it impossible to
                    link an individual to their specific vote.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Transparency</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    We provide tools for voters to verify their vote was correctly recorded and counted, while working
                    with independent observers to ensure accuracy.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="data" className="mt-6">
            <div className="space-y-6">
              <div className="bg-muted p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-2">Data Protection Principles</h2>
                <p>
                  We adhere to the highest standards of data protection to safeguard your personal information and
                  voting data.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Eye className="h-4 w-4 text-primary" />
                      </div>
                      <CardTitle className="text-lg">Vote Anonymization</CardTitle>
                    </div>
                    <CardDescription>How we protect your voting privacy</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Votes are cryptographically separated from voter identities</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Zero-knowledge proofs verify vote authenticity without revealing identity</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>
                          Multi-party computation prevents any single entity from accessing both vote and identity
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Lock className="h-4 w-4 text-primary" />
                      </div>
                      <CardTitle className="text-lg">Personal Data Protection</CardTitle>
                    </div>
                    <CardDescription>How we handle your personal information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Minimal data collection - we only collect what's necessary</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>All personal data is encrypted at rest and in transit</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Strict access controls limit who can view your information</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Data retention policies ensure data is deleted when no longer needed</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Data Flow Diagram</CardTitle>
                  <CardDescription>How your data moves through our secure system</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative h-[300px] rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                    <div className="text-center p-4">
                      <p className="text-muted-foreground">Interactive data flow diagram</p>
                      <Button variant="outline" className="mt-2">
                        View Diagram
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="infrastructure" className="mt-6">
            <div className="space-y-6">
              <div className="bg-muted p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-2">Secure Infrastructure</h2>
                <p>
                  Our platform is built on a robust, redundant infrastructure designed to withstand attacks and ensure
                  continuous availability.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Server className="h-4 w-4 text-primary" />
                      </div>
                      <CardTitle className="text-lg">Hosting Security</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>ISO 27001 certified data centers in Nigeria</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>24/7 physical security with biometric access</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Redundant power and cooling systems</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Fire suppression and environmental monitoring</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Globe className="h-4 w-4 text-primary" />
                      </div>
                      <CardTitle className="text-lg">Network Security</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>DDoS protection and mitigation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Web Application Firewall (WAF) protection</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Intrusion Detection and Prevention Systems</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>TLS 1.3 encryption for all connections</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 rounded-full bg-primary/10">
                        <AlertTriangle className="h-4 w-4 text-primary" />
                      </div>
                      <CardTitle className="text-lg">Disaster Recovery</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Geo-redundant backup systems</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Automated failover capabilities</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Regular disaster recovery testing</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>99.99% uptime SLA during election periods</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>System Architecture</CardTitle>
                  <CardDescription>Our multi-layered security architecture</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative h-[300px] rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                    <div className="text-center p-4">
                      <p className="text-muted-foreground">Interactive system architecture diagram</p>
                      <Button variant="outline" className="mt-2">
                        View Architecture
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="compliance" className="mt-6">
            <div className="space-y-6">
              <div className="bg-muted p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-2">Compliance & Certifications</h2>
                <p>
                  We adhere to international standards and local regulations to ensure the highest level of security and
                  privacy.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>International Standards</CardTitle>
                    <CardDescription>Global security certifications and compliance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center p-3 border rounded-lg">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                          <Shield className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">ISO 27001</p>
                          <p className="text-xs text-muted-foreground">Information Security</p>
                        </div>
                      </div>

                      <div className="flex items-center p-3 border rounded-lg">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                          <Lock className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">ISO 27701</p>
                          <p className="text-xs text-muted-foreground">Privacy Management</p>
                        </div>
                      </div>

                      <div className="flex items-center p-3 border rounded-lg">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                          <Server className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">SOC 2 Type II</p>
                          <p className="text-xs text-muted-foreground">Service Controls</p>
                        </div>
                      </div>

                      <div className="flex items-center p-3 border rounded-lg">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                          <Globe className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">GDPR</p>
                          <p className="text-xs text-muted-foreground">Data Protection</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Nigerian Regulations</CardTitle>
                    <CardDescription>Compliance with local laws and standards</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-medium mb-2">Nigeria Data Protection Regulation (NDPR)</h3>
                        <p className="text-sm text-muted-foreground">
                          We fully comply with NDPR requirements for data protection, privacy, and consent management.
                        </p>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <h3 className="font-medium mb-2">Electoral Act Compliance</h3>
                        <p className="text-sm text-muted-foreground">
                          Our platform adheres to all requirements of the Nigerian Electoral Act regarding electronic
                          voting systems.
                        </p>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <h3 className="font-medium mb-2">NITDA Guidelines</h3>
                        <p className="text-sm text-muted-foreground">
                          We follow all National Information Technology Development Agency guidelines for digital
                          services.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Independent Security Audits</CardTitle>
                  <CardDescription>Regular third-party security assessments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Shield className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Penetration Testing</p>
                          <p className="text-sm text-muted-foreground">Conducted quarterly by CyberSafe Nigeria</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                        Passed
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Lock className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Vulnerability Assessment</p>
                          <p className="text-sm text-muted-foreground">Monthly scans by SecurityMetrics</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                        Passed
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Eye className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Code Review</p>
                          <p className="text-sm text-muted-foreground">
                            Bi-annual review by independent security researchers
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                        Passed
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="bg-muted p-6 rounded-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">Have a Security Concern?</h2>
              <p className="text-muted-foreground mt-1">
                We take all security reports seriously and investigate them promptly.
              </p>
            </div>
            <Button>
              <Shield className="mr-2 h-4 w-4" />
              Report a Vulnerability
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
