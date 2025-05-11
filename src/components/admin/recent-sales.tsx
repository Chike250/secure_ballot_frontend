import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"

export function RecentSales() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
        <CardDescription>Track your recent sales activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div>Recent Sales Content</div>
      </CardContent>
    </Card>
  )
}
