import { Fragment, useState, useEffect, useRef } from "react";
import john1 from "../../bible/books/john-1.json";
import { cn } from "./utils/cn";
import { MessageCircle } from "lucide-react";
import { Avatar } from "./components/avatar";
import { COLORS } from "./utils/constants";

type User = {
  name: string;
  id: string;
  scrollVerse: number;
};

type Comment = {
  text: string;
  userID: string;
};

type VerseInfo = {
  highlights: string[]; //uuid[]
  comments: Comment[];
  selected: string[]; //uuid[]
};

type websocketEvent = {
  Action: string;
  VerseID?: number;
  Message?: string;
  UUID?: string;
  Msg?: any;
  Body?: any;
};

type EventAction = "comment" | "highlight" | "select" | "deselect";

type Event = {
  Action: EventAction;
  VerseID: number;
  Message: string;
  UUID: string;
};

function App() {
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const [users, setUsers] = useState<User[]>([]);

  const [verses, setVerses] = useState<VerseInfo[]>(() => {
    return [...Array(john1.length)].map(
      (_) =>
        ({
          highlights: [],
          comments: [],
          selected: [],
        }) as VerseInfo,
    );
  });

  useEffect(() => {
    console.log("NEW VERSE UPDATE");
    console.log(verses);
  }, [verses]);

  const [userID, setUserID] = useState<string>("");

  const ws = useRef<any>(null);

  const handleVerseEvent = (event: Event) => {
    const index = event.VerseID;

    if (event.Action === "select") {
      const newVerses = [...verses];
      newVerses[index].selected = [...newVerses[index].selected, event.UUID];
      setVerses(newVerses);
    }
    if (event.Action === "deselect") {
      const newVerses = [...verses];
      newVerses[index].selected = newVerses[index].selected.filter(
        (uuid) => uuid !== event.UUID,
      );
      setVerses(newVerses);
    }
    if (event.Action === "highlight") {
      const newVerses = [...verses];
      newVerses[index].highlights = [
        ...newVerses[index].highlights,
        event.UUID,
      ];
      setVerses(newVerses);
    }
    if (event.Action === "comment") {
      const newVerses = [...verses];
      newVerses[index].comments = [
        ...newVerses[index].comments,
        { text: event.Message, userID: event.UUID },
      ];
      setVerses(newVerses);
    }
  };

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8080/ws");
    ws.current.onopen = () => console.log("ws opened");
    ws.current.onclose = () => console.log("ws closed");

    const wsCurrent = ws.current;

    return () => {
      wsCurrent.close();
    };
  }, []);

  useEffect(() => {
    if (!ws.current) {
      return;
    }
    ws.current.onmessage = (event: any) => {
      console.log(event.data);
      const parse: websocketEvent = JSON.parse(event.data);
      console.log(parse);
      if (parse.Action === "subscribe") {
        setUserID(parse.Msg);
        if (parse.Body) {
          for (let i = 0; i < parse.Body.length; i++) {
            handleVerseEvent(parse.Body[i]);
          }
        }
      } else if (parse.Action === "positions") {
        setUsers(parse.Body);
      } else {
        handleVerseEvent(parse as Event);
      }
    };
  }, []);

  const sendMessage = (verse: number, action: EventAction, message: string) => {
    ws.current.send(
      JSON.stringify({
        Action: action,
        VerseID: verse,
        Message: message,
      }),
    );
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div
        className="fixed top-0 w-full z-10 flex py-2 px-4 justify-between bg-background shadow-derek"
        onClick={() => setShowMenu((p) => !p)}
      >
        <div className="flex items-center gap-2">
          <h1 className="font-bold dark:bg-red-500 dark:text-nowrap">
            OpenBible
          </h1>
          <a
            href="https://github.com/jish2/openbible"
            target="_blank"
            rel="noreferrer"
          >
            <img
              id="github"
              src="/github.svg"
              alt="github"
              className="size-4 invert"
            />
          </a>
        </div>

        <div className="flex -space-x-2 overflow-hidden">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <Avatar key={i} color={COLORS[i]} zIndex={100 - i} />
            ))}
        </div>
      </div>
      <div className="max-w-[30rem] p-4 pt-16">
        <h1 className="font-bold text-2xl my-2">John 1</h1>
        {john1.map(([key, verse], i) => {
          const indent =
            i !== 0 &&
            (john1[i - 1][0] === "spacer" || john1[i - 1][0] === "title");

          if (key === "spacer") return <br key={i} />;
          if (key === "title")
            return (
              <h3 className="font-bold mt-5 mb-1" key={i}>
                {verse}
              </h3>
            );

          return <Verse key={i} number={key} verse={verse} indent={indent} />;
        })}
      </div>
      <button
        className="fixed bottom-0 left-0 p-4 bg-red-300"
        onClick={() => setShowMenu((p) => !p)}
      >
        trigger
      </button>
      <div
        className={cn(
          showMenu
            ? "animate-fly-in opacity-100"
            : "animate-fly-out opacity-0 ",
          "transition-opacity delay-0",
          "fixed bottom-10 bg-white rounded-full shadow-aesthetic py-2 px-2 flex",
        )}
      >
        {["🏠", "🖍️", "💬"].map((item) => (
          <div className="px-2">{item}</div>
        ))}
      </div>
    </div>
  );
}

export default App;

interface VerseProps {
  number: string;
  verse: string;
  indent: boolean;
}

const Verse = ({ number, verse, indent }: VerseProps) => {
  const [active, setActive] = useState<boolean>(false);

  return (
    <Fragment>
      {indent && <div className="w-6 inline-block" />}
      <span
        className="py-2 cursor-pointer"
        onClick={() => setActive((p) => !p)}
      >
        <sup className="text-xs text-gray-500 pr-1">{number}</sup>
        <span
          className={cn(
            active && "underline decoration-dotted underline-offset-4",
          )}
        >
          {verse}
        </span>
        <div className="w-1.5 inline-block" />
      </span>
      <div className="shadow-derek inline-block p-1 mr-2 rounded-md cursor-pointer relative">
        <div className="bg-red-600 rounded-full size-2 absolute -top-0.5 -right-0.5" />
        <div className="flex gap-1 items-center">
          {/* <span className="text-xs">13</span> */}
          <MessageCircle size={12} className="" />
        </div>
      </div>
    </Fragment>
  );
};
