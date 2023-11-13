// SignUpForm.js
import React from 'react';
import { Button, Container, TextField, Typography } from '@mui/material';

const SignUpForm = ({ email, setEmail, handleSubmit }) => {
    return (
        <Container component="main" maxWidth="xs">
          <Typography component="h1" variant="h5" style={{ textAlign: "center", color: "white" }}>
            Lightsaber Lores of MongoDB Time Series
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField 
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputLabelProps={{ style: { color: 'white' } }}
              InputProps={{ style: { color: 'white' } }}
            />
            <Button type="submit" fullWidth variant="contained" color="primary">
              Start
            </Button>
          </form>
        </Container>
    );
};

export default SignUpForm;
