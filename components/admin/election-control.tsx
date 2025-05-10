"use client"

import { Activity, Calendar, Clock, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ElectionControl() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="mr-2 h-5 w-5" />
          Active Elections
        </CardTitle>
        <CardDescription>Monitor and control ongoing elections</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="presidential">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="presidential">Presidential</TabsTrigger>
            <TabsTrigger value="gubernatorial">Gubernatorial</TabsTrigger>
            <TabsTrigger value="local">Local</TabsTrigger>
          </TabsList>
          <TabsContent value="presidential" className="space-y-4">
            <div className="rounded-lg border p-4 mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Presidential Election 2023</h3>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <Calendar className="mr-1 h-4 w-4" />
                    <span>February 25, 2023</span>
                  </div>
                </div>
                <Button variant="destructive" size="sm">
                  End Election
                </Button>
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                      <span>Time Elapsed</span>
                    </div>
                    <span>8h 45m / 12h</span>
                  </div>
                  <Progress value={73} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <div className="flex items-center">
                      <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                      <span>Voter Turnout</span>
                    </div>
                    <span>24.9M / 93.4M (26.7%)</span>
                  </div>
                  <Progress value={27} className="h-2" />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <Button variant="outline" size="sm">
                  View Live Results
                </Button>
                <Button variant="outline" size="sm">
                  Polling Units Map
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="gubernatorial" className="space-y-4">
            <div className="rounded-lg border p-4 mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Lagos State Gubernatorial Election</h3>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <Calendar className="mr-1 h-4 w-4" />
                    <span>March 11, 2023</span>
                  </div>
                </div>
                <Button variant="destructive" size="sm">
                  End Election
                </Button>
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                      <span>Time Elapsed</span>
                    </div>
                    <span>6h 20m / 10h</span>
                  </div>
                  <Progress value={63} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <div className="flex items-center">
                      <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                      <span>Voter Turnout</span>
                    </div>
                    <span>1.8M / 7.0M (25.7%)</span>
                  </div>
                  <Progress value={26} className="h-2" />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <Button variant="outline" size="sm">
                  View Live Results
                </Button>
                <Button variant="outline" size="sm">
                  Polling Units Map
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="local" className="space-y-4">
            <div className="flex items-center justify-center h-[200px] text-muted-foreground">
              No active local government elections
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
