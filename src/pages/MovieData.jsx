import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import { useNavigate } from "react-router-dom";
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-quartz.css"

export default function MovieData() {
  const [searchParams] = useSearchParams();
  const [movie, setMovie] = useState(null);
  const [id, setId] = useState(null);
  const navigate = useNavigate();


  const principalColumns = [
    { headerName: "Role", field: "category", maxWidth: 150 },
    { headerName: "Name", field: "name", flex: 1 },
    {
      headerName: "Character(s)",
      field: "characters",
      valueGetter: (params) => params.data.characters?.join(", ") || "—"
    }
  ];

  // Extract ID from URL on first render
  useEffect(() => {
    const imdbId = searchParams.get("id");
    if (imdbId) {
      setId(imdbId);
    }
  }, []);

  // Fetch movie data when ID is set
  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;

      const token = localStorage.getItem("token");
      const url = `https://movie-catalog-api-hsgg.onrender.com/movies/data/${id}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        console.error("Fetch failed with status:", res.status);
        return;
      }

      const json = await res.json();
      console.log("Fetched Movie JSON:", json); 
      setMovie(json);
    };

    fetchMovie();
  }, [id]);

  if (!movie) {
    return <p>Loading movie details...</p>;
  }

  return (
    <main>

      <div className="movie-detail-tophalf">
        <div className="detail-header">
          <h1>{movie.title}</h1>
          <p>{movie.plot}</p>
        </div>
        
  
        <div className="movie-poster">
          <img
            src={movie.poster}
            alt="Movie Poster"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      <div className="movie-detail-bottomhalf">
       
        <div className="movie-details">
          <h2>Details</h2>

          <div className="brown-wrapper">

            <div className="movie-details-box">

              <div className="movie-detail-kvpair">
              <h3>Year:</h3> <p className="movie-detail">{movie.year}</p>
              </div>
              <div className="movie-detail-kvpair">        
                <h3>Runtime:</h3> <p>{movie.runtime} minutes</p>
              </div>
              <div className="movie-detail-kvpair">
                <h3>Country:</h3> <p>{movie.country}</p>
              </div>
              <div className="movie-detail-kvpair">
                <h3>Genres:</h3> <p> {movie.genres?.join(", ")}</p>
              </div>
              
            </div>

          </div>

        </div>
        

        <div className="principals-table">
          <h2 className="principals-heading">Principals</h2>
              {movie.principals && movie.principals.length > 0 && (
                <>
                  <div
                    className="ag-theme-quartz grid-container"
                    style={{
                      height: "350px",
                      minWidth: "500px",
                      marginTop: "1rem"
                    }}
                  >
                    <AgGridReact
                      columnDefs={principalColumns}
                      rowData={movie.principals}
                      pagination={true}
                      paginationPageSize={10}
                      onRowClicked={(row) => navigate(`/people?id=${row.data.id}`)}
                    />
                  </div>
                </>
              )}
        </div>

      </div>
      
    
    </main>
  );
}