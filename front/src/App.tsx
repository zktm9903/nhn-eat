import { BsHandThumbsDown } from "react-icons/bs";
import { BsHandThumbsUp } from "react-icons/bs";
import { BsPerson } from "react-icons/bs";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

interface Menu {
  id: string;
  name: string;
  detail: string;
  kcal: number;
  previewImgSrc: string;
  eat: number;
  good: number;
  bad: number;
}

function App() {
  const [menus, setMenus] = useState<Menu[]>([]);

  const [eat, setEat] = useState(false);
  const [good, setGood] = useState(false);
  const [bad, setBad] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/today")
      .then((res) => res.json())
      .then((data) => setMenus(data));
  }, []);

  const clickEat = (id: string) => {
    if (eat) {
      setEat(false);
      fetch(`http://localhost:3000/menu/${id}?eat=false`);
    } else {
      setEat(true);
      fetch(`http://localhost:3000/menu/${id}?eat=true`);
    }
  };

  const clickGood = (id: string) => {
    if (good) {
      setGood(false);
      fetch(`http://localhost:3000/menu/${id}?good=false`);
    } else {
      setGood(true);
      fetch(`http://localhost:3000/menu/${id}?good=true`);
    }
  };

  const clickBad = (id: string) => {
    if (bad) {
      setBad(false);
      fetch(`http://localhost:3000/menu/${id}?bad=false`);
    } else {
      setBad(true);
      fetch(`http://localhost:3000/menu/${id}?bad=true`);
    }
  };

  return (
    <div className="flex flex-col gap-2 divide-y-[1px] divide-gray-400">
      <h1 className="pt-2">{dayjs().format("YYYY-MM-DD dddd")}</h1>
      {menus.map((menu) => (
        <article key={menu.id} className="pt-2">
          <div className="flex justify-between text-base">
            <h1 className="flex text-right font-semibold text-[#222222]">
              {menu.name}
            </h1>
            <p className="text-gray-800">{menu.kcal}kcal</p>
          </div>
          <p className="text-xs text-gray-800">{menu.detail}</p>
          <img
            src={menu.previewImgSrc}
            className="mt-1 rounded-sm"
            onClick={() => window.open(menu.previewImgSrc, "_blank")}
          />
          <div className="mt-1 flex items-center justify-end gap-2 text-xs">
            <div
              className="flex items-center gap-1 hover:scale-110"
              onClick={() => clickEat(menu.id)}
            >
              <BsPerson className="scale-125" />
              <p>{menu.eat}</p>
            </div>
            <div
              className="flex items-center gap-1 hover:scale-110"
              onClick={() => clickGood(menu.id)}
            >
              <BsHandThumbsUp />
              <p>{menu.good}</p>
            </div>
            <div
              className="flex items-center gap-1 hover:scale-110"
              onClick={() => clickBad(menu.id)}
            >
              <BsHandThumbsDown />
              <p>{menu.bad}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export default App;
