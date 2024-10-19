import { useState } from 'react';
import img from './assets/img.jpg'; // You can use a birthday-themed image here
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAmazon, faFacebook, faRocketchat } from '@fortawesome/free-brands-svg-icons';
import { faGift, faBirthdayCake } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [click, setClick] = useState(false);

  const handleClick = () => {
    setClick(!click);
  };

  return (
    <div className="bg-gradient-to-r from-pink-300 via-purple-300 to-yellow-300 min-h-screen flex flex-col items-center justify-center font-mono">
      <div className="text-center text-4xl font-bold mb-8 text-yellow-600">
        <FontAwesomeIcon icon={faBirthdayCake} className="text-5xl text-pink-500 mr-4" />
        Happy Birthday, Puna!
      </div>

      <div className="text-center space-y-6">
        <h1 className="text-2xl font-bold text-purple-800">
          {click ? '🎉 Surprise! 🎉' : 'Click the gift to open'}
        </h1>
        <div className="flex justify-center">
          <img
            className="w-72 cursor-pointer rounded-lg shadow-lg transition duration-300 hover:scale-110"
            onClick={handleClick}
            src={click
              ? 'https://th.bing.com/th/id/OIP.gUp-hdAnYnxh87iMzm9n_wHaFG?w=262&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7' 
              : img
            }
            alt="Birthday surprise"
          />
        </div>

        <a 
          className="mt-8 inline-block text-pink-500 hover:text-pink-700 transition duration-300  items-center justify-center"
          href="https://www.facebook.com/puna.sayakone"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon icon={faFacebook} className="h-10 mr-2" />
          <span className="font-semibold text-lg">Share on Facebook</span>
          <FontAwesomeIcon icon={faGift} className="text-yellow-500 text-6xl ml-2" />

        </a>
      </div>

      <div className="text-center mt-10 text-gray-700 font-semibold">
        Celebrate with us by clicking the image or sharing your excitement on Facebook!
      </div>
    </div>
  );
}

export default App;
