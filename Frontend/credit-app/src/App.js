import AdminNavigation from "./components/Admin/AdminNavigation";
import AdminUsers from "./components/Admin/AdminUsers";
import HomeAdmin from "./components/Admin/HomeAdmin";
import OrganismesAdmin from "./components/Admin/OrganismesAdmin";
import AgentPretNavigation from "./components/AgentPret/AgentPretNavigation";
import AgentPretOrganism from "./components/AgentPret/AgentPretOrganism";
import AgentPretProfile from "./components/AgentPret/AgentPretProfile";
import DemandesOrganisme from "./components/AgentPret/DemandesOrganisme";
import ClientDemands from "./components/Client/ClientDemands";
import ClientNavigation from "./components/Client/ClientNavigation";
import ClientProfile from "./components/Client/ClientProfile";
import NouvelleDemande from "./components/Client/NouvelleDemande";
import CourtierNavigation from "./components/Courtier/CourtierNavigation";
import CourtierProfile from "./components/Courtier/CourtierProfile";
import DemandesCourtier from "./components/Courtier/DemandesCourtier";
import NouvelleDemCourtier from "./components/Courtier/NouvelleDemCourtier";
import Login from "./components/Login";
import Register from "./components/Register";

import "./css/style.css";
import "./fonts/material-icon/css/material-design-iconic-font.min.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Create a layout component that includes ClientNavigation
function ClientLayout({ children }) {
  return (
    <>
      <ClientNavigation />
      {children}
    </>
  );
}

function AgentPretLayout({ children }) {
  return (
    <>
      <AgentPretNavigation />
      {children}
    </>
  );
}

function CourtierLayout({ children }) {
  return (
    <>
      <CourtierNavigation />
      {children}
    </>
  );
}

function AdminLayout({ children }) {
  return (
    <>
      <AdminNavigation />
      {children}
    </>
  );
}

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/client/*"
            element={
              <ClientLayout>
                <Routes>
                  <Route path="/profile" element={<ClientProfile />} />
                  <Route
                    path="/demandes-client/:clientId"
                    element={<ClientDemands />}
                  />
                  <Route
                    path="/nouvelle-demande"
                    element={<NouvelleDemande />}
                  />
                  {/* other dashboards*/}
                </Routes>
              </ClientLayout>
            }
          />
          <Route
            path="/agent/*"
            element={
              <AgentPretLayout>
                <Routes>
                  <Route path="/profile" element={<AgentPretProfile />} />
                  <Route
                    path="/demandes/:organismePretId"
                    element={<DemandesOrganisme />}
                  />
                  <Route
                    path="/organisme/:organismePretId"
                    element={<AgentPretOrganism />}
                  />
                </Routes>
              </AgentPretLayout>
            }
          />
          <Route
            path="/courtier/*"
            element={
              <CourtierLayout>
                <Routes>
                  <Route path="/profile" element={<CourtierProfile />} />
                  <Route
                    path="/nouvelle-demande/:courtierId"
                    element={<NouvelleDemCourtier />}
                  />
                  <Route
                    path="/demandes-courtier/:courtierId"
                    element={<DemandesCourtier />}
                  />
                </Routes>
              </CourtierLayout>
            }
          />
          <Route
            path="/admin/*"
            element={
              <AdminLayout>
                <Routes>
                  <Route path="/home" element={<HomeAdmin />} />
                  <Route path="/users" element={<AdminUsers />} />
                  <Route path="/organismes" element={<OrganismesAdmin />} />
                </Routes>
              </AdminLayout>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
