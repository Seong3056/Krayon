import SearchForm from './SearchForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import '../../resource/scss/search/search.scss';
const SearchApp = () => {
  return (
    <>
      <div className="search">
        <SearchForm />
      </div>
    </>
  );
};

export default SearchApp;
