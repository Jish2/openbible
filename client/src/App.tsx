import { useState } from "react";
import genesis from "../public/genesis.json";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="max-w-[30rem] p-4">
        {genesis.chapters.map((chapter, index) => (
          <div className="py-2">
            <sup className="text-xs font-bold pr-1">{index + 1}</sup>

            {chapter}
          </div>
        ))}
        <h1 className="bg-red-200">Vite + React</h1>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque amet
            obcaecati tenetur, similique quos voluptas nemo placeat a possimus,
            earum veritatis cupiditate esse illo reiciendis? Delectus ipsam
            fugit sint facere. Edit <code>src/App.tsx</code> and save to test
            HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </div>
  );
}

export default App;
