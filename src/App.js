import React, { useEffect, useState } from 'react'
import Banner from './Components/Banner'



const App = () => {

  const [theme, setTheme] = useState(null)

  useEffect(()=>{
    if(window.matchMedia('(prefers-color-scheme: dark)').matches){
      setTheme("dark")
    }else{
      setTheme("light")
    }
  },[])

  useEffect(()=>{
    if(theme === "dark"){
      document.documentElement.classList.add("dark");
    }else{
      document.documentElement.classList.remove("dark");
    }
  },[theme])

  const handleSwitch = () =>{
    setTheme(theme === "dark" ? "light" : "dark")
  }
  
  const today = new Date()
  const month = today.toLocaleString('default',{month: 'long'})
const year = today.getFullYear();
const date = today.getDate();

  return (
    <div className= '  bg-[#E8E9F3] dark:bg-[#272635] w-full h-screen dark:text-white'>
      {/* simple navbar */}
      <div className=' flex justify-between p-2 bg-[#CECECE] dark:bg-[#707072] text-[#121214] items-center tracking-widest'>
        <h1 className='text-xl font-semibold tracking-tighter'>{date}  {month} {year}</h1>
        <h1 className='text-2xl font-bold mr-8'>WEATHER APP</h1>
        <button onClick={handleSwitch} className='p-2 rounded-xl bg-[#B1E5F2] dark:text-black shadow-xl'>Dark mode</button>
      </div>
      {/* here strts all other components */}
      

      <Banner />
    </div>
  )
}

export default App