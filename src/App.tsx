import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';

import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { StormIntelligence } from './pages/StormIntelligence';
import { CMEPrediction } from './pages/CMEPrediction';
import { GridMap } from './pages/GridMap';
import { Substations } from './pages/Substations';
import { SubstationDetail } from './pages/SubstationDetail';
import { GVIAnalysis } from './pages/GVIAnalysis';
import { Alerts } from './pages/Alerts';
import { Mitigation } from './pages/Mitigation';
import { StormReplay } from './pages/StormReplay';
import { Analytics } from './pages/Analytics';
import { DataSources } from './pages/DataSources';
import { SystemHealth } from './pages/SystemHealth';
import { Settings } from './pages/Settings';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useApp();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/storm-intelligence" element={<StormIntelligence />} />
        <Route path="/prediction" element={<CMEPrediction />} />
        <Route path="/grid-map" element={<GridMap />} />
        <Route path="/substations" element={<Substations />} />
        <Route path="/substations/:id" element={<SubstationDetail />} />
        <Route path="/analytics/gvi" element={<GVIAnalysis />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/mitigation" element={<Mitigation />} />
        <Route path="/replay" element={<StormReplay />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/data-sources" element={<DataSources />} />
        <Route path="/system-health" element={<SystemHealth />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
};

export default App;
