import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './services/ProtectedRoute';
import {createStoreHook, Provider, useStore} from "react-redux";
import {StrictMode} from "react";
import ClientPage from "./pages/clientPage/ClientPage";
import CreateMerchantForm from "./components/CreateMerchantForm";
import {PersistGate} from "redux-persist/integration/react";
import {combineReducers, createStore} from "redux";
import userReducer from "./redux/reducers/userReducer";
import merchantReducer from "./redux/reducers/merchantReducer";
import {persistor, store} from "./redux/store";
import ProductDetail from "./components/ProductDetail";


function App() {
  return (
      <StrictMode>
          <Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
                  <Routes>
                      <Route path="/" element={<Navigate to="/home" />} />
                      <Route path="/product/:id" element={<ProductDetail/>} />
                      <Route path='/home' element={<HomePage />} />
                      <Route path='/login' element={<Login />} />
                      <Route path='/register' element={<Register />} />
                      <Route path='/merchant/register' element={<CreateMerchantForm />} />
                      {/* client */}
                      <Route
                          path='/client/*'
                          element={
                              <ProtectedRoute allowedRoles={['ROLE_USER', 'ROLE_ADMIN']}>
                                 <ClientPage />
                               </ProtectedRoute>
                          }
                      />
                      {/* admin */}
                      <Route
                          path='/dashboard/*'
                          element={
                              <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_MERCHANT']}>
                                  <Dashboard />
                               </ProtectedRoute>
                          }
                      />
                  </Routes>
              </PersistGate>
          </Provider>
      </StrictMode>

  );
}

export default App;
