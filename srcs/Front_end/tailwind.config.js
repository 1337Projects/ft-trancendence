/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors : {
        lightBg : '#f7f7f7',
        lightText : '#374151',
        lightItems : 'white',
        darkItems : '#0d1216',
        darkText : 'white',
        darkBg : '#020408',
      },
      backgroundImage: {
        "blackG" : "linear-gradient(0deg, rgba(0,0,0,1), rgba(0,0,0,.5), rgba(0,0,0,0) 90%)",
        "blackGT" : "linear-gradient(90deg, rgba(0,0,0,.7), rgba(0,0,0,.5), rgba(0,0,0,0) 100%)"
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
        'md': '768px',
        'lg': '1124px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      
    },
  },
  plugins: [],
}
