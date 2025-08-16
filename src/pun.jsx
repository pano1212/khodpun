import React, { useState } from 'react'

export const Pun = () => {
  const [move, setmove] = useState({ top: 100, left: 100 });
  const [numm, setNum] = useState(1)
  const moveRandom = () => {
    const maxX = window.innerWidth - 100
    const maxY = window.innerHeight - 50
    const randomX = Math.floor(Math.random() * maxX)
    const randomy = Math.floor(Math.random() * maxY);
    setmove({ top: randomy, left: randomX })
    setNum(numm + 1);

  };

  return (
    <div
      className={`min-h-screen ${numm === 5 ? "bg-black" : "bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400"
        } flex flex-col items-center`}
    >
      {/* Title */}
      <div className="w-full text-center py-5 bg-black/60 shadow-lg">
        <p className="text-4xl font-extrabold text-yellow-300 drop-shadow-lg tracking-widest animate-pulse">
          ປັ່ນ ຊື່ ດອກ
        </p>
      </div>

      {/* Game Area */}
      <div className="h-min relative flex-1 w-full flex justify-center items-center overflow-hidden">
        {/* Button */}
        <button
          className={`px-8 py-4 font-extrabold text-white absolute rounded-xl shadow-2xl border-4 border-orange-500 
        ${(numm === 2 || numm === 3) && "animate-spin"
            } bg-gradient-to-r from-green-400 via-green-600 to-green-800 hover:scale-110 transition-transform`}
          onClick={moveRandom}
          style={{
            top: move.top,
            left: move.left,
            transition: "top 0.3s, left 0.3s",
          }}
        >
          {numm === 4 ? "⚠ ເຕືອນລະເດີ ⚠" : numm === 5 ? "ແຮ່" : " ຢ່າກົດ!"}
        </button>

        {/* Special Event */}
        {numm === 5 && (
          <img
            src="https://th.bing.com/th/id/OIP.V0npe_Q1op_2gN92DIXnwAHaH3?w=168&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
            alt=""
            className="h-96 mt-40 w-full object-contain animate-bounce"
          />
        )}
      </div>

      {/* Footer */}
      <div className="w-full bg-black/70 py-2 text-center ">
        <p className="text-sm text-gray-300 px-2">ຕິດຕໍ່ງານ  :
          <a
            className="text-sm px-2 text-blue-500"
            href="https://www.facebook.com/share/19jkLvKysj/?mibextid=wwXIfr">
            Pano nosavanh 
          </a> </p>

      </div>
    </div>

  )
}
