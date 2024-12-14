import { Fragment, useState } from "react";
import john1 from "../../bible/books/john-1.json";
import { cn } from "./utils/cn";
import { MessageCircle } from "lucide-react";

function App() {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="max-w-[30rem] p-4">
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
