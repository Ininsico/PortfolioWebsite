import React from 'react';

const DragonGallery = () => {
  const dragonImages = [
    { id: 1, src: "images/dragon_1.jpg" },
    { id: 2, src: "images/dragon_2.jpg" },
    { id: 3, src: "images/dragon_3.jpg" },
    { id: 4, src: "images/dragon_4.jpg" },
    { id: 5, src: "images/dragon_5.jpg" },
    { id: 6, src: "images/dragon_6.jpg" },
    { id: 7, src: "images/dragon_7.jpg" },
    { id: 8, src: "images/dragon_8.jpg" },
    { id: 9, src: "images/dragon_9.jpg" },
    { id: 10, src: "images/dragon_10.jpg" }
  ];

  return (
    <div 
      className="w-full h-screen text-center overflow-hidden relative"
      style={{
        backgroundColor: '#D2D2D2',
        backgroundImage: `
          repeating-linear-gradient(
            to right, transparent 0 100px,
            #25283b22 100px 101px
          ),
          repeating-linear-gradient(
            to bottom, transparent 0 100px,
            #25283b22 100px 101px
          )
        `
      }}
    >
      {/* Background overlay */}
      <div
        className="absolute"
        style={{
          width: 'min(1400px, 90vw)',
          top: '10%',
          left: '50%',
          height: '90%',
          transform: 'translateX(-50%)',
          backgroundImage: 'url(images/bg.png)',
          backgroundSize: '100%',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'top center',
          pointerEvents: 'none'
        }}
      />

      {/* 3D Slider */}
      <div
        className="absolute"
        style={{
          width: '200px',
          height: '250px',
          top: '10%',
          left: 'calc(50% - 100px)',
          transformStyle: 'preserve-3d',
          transform: 'perspective(1000px)',
          animation: 'autoRun 20s linear infinite',
          zIndex: 2
        }}
      >
        {dragonImages.map((dragon) => (
          <div
            key={dragon.id}
            className="absolute inset-0"
            style={{
              transform: `
                rotateY(calc( (${dragon.id} - 1) * (360 / 10) * 1deg))
                translateZ(550px)
              `
            }}
          >
            <img
              src={dragon.src}
              alt={`Dragon ${dragon.id}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Content */}
      <div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[1400px] pb-24 flex flex-wrap justify-between items-center"
        style={{ zIndex: 1 }}
      >
        <h1
          className="relative font-['ICA_Rubrik'] text-[16em] leading-none text-[#25283B]"
          data-content="CSS ONLY"
        >
          Arslan
          Rathore
          <span
            className="absolute inset-0 z-10"
            style={{
              WebkitTextStroke: '2px #d2d2d2',
              color: 'transparent'
            }}
          >
            Ininsico
          </span>
        </h1>

        <div className="font-['Poppins'] text-right max-w-[200px]">
          <h2 className="text-4xl">Ininsico Corp</h2>
          <p className="font-bold">Web Dev,ML Expert</p>
        </div>

        <div
          className="w-full absolute bottom-0 left-0 bg-no-repeat bg-top"
          style={{
            height: '75vh',
            backgroundImage: 'url(images/model.png)',
            backgroundSize: 'auto 130%',
            zIndex: 1
          }}
        />
      </div>

      {/* Animation keyframes */}
      <style>
        {`
          @keyframes autoRun {
            from {
              transform: perspective(1000px) rotateX(-16deg) rotateY(0deg);
            }
            to {
              transform: perspective(1000px) rotateX(-16deg) rotateY(360deg);
            }
          }
          
          @import url('https://fonts.cdnfonts.com/css/ica-rubrik-black');
          @import url('https://fonts.cdnfonts.com/css/poppins');
          
          /* Mobile styles */
          @media screen and (max-width: 1023px) {
            .slider-3d {
              width: 160px !important;
              height: 200px !important;
              left: calc(50% - 80px) !important;
            }
            .slider-item {
              transform: rotateY(calc( (var(--position) - 1) * (360 / var(--quantity)) * 1deg)) translateZ(300px) !important;
            }
            .main-heading {
              text-align: center !important;
              width: 100% !important;
              text-shadow: 0 10px 20px #000 !important;
              font-size: 7em !important;
            }
            .author-info {
              color: #fff !important;
              padding: 20px !important;
              text-shadow: 0 10px 20px #000 !important;
              z-index: 2 !important;
              max-width: unset !important;
              width: 100% !important;
              text-align: center !important;
              padding: 0 30px !important;
            }
          }
          
          @media screen and (max-width: 767px) {
            .slider-3d {
              width: 100px !important;
              height: 150px !important;
              left: calc(50% - 50px) !important;
            }
            .slider-item {
              transform: rotateY(calc( (var(--position) - 1) * (360 / var(--quantity)) * 1deg)) translateZ(180px) !important;
            }
            .main-heading {
              font-size: 5em !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default DragonGallery;