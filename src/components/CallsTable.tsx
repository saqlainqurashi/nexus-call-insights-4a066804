import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Play } from "lucide-react";
import { format } from "date-fns";

interface Call {
  id: string;
  call_summary: string;
  transcript: string;
  recording_url: string;
  duration_seconds: number;
  hung_up_by: string;
  call_timestamp: string;
}

interface CallsTableProps {
  calls: Call[];
}

export const CallsTable = ({ calls }: CallsTableProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (calls.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No calls yet. Call data will appear here.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Summary</TableHead>
            <TableHead>Hung Up By</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {calls.map((call) => (
            <>
              <TableRow key={call.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium">
                  {format(new Date(call.call_timestamp), "MMM dd, yyyy HH:mm")}
                </TableCell>
                <TableCell>{formatDuration(call.duration_seconds)}</TableCell>
                <TableCell className="max-w-md truncate">{call.call_summary}</TableCell>
                <TableCell>
                  <Badge variant={call.hung_up_by === "user" ? "default" : "secondary"}>
                    {call.hung_up_by}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpand(call.id)}
                    >
                      {expandedId === call.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(call.recording_url, "_blank")}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              {expandedId === call.id && (
                <TableRow>
                  <TableCell colSpan={5} className="bg-muted/30">
                    <div className="p-4 space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Call Summary</h4>
                        <p className="text-sm text-muted-foreground">{call.call_summary}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Transcript</h4>
                        <div className="text-sm text-muted-foreground whitespace-pre-wrap max-h-64 overflow-y-auto rounded-md bg-background/50 p-3">
                          {call.transcript}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Recording</h4>
                        <audio controls className="w-full" src={call.recording_url}>
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
