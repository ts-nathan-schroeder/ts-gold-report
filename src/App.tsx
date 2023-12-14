import React, { useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Filters } from './Filters';
import { AuthType, init } from '@thoughtspot/visual-embed-sdk';
import { Search } from './Search';

const tsURL = "https://bits.albertsons.com/"
const worksheetID = "5038aaef-031a-4c4e-a442-84b5ade2a218"

function App() {
  const filterRef = useRef<HTMLDivElement>(null);
  const [filtersVisible, setFiltersVisible] = useState(true)

  init({
    thoughtSpotHost:tsURL,
    authType:AuthType.None
  })
  function toggleExpandFilters(){
    if (filterRef && filterRef.current){
      if (filtersVisible){
        filterRef.current.style.display = "none"
        setFiltersVisible(false)
      }else{
        filterRef.current.style.display = "flex"
        setFiltersVisible(true) 
      }
    }
  }
  return (
      <>
      <div ref={filterRef} className='flex'>
      <Filters tsURL={tsURL}></Filters>
      </div>
      <div onClick={toggleExpandFilters} className="flex h-8 bg-slate-600 w-full items-center justify-center text-white font-bold hover:cursor-pointer">{filtersVisible? 'COLLAPSE' : 'EXPAND FILTERS'}</div>
      <Search worksheetID={worksheetID}></Search>
      </>
  );
}

export default App;
