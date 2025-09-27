import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import React, { useState } from 'react'

export const Pun = () => {
  const [move, setmove] = useState({ top: 100, left: 100 });
  const [numm, setNum] = useState(1);
  const [inputName, setInputName] = useState('')
  const moveRandom = () => {
    const maxX = window.innerWidth - 100
    const maxY = window.innerHeight - 30
    const randomX = Math.floor(Math.random() * maxX)
    const randomy = Math.floor(Math.random() * maxY);
    setmove({ top: randomy, left: randomX })
    setNum(numm + 1);

  };

  return (
    <div
      className={`min-h-screen ${numm === 9 ? "bg-black" : "bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400"
        } flex flex-col items-center`}
    >
      {/* Title */}
      <div className="w-full text-center py-5 bg-black/60 shadow-lg ">
        {/* <IconButton className='h-10 w-10 text-green-500  ' /> */}
        <p className="text-4xl font-extrabold text-yellow-300 drop-shadow-lg tracking-widest animate-pulse">
          ປັ່ນ ຊື່ ດອກ
        </p>
      </div>

      {/* Game Area */}
      <div className="h-min relative flex-1 w-full flex justify-center items-center overflow-hidden">
        {/* Button */}
        {numm !== 5 && (<button
          className={`px-8 py-4 font-extrabold text-white absolute rounded-xl shadow-2xl border-4 border-orange-500 
            } bg-gradient-to-r from-green-400 via-green-600 to-green-800 hover:scale-110 transition-transform`}
          onClick={moveRandom}
          style={{
            top: move.top,
            left: move.left,
            transition: "top 0.3s, left 0.3s",
          }}
        >
          {numm === 8 ? "⚠ ເຕືອນລະເດີ ⚠"
            : numm === 9 ? "ແຮ່"
              : numm === 4 ? "ແນ່ໃຈລະບໍ"
                : numm === 9 ? "ແຮ່" : " ຢ່າກົດ!"}
        </button>)}

        {/* Special Event */}
        {numm === 9 && (
          <img
            src="https://th.bing.com/th/id/OIP.V0npe_Q1op_2gN92DIXnwAHaH3?w=168&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
            alt=""
            className="h-96 mt-40 w-full object-contain animate-bounce"
          />
        )}
        {numm === 5 && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="p-5 bg-white flex flex-col rounded-lg shadow-lg text-center w-80">
              <p className="mb-3 font-medium text-gray-700">
                ກະລຸນາປ້ອນຊື່ຄົນທີ່ທ່ານຮັກ
              </p>
              <input
                type="text"
                onChange={(e) => setInputName(e.target.value)}
                value={inputName}
                className="rounded-sm p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="ຊື່..."
              />
              <button
                className="border mt-5 py-2 rounded-sm bg-pink-500 text-white hover:bg-pink-600 transition"
                onClick={inputName != '' ? moveRandom : ''}
                style={{
                  top: move.top,
                  left: move.left,
                  transition: "top 0.3s, left 0.3s",
                }}
              >
                OK
              </button>
            </div>
          </div>
        )}

        {numm === 6 && (
          <p className='text-5xl text-center font-bold animate-bounce text-white'>
            {inputName} ເຂົາບໍ່ຮັກເຈົ້າດອກກກກກກ ວ້າຍຍຍຍ
          </p>
        )}

      </div>

      {/* Footer */}
      <div className="w-full bg-black/70 py-2 text-center ">
        <p className="text-sm text-gray-300 px-2">ໂສດເດີ  :
          <a
            className="text-sm px-2 text-blue-500"
            href="https://www.facebook.com/share/19jkLvKysj/?mibextid=wwXIfr">
            Pano nosavanh
          </a> </p>

      </div>
    </div>

  )
}
