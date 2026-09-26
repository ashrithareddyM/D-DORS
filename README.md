# D-DORS

# DDORS — Daily Deep Ocean Remote Sensing

## AI-Based Subsurface Ocean Temperature Reconstruction

DDORS (Daily Deep Ocean Remote Sensing) is a deep-learning based system for reconstructing subsurface ocean temperature from surface satellite observations.

Satellites provide wide-area observations of the ocean surface, while Argo floats provide sparse measurements below the surface. DDORS learns the relationship between these observations to estimate subsurface temperature at multiple depths.

> **Satellites give breadth. Argo gives depth.**

---

## 🌊 Problem

Satellite observations primarily provide information about the ocean surface, while direct subsurface measurements are limited and spatially sparse.

This makes continuous monitoring of subsurface ocean conditions difficult.

DDORS addresses this challenge by combining:

- Satellite surface observations
- Argo subsurface temperature profiles
- Spatial and temporal features
- Deep learning

to reconstruct subsurface ocean temperature.

---

## 💡 Proposed Solution

The DDORS pipeline follows:

Satellite Observations
        ↓
Data Preprocessing
        ↓
Satellite Feature Extraction
        ↓
Deep Learning Model
        ↓
Subsurface Temperature Reconstruction
        ↓
Depth-wise Ocean Temperature Profile

The current prototype reconstructs temperature at:

50 m
100 m
200 m
500 m
1000 m
1500 m
2000 m

The 2000 m reconstruction uses a dedicated model because fewer Argo profiles are available at this depth.

🛰️ Data Sources
Satellite Observations

The prototype uses NOAA satellite observations for the Indian Ocean region.

Input variables:

Sea Surface Temperature (SST)
Sea Surface Salinity (SSS)
Argo Profiles

Argo observations provide subsurface measurements of:

Temperature
Salinity
Pressure

Historical satellite and Argo observations are used to train and evaluate the reconstruction models.

🌍 Study Region

The current prototype focuses on the Indian Ocean:

Longitude: 20°E – 120°E
Latitude: 40°S – 30°N
Period: 2024–2025
🧠 Deep Learning Approach

Several models were explored during development:

MLP baseline
CNN using SST + SSS spatial patches
Regularized CNN
SST-only CNN ablation
Hybrid CNN with spatial and contextual features
Dedicated Hybrid CNN for 2000 m
Final Hybrid CNN

The final reconstruction model combines:

9 × 9 SST spatial patches
9 × 9 SSS spatial patches
Latitude
Longitude
Day-of-year features

The spatial satellite information is processed through convolutional layers and combined with contextual features to predict subsurface temperature.

📊 Model Evaluation

A chronological data split was used:

Dataset	Period
Training	2024
Validation	January–June 2025
Testing	July–December 2025

The models were evaluated using:

MAE — Mean Absolute Error
RMSE — Root Mean Squared Error
R² — Coefficient of Determination

Final Hybrid CNN Results
|   Depth | MAE (°C) | RMSE (°C) |     R² |
| ------: | -------: | --------: | -----: |
|    50 m |   0.9486 |    1.4654 | 0.9040 |
|   100 m |   1.4672 |    2.1660 | 0.6550 |
|   200 m |   0.8749 |    1.1935 | 0.7220 |
|   500 m |   0.3936 |    0.6136 | 0.8363 |
|  1000 m |   0.3280 |    0.4795 | 0.8565 |
|  1500 m |   0.1548 |    0.2038 | 0.9201 |
| 2000 m* |   0.0966 |    0.1279 | 0.7021 |

* 2000 m uses a dedicated model trained on the smaller set of profiles available at that depth.
  
Example Reconstruction
Example model output for one satellite observation:
|  Depth | Predicted Temperature |
| -----: | --------------------: |
|   50 m |              19.85 °C |
|  100 m |              19.28 °C |
|  200 m |              16.60 °C |
|  500 m |              11.96 °C |
| 1000 m |               6.06 °C |
| 1500 m |               3.37 °C |
| 2000 m |               2.46 °C |

⚙️ Technology Stack
1.Data Processing
  Python
  NumPy
  Pandas
  Xarray
  SciPy
  NetCDF4
2.Machine Learning
  PyTorch
  Scikit-learn
  CNN
  MLP
3.Planned Application Layer
  FastAPI
  React
  Vercel
4/Visualization
  Plotly
  Matplotlib

🚀 Applications

The reconstructed subsurface information can support:

Cyclone and storm analysis
Monsoon and thermocline studies
Ocean-state monitoring
Fisheries and ecosystem assessment
Climate and disaster management
Marine and coastal operations
Oceanographic research

🏆 Smart India Hackathon 2026

Problem Statement ID: 26066
Theme: Disaster Management
Category: Software
Team: Obsidian Loop
Project: DDORS — Daily Deep Ocean Remote Sensing
