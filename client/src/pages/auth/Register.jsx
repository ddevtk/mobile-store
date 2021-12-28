import React, { useState } from 'react';
import { MDBCol, MDBInput, MDBBtn } from 'mdb-react-ui-kit';
import { notification } from 'antd';
import { getAuth, sendSignInLinkToEmail } from 'firebase/auth';

const Register = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = {
      url: process.env.REACT_APP_REGISTER_REDIRECT_URL,
      handleCodeInApp: true,
    };
    const auth = getAuth();
    await sendSignInLinkToEmail(auth, email, config);
    notification.success({
      message: `Email is sent to ${email}. Click the link to complete your registration. `,
      duration: 3,
    });
    window.localStorage.setItem('emailForRegistration', email);
    setEmail('');
  };

  return (
    <div className='container p-5'>
      <div className='row'>
        <div className='col-md-6 offset-md-3'>
          <h4>Register</h4>
          <form onSubmit={handleSubmit}>
            <MDBCol md='12' size='12' className='mb-4 mt-4 mb-md-0'>
              <MDBInput
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label='Email address'
              />
            </MDBCol>
            <MDBCol size='auto' className='mt-3 mb-md-0'>
              <MDBBtn type='submit'>Register</MDBBtn>
            </MDBCol>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
