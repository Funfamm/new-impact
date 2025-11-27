import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Casting } from './pages/Casting';
import { Sponsors } from './pages/Sponsors';
import { Movies } from './pages/Movies';
import { Donations } from './pages/Donations';
import { Admin } from './pages/Admin';
import { AppRoute } from './types';
import { FloatingHomeButton } from './components/FloatingHomeButton';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path={AppRoute.HOME} element={<Home />} />
          <Route path={AppRoute.CASTING} element={<Casting />} />
          <Route path={AppRoute.SPONSORS} element={<Sponsors />} />
          <Route path={AppRoute.MOVIES} element={<Movies />} />
          <Route path={AppRoute.DONATIONS} element={<Donations />} />
          <Route path={AppRoute.ADMIN} element={<Admin />} />
        </Routes>
        <FloatingHomeButton />
      </Layout>
    </HashRouter>
  );
};

export default App;