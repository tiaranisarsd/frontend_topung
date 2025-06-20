import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Toast, ToastContainer } from 'react-bootstrap';
import LoginAdmin from '../components/LoginAdmin';

const Login = () => {
  const location = useLocation();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastBg, setToastBg] = useState('success');  // Set default background as success

  useEffect(() => {
    // If there's a message passed in the state from navigate
    if (location.state && location.state.message) {
      setToastMessage(location.state.message);
      setShowToast(true);

      // If the message indicates an error, change the toast background to danger
      if (location.state.message.includes("invalid") || location.state.message.includes("expired")) {
        setToastBg('danger');
      }
    }
  }, [location]);

  return (
    <React.Fragment>
      <LoginAdmin />

      {/* Toast for logout success or error messages */}
      <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 9999, position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}>
        <Toast 
          onClose={() => setShowToast(false)} 
          show={showToast} 
          delay={2000} 
          autohide 
          bg={toastBg} // Toast background changes based on message type
        >
          <Toast.Header closeButton={false}>
            <strong className="me-auto">Notifikasi</strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </React.Fragment>
  );
};

export default Login;
