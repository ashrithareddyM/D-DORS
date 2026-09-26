import { useState } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import L from "leaflet"
import Plot from "react-plotly.js"
import "leaflet/dist/leaflet.css"
import "./App.css"

const API_URL = import.meta.env.VITE_API_URL
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
})

function LocationSelector({ setLocation, setReconstructed }) {
  useMapEvents({
    click(e) {
      const lat = e.latlng.lat
      const lon = e.latlng.lng

      if (lat < -40 || lat > 30 || lon < 20 || lon > 120) {
        return
      }

      setLocation({
        lat: lat.toFixed(2),
        lon: lon.toFixed(2)
      })

      setReconstructed(false)
    }
  })

  return null
}

function App() {
  const [location, setLocation] = useState({
    lat: -27.69,
    lon: 62.03
  })

  const [date, setDate] = useState("2025-09-30")
  const [temperatures, setTemperatures] = useState([])
  const [reconstructed, setReconstructed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleReconstruct = async () => {
    setLoading(true)
    setReconstructed(false)
    setError("")

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          latitude: Number(location.lat),
          longitude: Number(location.lon),
          date: date
        })
      })

      if (!response.ok) {
        throw new Error("Backend request failed")
      }

      const data = await response.json()

      const predictionList = Object.entries(data.predictions).map(
        ([depth, temp]) => ({
          depth: Number(depth),
          temp: Number(temp)
        })
      )

      setTemperatures(predictionList)
      setReconstructed(true)
    } catch (err) {
      console.error(err)
      setError(
        "Unable to connect to the DDORS backend. Please make sure the Colab server is running."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header className="navbar">
        <div className="logo">
          <h2>DDORS</h2>
          <span>Daily Deep Ocean Remote Sensing</span>
        </div>

        <nav>
          <a href="#dashboard">Dashboard</a>
          <a href="#about">How It Works</a>
          <a href="#team">Team</a>
        </nav>
      </header>

      <main id="dashboard">
        <section className="hero">
          <p className="eyebrow">DEEP OCEAN INTELLIGENCE</p>

          <h1>
            Subsurface Ocean
            <br />
            Temperature Reconstruction
          </h1>

          <p className="description">
            Reconstruct subsurface ocean temperature using satellite surface
            observations and deep learning.
          </p>

          <div className="hero-stats">
            <div>
              <strong>2</strong>
              <span>Satellite Inputs</span>
            </div>

            <div>
              <strong>7</strong>
              <span>Depth Levels</span>
            </div>

            <div>
              <strong>2024–25</strong>
              <span>Observation Period</span>
            </div>
          </div>
        </section>

        <section className="dashboard">
          <div className="map-card">
            <div className="card-header">
              <div>
                <p className="label">OCEAN REGION</p>
                <h2>Indian Ocean</h2>
              </div>

              <span className="status">Backend Connected</span>
            </div>

            <div className="map-container">
              <MapContainer
                center={[-5, 70]}
                zoom={3}
                minZoom={3}
                maxZoom={7}
                maxBounds={[
                  [-40, 20],
                  [30, 120]
                ]}
                maxBoundsViscosity={1}
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <LocationSelector
                  setLocation={setLocation}
                  setReconstructed={setReconstructed}
                />

                <Marker
                  position={[
                    Number(location.lat),
                    Number(location.lon)
                  ]}
                  icon={markerIcon}
                />
              </MapContainer>
            </div>

            <div className="map-hint">
              Click inside the Indian Ocean region to select a location
            </div>

            <div className="coordinates">
              <div>
                <span>Latitude</span>
                <strong>{location.lat}°</strong>
              </div>

              <div>
                <span>Longitude</span>
                <strong>{location.lon}°</strong>
              </div>

              <div>
                <span>Observation Date</span>
                <input
                  type="date"
                  min="2024-01-01"
                  max="2025-12-31"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value)
                    setReconstructed(false)
                    setError("")
                  }}
                />
              </div>
            </div>

            <button onClick={handleReconstruct} disabled={loading}>
              {loading ? "Processing..." : "Reconstruct Temperature"}
            </button>

            {error && <div className="error-message">{error}</div>}
          </div>

          <div className="profile-card">
            <div className="card-header">
              <div>
                <p className="label">OBSERVATION STATUS</p>
                <h2>Selected Observation</h2>
              </div>

              <span className="status">
                {loading
                  ? "Processing"
                  : reconstructed
                  ? "Complete"
                  : "Ready"}
              </span>
            </div>

            <div className="observation-info">
              <div>
                <span>Latitude</span>
                <strong>{location.lat}°</strong>
              </div>

              <div>
                <span>Longitude</span>
                <strong>{location.lon}°</strong>
              </div>

              <div>
                <span>Date</span>
                <strong>{date}</strong>
              </div>

              <div>
                <span>Region</span>
                <strong>Indian Ocean</strong>
              </div>
            </div>

            <div className="data-status">
              <div>
                <span className="check">✓</span>
                <div>
                  <strong>SST</strong>
                  <small>Satellite surface temperature</small>
                </div>
              </div>

              <div>
                <span className="check">✓</span>
                <div>
                  <strong>SSS</strong>
                  <small>Satellite surface salinity</small>
                </div>
              </div>

              <div>
                <span className="check">✓</span>
                <div>
                  <strong>Argo reference</strong>
                  <small>Used during model development</small>
                </div>
              </div>
            </div>

            <div className="model-info">
              <span>MODEL</span>
              <strong>Hybrid CNN</strong>
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="loader"></div>
                <h3>Reconstructing profile</h3>
                <p>Sending observation to the DDORS backend.</p>
              </div>
            ) : !reconstructed ? (
              <div className="empty-state">
                <div className="empty-icon">◎</div>
                <h3>Ready for reconstruction</h3>
                <p>
                  Select a location and date, then run the reconstruction.
                </p>
              </div>
            ) : (
              <>
                <div className="card-header result-header">
                  <div>
                    <p className="label">MODEL OUTPUT</p>
                    <h2>Temperature Profile</h2>
                  </div>

                  <span className="unit">°C</span>
                </div>

                <div className="temperature-list">
                  {temperatures.map((item) => (
                    <div key={item.depth}>
                      <span>{item.depth} m</span>
                      <strong>{item.temp.toFixed(2)}°C</strong>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {reconstructed && (
          <section className="graph-card">
            <div className="card-header">
              <div>
                <p className="label">MODEL OUTPUT</p>
                <h2>Temperature vs Depth</h2>
              </div>

              <span className="unit">
                {location.lat}°, {location.lon}°
              </span>
            </div>

            <Plot
              data={[
                {
                  x: temperatures.map((item) => item.temp),
                  y: temperatures.map((item) => item.depth),
                  type: "scatter",
                  mode: "lines+markers",
                  line: {
                    width: 3,
                    color: "#62d9ff"
                  },
                  marker: {
                    size: 8,
                    color: "#62d9ff"
                  },
                  hovertemplate:
                    "%{y} m<br>%{x:.2f} °C<extra></extra>"
                }
              ]}
              layout={{
                paper_bgcolor: "transparent",
                plot_bgcolor: "transparent",
                font: {
                  color: "#a9bacb"
                },
                xaxis: {
                  title: "Temperature (°C)",
                  gridcolor: "rgba(255,255,255,0.08)",
                  zerolinecolor: "rgba(255,255,255,0.1)"
                },
                yaxis: {
                  title: "Depth (m)",
                  autorange: "reversed",
                  gridcolor: "rgba(255,255,255,0.08)",
                  zerolinecolor: "rgba(255,255,255,0.1)"
                },
                margin: {
                  l: 70,
                  r: 30,
                  t: 20,
                  b: 60
                },
                height: 430
              }}
              config={{
                responsive: true,
                displayModeBar: false
              }}
              style={{
                width: "100%"
              }}
            />
          </section>
        )}

        <section className="about" id="about">
          <div className="section-heading">
            <p className="eyebrow">HOW IT WORKS</p>
            <h2>From surface observations to subsurface temperature</h2>
            <p>
              DDORS uses historical satellite observations and Argo profiles
              to learn the relationship between ocean surface conditions and
              subsurface temperature.
            </p>
          </div>

          <div className="method-grid">
            <div className="method-card">
              <span className="method-number">01</span>
              <p className="method-label">SURFACE INPUT</p>
              <h3>SST + SSS</h3>
              <p>
                Satellite Sea Surface Temperature and Sea Surface Salinity
                provide 2D information about ocean surface conditions.
              </p>
            </div>

            <div className="method-card">
              <span className="method-number">02</span>
              <p className="method-label">INVERSION</p>
              <h3>2D → Subsurface</h3>
              <p>
                Historical surface observations are paired with Argo profiles
                to learn how surface patterns relate to temperature below the
                ocean surface.
              </p>
            </div>

            <div className="method-card">
              <span className="method-number">03</span>
              <p className="method-label">DEEP LEARNING</p>
              <h3>Hybrid CNN</h3>
              <p>
                The model learns spatial patterns from 9×9 satellite patches
                together with location and seasonal context.
              </p>
            </div>

            <div className="method-card">
              <span className="method-number">04</span>
              <p className="method-label">OUTPUT</p>
              <h3>Temperature Profile</h3>
              <p>
                The trained model estimates subsurface temperature across
                multiple depths from 50 m to 2000 m.
              </p>
            </div>
          </div>
        </section>

        <section className="team" id="team">
          <div className="section-heading">
            <p className="eyebrow">THE TEAM</p>
            <h2>Team Obsidian Loop</h2>
            <p>
              A student team developing DDORS for satellite-based subsurface
              ocean temperature reconstruction.
            </p>
          </div>

          <div className="team-grid">
            <div className="team-card">
              <span>01</span>
              <strong>Madduru Ashritha</strong>
            </div>

            <div className="team-card">
              <span>02</span>
              <strong>Nisarga R G</strong>
            </div>

            <div className="team-card">
              <span>03</span>
              <strong>Prajeet Santosh Gurlahosur</strong>
            </div>

            <div className="team-card">
              <span>04</span>
              <strong>Ramya Vasanth Bhagawat</strong>
            </div>

            <div className="team-card">
              <span>05</span>
              <strong>Suman R B</strong>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App