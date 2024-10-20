import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faGift, faBirthdayCake } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [click, setClick] = useState(false);
  const [images, setImages] = useState([
    'https://wallpapers.com/images/featured/nature-2ygv7ssy2k0lxlzu.jpg',
    'https://th.bing.com/th/id/R.13820971a962ffbeb63a8fef36185b16?rik=vZ3lu%2blbhy6jxw&riu=http%3a%2f%2fwallup.net%2fwp-content%2fuploads%2f2016%2f03%2f10%2f319576-photography-landscape-nature-water-grass-trees-plants-sunrise-lake.jpg&ehk=6WS2p9KknQa9F%2bgAH16n44NReuUyS2rzXah2zy7kiAw%3d&risl=&pid=ImgRaw&r=0',
    'https://th.bing.com/th/id/OIP.gUp-hdAnYnxh87iMzm9n_wHaFG?w=262&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7'
  ]);

  const handleClick = () => {
    setClick(!click);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="bg-gradient-to-r from-pink-300 via-purple-300 to-yellow-300 min-h-screen flex flex-col items-center justify-center font-mono">
      <div className="text-center text-4xl font-bold mb-8 text-yellow-600">
        <FontAwesomeIcon icon={faBirthdayCake} className="text-5xl text-pink-500 mr-4" />
        Happy Birthday to you
      </div>

      <div className="text-center space-y-6">
        <h1 className="text-2xl font-bold text-purple-800">
          {click ? '🎉 Surprise! 🎉' : 'Click the gift to open'}
        </h1>
        <div className="flex justify-center">
          <img
            className="w-72 cursor-pointer rounded-lg transition duration-300 hover:scale-110"
            onClick={handleClick}
            src={click
              ? 'https://th.bing.com/th/id/OIP.gUp-hdAnYnxh87iMzm9n_wHaFG?w=262&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7'
              : 'https://th.bing.com/th/id/R.a87cc347e73a336112526e9d33239ea8?rik=4QiEZDG4DM5xAQ&riu=http%3a%2f%2fwww.pngall.com%2fwp-content%2fuploads%2f2016%2f03%2fGift-High-Quality-PNG.png&ehk=xQ1PzIHpnbaAoTGILBIyBMNPgjJWINMb01NRHq2EKdo%3d&risl=1&pid=ImgRaw&r=0'}
            alt="Birthday surprise"
          />
        </div>

        <a 
          className="mt-8 inline-block text-pink-500 hover:text-pink-700 transition duration-300 items-center justify-center"
          href="https://www.facebook.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon icon={faFacebook} className="h-10 mr-2" />
          <span className="font-semibold text-lg">Share on Facebook</span>
          <FontAwesomeIcon icon={faGift} className="text-yellow-500 text-4xl ml-4" />
        </a>
      </div>

      <div className="text-center mt-10 text-gray-700 font-semibold">
        Celebrate with us by clicking the image or sharing your excitement on Facebook!
      </div>

      {/* <div className="mt-10 w-3/4 max-w-3xl p-6">
        <Slider {...settings}>
          {images.map((image, index) => (
            <div key={index} className="p-4">
              <img
                src={image}
                alt={`slide ${index}`}
                className="w-full h-64 object-cover rounded-lg transition duration-300 transform hover:scale-105 flex"
              />
            </div>
          ))}
        </Slider>
      </div> */}
    </div>
  );
}

export default App;
