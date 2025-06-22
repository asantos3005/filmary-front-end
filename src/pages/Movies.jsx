import React from "react";
import { useNavigate, useSearchParams  } from "react-router-dom";
import { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-quartz.css"



import {
  Input,
  InputGroup,
  InputGroupText,
  Button
} from "reactstrap";

import { IoSearchOutline } from "react-icons/io5";
import { fetchWithAutoRefresh } from "../helpers/fetchWithAutoRefresh";


export default function Movies() {
  const [rowData, setRowData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // lifted state
  const [yearFilter, setYearFilter] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();

  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearchQuery(query);
    }
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        let url = `https://movie-catalog-api-hsgg.onrender.com/movies/search?title=${searchQuery}`;
        if (yearFilter) {
          url += `&year=${yearFilter}`;
        }
  
        const res = await fetchWithAutoRefresh(url);
        const json = await res.json();
  
        const movies = json.data.map((movie) => ({
          title: movie.title,
          year: movie.year,
          id: movie.imdbID,
          imdbRate: movie.imdbRating,
          rtRate: movie.rottenTomatoesRating,
          metaRate: movie.metacriticRating,
          classification: movie.classification,
        }));
  
        setRowData(movies);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      }
    };
  
    fetchMovies();
  }, [searchQuery, yearFilter]); 

  // Handle search and update the search query
  const handleSearch = (query) => {
    setSearchQuery(query);
    setSearchParams({ q: query }); // updates the URL without navigating
  };

  const columns = [
    { headerName: "Title", field: "title", minWidth: 300 },
    { headerName: "Year", field: "year" },
    { headerName: "Id", field: "id" },
    { headerName: "IMBD", field: "imdbRate", minWidth: 180 },
    { headerName: "Rotten Tomatoes", field: "rtRate", minWidth: 180 },
    { headerName: "Metacritic", field: "metaRate", minWidth: 180 },
    { headerName: "Classification", field: "classification", flex: 1 }
  ];

  return (
    <main className="page-wrapper">

      <div className="movies-header-bar default-non-image-padding">
        <h1>Movies</h1>
        <div className="movies-actions">
          <MovieSearchBar onSearch={handleSearch} />
          <FilterDropdown
            selectedYear={yearFilter}
            onYearChange={setYearFilter}
            />
        </div>
      </div>

      <div
        className="ag-theme-quartz grid-container default-non-image-padding"
        style={{
          height: "55vh",
          minWidth: "600px"
        }}
      >
        <AgGridReact
          columnDefs={columns}
          rowData={rowData}
          pagination={true}
          paginationPageSize={10}
          onRowClicked={(row) => navigate(`/movies/data?id=${row.data.id}`)}
        />
      </div>
    </main>
  );
}



function MovieSearchBar({ onSearch }) {
  const [query, setQuery] = React.useState("");

  const handleSearch = () => {
    // Make sure onSearch is called with the query
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <InputGroup>
      <Input
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button id="brown-btn" onClick={handleSearch}>
        <IoSearchOutline />
      </Button>
    </InputGroup>
  );
}


function FilterDropdown({ selectedYear, onYearChange }) {
  const years = [];
  for (let y = 1990; y <= 2023; y++) {
    years.push(y);
  }

  return (
    <div className="d-flex p-5">
      <Input
        id="yearSelect"
        name="select"
        type="select"
        className="year-select"
        value={selectedYear}
        onChange={(e) => onYearChange(e.target.value)}
      >
        <option value="">All Years</option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </Input>
    </div>
  );
}
