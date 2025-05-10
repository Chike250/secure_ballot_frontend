"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SearchIcon, Filter } from "lucide-react"

export function Search() {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, this would trigger a search API call
    console.log("Searching for:", searchQuery)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="flex flex-col space-y-4">
          <div className="flex w-full items-center space-x-2">
            <Input
              type="text"
              placeholder="Search users, elections, or logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">
              <SearchIcon className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" type="button">
              <Filter className="h-4 w-4 mr-1" />
              Users
            </Button>
            <Button variant="outline" size="sm" type="button">
              <Filter className="h-4 w-4 mr-1" />
              Elections
            </Button>
            <Button variant="outline" size="sm" type="button">
              <Filter className="h-4 w-4 mr-1" />
              Logs
            </Button>
            <Button variant="outline" size="sm" type="button">
              <Filter className="h-4 w-4 mr-1" />
              Reports
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
