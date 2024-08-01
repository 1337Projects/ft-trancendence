/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors : {
        primary : '#C53F3F',
        lightBg : '#F5F5FF',
        lightText : '#374151',
        lightItems : 'white',
        darkBg : '#161b22',
        darkText : 'white',
        darkItems : '#1E292F',
      },
      backgroundImage: {
        'hero': "url('/Ping.png')",
        'pong': "url('/wallpaperflare.png')",
        'pat': "url('/14.svg')",
      },
      fontFamily : {
        'kaushan' : ['"kaushan script"', "sans-serif"],
        'noto' : ['"noto color emoji"', "sans-serif"],
        'insp' : ['inspiration', "sans-serif"],
        'pt' : ['"PT Sans"', "sans-serif"],
      },
      fontSize : {
        'primaryText' : '12px',
        'secendary' : '16px',
        'small' : '10px',
      }
    },
  },
  plugins: [],
}

//  #263238
//  #1E292F 
//  #14202B 