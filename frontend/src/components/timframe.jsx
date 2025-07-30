import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { addDays, format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TimeFrameSelector = ({ onTimeFrameChange }) => {
  const [date, setDate] = useState({
    from: new Date(2025, 0, 1),
    to: addDays(new Date(2025, 0, 1), 30),
  });

  const handleSelect = (value) => {
    const today = new Date();
    let newRange = { from: today, to: today };

    switch (value) {
        case "today":
            newRange = { from: today, to: today };
      case "7d":
        newRange = { from: addDays(today, -7), to: today };
        break;
      case "30d":
        newRange = { from: addDays(today, -30), to: today };
        break;
      case "90d":
        newRange = { from: addDays(today, -90), to: today };
        break;
      default:
        break;
    }

    setDate(newRange);
    onTimeFrameChange(newRange);
  };

  return (
    <div className="flex items-center space-x-2">
      <Select onValueChange={handleSelect}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select time frame" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1d"> today</SelectItem>
          <SelectItem value="7d">Last 7 days</SelectItem>
          <SelectItem value="30d">Last 30 days</SelectItem>
          <SelectItem value="90d">Last 90 days</SelectItem>
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[260px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(newDate) => {
              setDate(newDate);
              if (newDate?.from && newDate?.to) {
                onTimeFrameChange(newDate);
              }
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TimeFrameSelector;
