import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Events from './pages/Events';
import Books from './pages/Books';
import Users from './pages/Users';
import Reports from './pages/Reports';
import Circulation from './pages/Circulation';
import Borrows from './pages/Borrows';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      autoHideDuration={3000}
    >
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Protected Admin Routes - Only ADMIN allowed */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="events" element={<Events />} />
              <Route path="books" element={<Books />} />
              <Route path="borrows" element={<Borrows />} />
              <Route path="users" element={<Users />} />
              <Route path="circulation" element={<Circulation />} />
              <Route path="reports" element={<Reports />} />
            </Route>
          </Route>

          {/* Catch-all 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </SnackbarProvider>
  );
}

export default App;
