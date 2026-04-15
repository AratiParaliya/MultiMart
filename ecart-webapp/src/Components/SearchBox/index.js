
import { IoIosSearch } from 'react-icons/io'
import React from 'react'
import { useState } from 'react';
import { useNavigate } from "react-router-dom";



const SearchBox = ({ setSearch }) => {
  const navigate = useNavigate();
  return (
    <div className='headerSearch ml-3 mr-3'>
      <input
        type='text'
        placeholder="Search your Product..."
       onChange={(e) => {
  setSearch(e.target.value.toLowerCase());
  navigate("/cat"); // 🔥 redirect to listing
}}

      />
      <button><IoIosSearch/></button>
    </div>
  );
};

export default SearchBox;
