import { useState } from "react"
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-quartz.css"

import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
  } from "chart.js";
import { Bar } from "react-chartjs-2";

import { fetchWithAutoRefresh } from "../helpers/fetchWithAutoRefresh";

export default function People() {
    const [searchParams] = useSearchParams();
    const [person, setPerson] = useState(null);
    const [personid, setId] = useState(null);
    // Error state will hold different string errors and each will be handled differently during rendering
    const [error, setError] = useState(null);
    const navigate = useNavigate();


    ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);


    const personColumns = [
        { headerName: "Role", field: "category", maxWidth: 150 },
        { headerName: "Movie", field: "movieName", flex: 1 },
        {
          headerName: "Character(s)",
          field: "characters",
          valueGetter: (params) => params.data.characters?.join(", ") || "—"
        },
        { headerName: "IMDB Rating", field: "imdbRating", flex: 1 }
      ];

    useEffect(() => {
        const imdbId = searchParams.get("id");
        if (imdbId) {
        setId(imdbId);
        }
    }, []);

    useEffect(() => {
      const fetchPerson = async () => {
        try {
          const url = `http://4.237.58.241:3000/people/${personid}`;
          const res = await fetchWithAutoRefresh(url);
    
          if (res.status === 401) {
            setError("unauthorized");
            return;
          }
    
          if (!res.ok) {
            console.error("Fetch failed with status:", res.status);
            setError("other");
            return;
          }
    
          const json = await res.json();
          setPerson(json);
        } catch (err) {
          console.error("Network or parsing error:", err);
          setError("network");
        }
      };
    
    // Try to fetch the person's details - if there is a person id provided
    if (personid) {
        fetchPerson();
      }
    }, [personid]);
    
    let ratingBins = new Array(10).fill(0);
    let chartData = null;

        if (person?.roles?.length > 0) {
        person.roles.forEach(role => {
            const rating = role.imdbRating;
            if (typeof rating === "number" && rating >= 0 && rating <= 10) {
            const index = Math.floor(rating);
            ratingBins[index] += 1;
            }
        });

        const labels = ratingBins.map((_, i) => `${i}–${i + 1}`);

        chartData = {
            labels,
            datasets: [
            {
                label: "Number of Roles",
                data: ratingBins,
                backgroundColor: "rgb(101, 43, 25)",
                borderColor: "rgb(101, 43, 25)",
                borderWidth: 1
            }
            ]
        };
        }

        const chartOptions = {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1
                }
              }
            }
          };
      

    // ✅ Safely wait for person data
    if (error === "unauthorized") {
      return (
        <main className="page-wrapper">
          <div className="page-content" style={{ padding: "2rem", textAlign: "center" }}>
            <h2>You must be logged in to view this page.</h2>
            <Link to="/auth">
              <button style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}>
                Go to Login
              </button>
            </Link>
          </div>
        </main>
      );
    }
    
    if (error === "other") {
      return (
        <main className="page-wrapper">
          <div>
            <h2>Something went wrong</h2>
            <p>Please try again later.</p>
          </div>
        </main>
      );
    }

    if (!person) {
      return <p>Loading person details...</p>;
    }

    return (
        <main>
          <span className="back-link"
        onClick={() => navigate(-1)}>
        ← Back to Movie
      </span>

            <div className="detail-header default-non-image-padding">
                <h1>{person.name}</h1>
                <p>{person.birthYear}-{person.deathYear}</p>
            </div>
          

            

            <div className="roles-table default-non-image-padding">
                    <h2 className="principals-heading">Roles</h2>
                        {person.roles && person.roles.length > 0 && (
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
                                columnDefs={personColumns}
                                rowData={person.roles}
                                pagination={true}
                                paginationPageSize={10}
                                /*
                                onRowClicked={(row) => navigate(`/people?id=${row.data.id}`)}
                                */
                            />
                            </div>
                        </>
                        )}
            </div>

            <div className="chart-container">
            {chartData && (
            <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
                <h2>IMDb Rating Distribution</h2>
                <Bar data={chartData} options={chartOptions} />
            </div>
            )}
            </div>
        </main>
    )
}
