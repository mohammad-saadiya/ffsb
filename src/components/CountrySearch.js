import './CountrySearch.css';
import React, { useState, useEffect, useRef } from 'react';

const CountrySearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [countriesData, setCountriesData] = useState([]);
  const resultsRef = useRef(null);

  useEffect(() => {
    // Fetch data from the same JSON file name
    fetch('/countryData.json')
      .then((response) => response.json())
      .then((data) => setCountriesData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    if (query) {
      const lowerCaseQuery = query.toLowerCase();
      const filteredResults = countriesData.filter((item) =>
        item.country.toLowerCase().includes(lowerCaseQuery) ||
        item.capital.toLowerCase().includes(lowerCaseQuery)
      );

      const countryResults = filteredResults.filter((item) =>
        item.country.toLowerCase().includes(lowerCaseQuery)
      );
      const capitalResults = filteredResults.filter((item) =>
        item.capital.toLowerCase().includes(lowerCaseQuery)
      );

      setResults(
        query.length > 0
          ? [...new Set([...countryResults, ...capitalResults])]
          : []
      );
    } else {
      setResults([]);
    }
    setHighlightedIndex(-1); // Reset highlighted index
  }, [query, countriesData]);

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      setHighlightedIndex((prevIndex) =>
        prevIndex < results.length - 1 ? prevIndex + 1 : 0
      );
    } else if (event.key === 'ArrowUp') {
      setHighlightedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : results.length - 1
      );
    } else if (event.key === 'Enter') {
      if (highlightedIndex >= 0) {
        const selectedResult = results[highlightedIndex];
        setQuery(
          selectedResult.country.toLowerCase().includes(query.toLowerCase())
            ? selectedResult.country
            : selectedResult.capital
        );
        setResults([]);
      }
    }
  };

  const handleResultClick = (result) => {
    setQuery(
      result.country.toLowerCase().includes(query.toLowerCase())
        ? result.country
        : result.capital
    );
    setResults([]);
  };

  return (
    <div className="search-wrapper">
      <h3 className="search-heading">Global Search Bar</h3>
      <div className="search-box">
        <input
          type="text"
          value={query}
          onChange={handleQueryChange}
          onKeyDown={handleKeyDown}
          placeholder="Search by country or capital"
        />
        {results.length > 0 && (
          <ul className="results-list" ref={resultsRef}>
            {results.map((result, index) => (
              <li
                key={index}
                className={`results-item ${
                  index === highlightedIndex ? 'highlighted' : ''
                }`}
                onMouseDown={() => handleResultClick(result)}
              >
                <strong>Country:</strong> {result.country} <br />
                <strong>Capital:</strong> {result.capital}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CountrySearch;
