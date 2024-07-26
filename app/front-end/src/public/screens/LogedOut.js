import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';
import LandingPage from '../pages/LogedOutPages/LandingPage';
import LoginInPage from '../pages/LogedOutPages/LoginInPage';
import SignUpPage from '../pages/LogedOutPages/SignUpPage';

export default function LogedOut({ setLogedIn }) {
  const [currentPage, setCurrentPage] = useState('LandingPage');

  const renderPage = () => {
    switch (currentPage) {
      case 'LoginPage':
        return <LoginInPage navigateTo={setCurrentPage} setLogedIn={setLogedIn} />;
      case 'SignUpPage':
        return <SignUpPage navigateTo={setCurrentPage} />;
      default:
        return <LandingPage navigateTo={setCurrentPage} />;
    }
  };

  return (
    <SafeAreaView className="h-full py-6">
      {renderPage()}
    </SafeAreaView>
  );
}
