import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Filters } from './Filters';
import { AuthType, init } from '@thoughtspot/visual-embed-sdk';
import { Search } from './Search';

const tsURL = "https://bits.albertsons.com/"
const worksheetID = "5038aaef-031a-4c4e-a442-84b5ade2a218"

function App() {
  init({
    thoughtSpotHost:tsURL,
    authType:AuthType.None
  })
  return (
      <>
      <Filters tsURL={tsURL}></Filters>
      <Search worksheetID={worksheetID}></Search>
      </>
  );
}

export default App;
