import './App.css';
import Search from './Component/Search';
import Country from './Component/Country';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Routes, Route, useNavigate } from 'react-router-dom';

const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Search />} />
        <Route path="/country" element={<Country />} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
