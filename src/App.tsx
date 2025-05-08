import React from 'react';
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      {/* The RouterProvider from App.routes.tsx will handle all routing */}
    </AuthProvider>
  );
}
