'use client';
import React, { useState, useEffect } from 'react';
import { PlusCircle, Clock, Search, MoreVertical, BookMarked, Copy, Trash, Upload, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Assuming these would be fetched from an API in a real application
const recentReportsData = [
  { id: 1, title: 'Sales Report 2024', date: '2024-03-15' },
  { id: 2, title: 'Q1 Analysis', date: '2024-03-10' },
  { id: 3, title: 'Marketing Strategy', date: '2024-03-05' }
];

const publishedReportsData = [
  { id: 4, title: 'Annual Review 2023', date: '2023-12-31' },
  { id: 5, title: 'Q4 Performance', date: '2023-12-15' }
];

const ReportDropdownMenu = ({ isPublished = false }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="More options">
        <MoreVertical className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem>
        <Copy className="mr-2 h-4 w-4" />
        Copy as new
      </DropdownMenuItem>
      {!isPublished && (
        <DropdownMenuItem>
          <Upload className="mr-2 h-4 w-4" />
          Publish
        </DropdownMenuItem>
      )}
      <DropdownMenuItem className="text-destructive">
        <Trash className="mr-2 h-4 w-4" />
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const SideMenu = () => {
  // State variables
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentOpen, setRecentOpen] = useState(false);     // Closed by default
  const [publishedOpen, setPublishedOpen] = useState(false); // Closed by default
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState<'recent' | 'published' | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Existing state for reports
  const [recentReports, setRecentReports] = useState(recentReportsData);
  const [publishedReports, setPublishedReports] = useState(publishedReportsData);

  // Filtered reports based on search term
  const filteredRecentReports = recentReports.filter(report =>
    report.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPublishedReports = publishedReports.filter(report =>
    report.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Simulating data fetching
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Simulated API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        // If this were a real API call, you'd set the data here
      } catch (err) {
        setError('Failed to fetch reports. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSectionClick = (section: 'recent' | 'published') => {
    if (isCollapsed) {
      setIsCollapsed(false);
      setActiveSection(section);
      if (section === 'recent') {
        setRecentOpen(true);
        setPublishedOpen(false);
      } else {
        setPublishedOpen(true);
        setRecentOpen(false);
      }
    } else {
      if (section === 'recent') {
        setRecentOpen(!recentOpen);
      } else {
        setPublishedOpen(!publishedOpen);
      }
    }
    // Always reset activeSection when expanding
    if (!isCollapsed) {
      setActiveSection(null);
    }
  };

  return (
    <div className={`h-screen border-r bg-card transition-all duration-300 ease-in-out ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="p-4 border-b h-[200px] flex flex-col justify-between">
        <div className={`flex flex-col items-center ${isCollapsed ? 'w-full' : ''}`}>
          <img 
            src={isCollapsed ? "/gaply-g-logo-181124.svg" : "/gaply-logo-181124.svg"}
            alt="Gaply Logo" 
            className="h-24"
          />
          {!isCollapsed && <h1 className="font-graphik-xcondensed font-bold text-lg mt-2">GapMap Reports</h1>}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`${isCollapsed ? 'w-full' : 'ml-auto'}`}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      
      <ScrollArea className="h-[calc(100vh-64px)]">
        <div className="p-4 space-y-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="default" className={`w-full justify-start ${isCollapsed ? 'px-2' : ''}`}>
                  <PlusCircle className="h-4 w-4" />
                  {!isCollapsed && <span className="ml-2">New Report</span>}
                </Button>
              </TooltipTrigger>
              {isCollapsed && <TooltipContent side="right">New Report</TooltipContent>}
            </Tooltip>
          </TooltipProvider>

          {!isCollapsed && (
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search" 
                className="pl-8"
                value={searchTerm}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchTerm(value);

                  if (value) {
                    setRecentOpen(true);
                    setPublishedOpen(true);
                  } else {
                    setRecentOpen(false);
                    setPublishedOpen(false);
                  }
                }}
                aria-label="Search reports"
              />
            </div>
          )}

          {isLoading ? (
            <div className="text-center">Loading reports...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <>
              <Collapsible open={recentOpen} onOpenChange={() => handleSectionClick('recent')}>
                <CollapsibleTrigger className={`flex w-full items-center justify-between p-2 hover:bg-muted rounded-md ${activeSection === 'recent' ? 'bg-muted' : ''}`}>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4" />
                    {!isCollapsed && <span className="ml-2">Recent</span>}
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${recentOpen ? 'transform rotate-180' : ''} ${isCollapsed ? 'hidden' : ''}`} />
                </CollapsibleTrigger>
                {(!isCollapsed || activeSection === 'recent') && (
                  <CollapsibleContent className="space-y-1 mt-1">
                    {filteredRecentReports.length > 0 ? (
                      filteredRecentReports.map((report) => (
                        <div key={report.id} className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                          <div className="flex flex-col">
                            <span className="text-sm">{report.title}</span>
                            <span className="text-xs text-muted-foreground">{report.date}</span>
                          </div>
                          <ReportDropdownMenu />
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground p-2">No recent reports found</div>
                    )}
                  </CollapsibleContent>
                )}
              </Collapsible>

              <Collapsible open={publishedOpen} onOpenChange={() => handleSectionClick('published')}>
                <CollapsibleTrigger className={`flex w-full items-center justify-between p-2 hover:bg-muted rounded-md ${activeSection === 'published' ? 'bg-muted' : ''}`}>
                  <div className="flex items-center">
                    <BookMarked className="h-4 w-4" />
                    {!isCollapsed && <span className="ml-2">Published</span>}
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${publishedOpen ? 'transform rotate-180' : ''} ${isCollapsed ? 'hidden' : ''}`} />
                </CollapsibleTrigger>
                {(!isCollapsed || activeSection === 'published') && (
                  <CollapsibleContent className="space-y-1 mt-1">
                    {filteredPublishedReports.length > 0 ? (
                      filteredPublishedReports.map((report) => (
                        <div key={report.id} className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                          <div className="flex flex-col">
                            <span className="text-sm">{report.title}</span>
                            <span className="text-xs text-muted-foreground">{report.date}</span>
                          </div>
                          <ReportDropdownMenu isPublished />
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground p-2">No published reports found</div>
                    )}
                  </CollapsibleContent>
                )}
              </Collapsible>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default SideMenu;

