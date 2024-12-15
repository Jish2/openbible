// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
import { EventAction, VerseInfo } from "@/App";
import { Avatar } from "@/components/avatar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/sheet";
import { Dispatch, SetStateAction, useState } from "react";
import john1 from "../../../bible/books/john-1.json";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { Highlighter, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomSheetProps {
  setSelectedVerse: Dispatch<SetStateAction<number | null>>;
  verseNumber: number | null;
  verses: VerseInfo[];
  sendMessage: (verse: number, action: EventAction, message: string) => void;
  isHighlighted: (verseNumber: number) => boolean;
}

export const BottomSheet = ({
  verseNumber,
  verses,
  sendMessage,
  setSelectedVerse,
  isHighlighted,
}: BottomSheetProps) => {
  const [message, setMessage] = useState<string>("");

  const onSubmit = () => {
    if (!verseNumber) return;
    sendMessage(verseNumber, "comment", message);
    setMessage("");
  };
  const onHighlight = () => {
    console.log("highlighted");
    if (!verseNumber) return;
    sendMessage(verseNumber, "highlight", message);
    setMessage("");
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      <Sheet
        open={verseNumber !== null}
        onOpenChange={(newState) => {
          if (!newState) {
            setSelectedVerse(null);
          }
        }}
      >
        {/* <button onClick={() => setOpenSheet((p) => !p)}>foo</button> */}
        {/* <SheetTrigger asChild>
          <Button variant="outline">Toggle</Button>
        </SheetTrigger> */}
        <SheetContent side="bottom" className="max-h-[50vh] h-[50vh]">
          <div
            className="absolute -top-14 left-4 flex items-center gap-2 cursor-pointer"
            onClick={onHighlight}
          >
            <Button
              className={cn(
                "rounded-full max-w-10 shadow-derek text-background",
              )}
              variant="outline"
            >
              <Highlighter />
            </Button>
            <p className="text-white">
              {isHighlighted(verseNumber ?? -1)
                ? "You've highlighted this verse"
                : "Highlight this verse"}
            </p>
          </div>
          <SheetHeader>
            <SheetTitle>John 1:{verseNumber}</SheetTitle>
            <SheetDescription>
              {verseNumber
                ? john1.find((verse) => verse[0] === String(verseNumber))?.[1]
                : ""}
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-4 px-6 overflow-scroll h-[calc(50vh-6rem)]">
              {verseNumber
                ? verses[verseNumber]?.comments.map(
                    ({ name, userID, text }) => {
                      return (
                        <div className="border border-solid border-gray-300 p-4 rounded-lg">
                          <div className="flex items-center gap-2 pb-2">
                            <Avatar name={name} userID={userID} className="" />
                            <p>
                              <strong>{name}</strong>
                              {/* highlighted this passage. */}
                            </p>
                          </div>
                          <div>
                            <p>{text}</p>
                          </div>
                        </div>
                      );
                    },
                  )
                : null}

              <div className="min-h-32 w-full text-xs text-center text-neutral-500">
                {!verseNumber || verses[verseNumber]?.comments.length === 0
                  ? "be the first to annotate this verse!"
                  : "you've reached the end."}
              </div>

              <div className="fixed bottom-5 w-[calc(100%-6rem)] flex gap-2">
                <Input
                  placeholder="annotate this verse"
                  type="text"
                  className="rounded-full shadow-derek text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onSubmit();
                  }}
                  onChange={(e) => setMessage(e.target.value)}
                  value={message}
                />
                <Button
                  className="rounded-full max-w-10 shadow-derek"
                  variant="outline"
                  onClick={onSubmit}
                >
                  <Send />
                </Button>
              </div>
            </div>
          </div>
          {/* <SheetFooter>
            <SheetClose asChild>
              <Button type="submit">Save changes</Button>
            </SheetClose>
          </SheetFooter> */}
        </SheetContent>
      </Sheet>
    </div>
  );
};
