/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors : {
        primary : '#C53F3F',
        lightBg : '#f7f7f7',
        lightText : '#374151',
        lightItems : 'white',
        darkItems : '#1b1b1f',
        darkText : 'white',
        darkBg : '#020408',
      },
      backgroundImage: {
        'hero': "url('/Ping.png')",
        'pong': "url('/wallpaperflare.png')",
        'pat': "url('/ccchaos.svg')",
        'banner': "url('/banner.png')",
        "chat" : "url('/GGG.svg')",
        "blackG" : "linear-gradient(0deg, rgba(0,0,0,1), rgba(0,0,0,.5), rgba(0,0,0,0) 90%)"
      },
      fontFamily : {
        'kaushan' : ['"kaushan script"', "sans-serif"],
        'noto' : ['"noto color emoji"', "sans-serif"],
        'insp' : ['inspiration', "sans-serif"],
        'pt' : ['"PT Sans"', "sans-serif"],
        'kav' : ['Kavoon', "sans-serif"],
      },
      fontSize : {
        'primaryText' : '12px',
        'secendary' : '16px',
        'small' : '10px',
      },
      screens: {
        'sm': '640px',
        // => @media (min-width: 640px) { ... }
  
        'md': '768px',
        // => @media (min-width: 768px) { ... }
  
        'lg': '1124px',
        // => @media (min-width: 1024px) { ... }
  
        'xl': '1280px',
        // => @media (min-width: 1280px) { ... }
  
        '2xl': '1536px',
      },
      
    },
  },
  plugins: [],
}

//  #263238
//  #1E292F 
//  #14202B 