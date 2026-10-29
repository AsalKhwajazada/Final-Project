import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernamePattern = /^[A-Za-z0-9_]{3,20}$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

function validateIdentity(value) {
  const trimmed = value.trim();
  if (!trimmed) return 'Enter your username or email address.';
  if (!emailPattern.test(trimmed) && !usernamePattern.test(trimmed)) {
    return 'Enter a valid email address or a 3–20 character username (letters, numbers, underscores).';
  }
  return '';
}

export default function AuthPage({ mode = 'signin' }) {
  const isSignUp = mode === 'signup';
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isAuthenticated } = useAuth();

  const [values, setValues] = useState({
    fullName: '',
    username: '',
    email: '',
    identity: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const update = (event) => {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: '' }));
    setMessage('');
  };

  const handleFillDemo = () => {
    setValues((prev) => ({
      ...prev,
      identity: 'student@example.com',
      password: 'Password123'
    }));
    setErrors({});
    setMessage('Demo credentials filled!');
  };

  const submit = (event) => {
    event.preventDefault();
    const nextErrors = {};

    if (isSignUp) {
      if (!values.fullName.trim()) nextErrors.fullName = 'Enter your full name.';
      if (!usernamePattern.test(values.username.trim())) {
        nextErrors.username = 'Use 3–20 letters, numbers, or underscores.';
      }
      if (!emailPattern.test(values.email.trim())) {
        nextErrors.email = 'Enter a valid email address.';
      }
    } else {
      const identityError = validateIdentity(values.identity);
      if (identityError) nextErrors.identity = identityError;
    }

    if (!values.password) {
      nextErrors.password = 'Enter your password.';
    } else if (!passwordPattern.test(values.password)) {
      nextErrors.password = 'Use at least 8 characters, including uppercase, lowercase, and a number.';
    }

    if (isSignUp) {
      if (!values.confirmPassword) {
        nextErrors.confirmPassword = 'Confirm your password.';
      } else if (values.password !== values.confirmPassword) {
        nextErrors.confirmPassword = 'Passwords do not match.';
      }
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (isSignUp) {
      setMessage('Account created successfully in demo mode! You can now sign in.');
      setTimeout(() => {
        navigate('/signin');
      }, 1200);
      return;
    }

    login();
    const nextDestination = searchParams.get('next') || '/dashboard';
    navigate(nextDestination);
  };

  const field = (name, label, type = 'text', placeholder = '') => (
    <label className="auth-field" htmlFor={name}>
      <span>{label}</span>
      <input
        id={name}
        name={name}
        type={type}
        value={values[name]}
        onChange={update}
        placeholder={placeholder}
        autoComplete={
          name === 'password'
            ? isSignUp ? 'new-password' : 'current-password'
            : name === 'confirmPassword'
              ? 'new-password'
              : name
        }
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
        required
      />
      {errors[name] && <small className="auth-error" id={`${name}-error`}>{errors[name]}</small>}
    </label>
  );

  return (
    <main className="auth-page">
      <div className="auth-decoration auth-decoration-one" aria-hidden="true" />
      <div className="auth-decoration auth-decoration-two" aria-hidden="true" />
      <section className="auth-card" aria-labelledby="auth-heading">
        <Link to="/signin" className="auth-brand" aria-label="GraphicDesignHUB home">
          <span className="auth-brand-icon"><i className="fa-solid fa-shapes" /></span>
          <span>GraphicDesign<span>HUB</span></span>
        </Link>
        <p className="auth-eyebrow">YOUR CREATIVE LEARNING COMMUNITY</p>
        <h1 id="auth-heading">{isSignUp ? 'Create your account' : 'Welcome back'}</h1>
        <p className="auth-intro">
          {isSignUp
            ? 'Join GraphicDesignHUB and grow your creative skills.'
            : 'Sign in to continue learning and creating.'}
        </p>

        <form className="auth-form" onSubmit={submit} noValidate>
          {isSignUp ? (
            <>
              {field('fullName', 'Full name', 'text', 'Your full name')}
              {field('username', 'Username', 'text', '3–20 characters')}
              {field('email', 'Email address', 'email', 'you@example.com')}
            </>
          ) : field('identity', 'Username or email', 'text', 'Username or you@example.com')}
          {field('password', 'Password', 'password', 'At least 8 characters (e.g. Password123)')}
          {isSignUp && field('confirmPassword', 'Confirm password', 'password', 'Enter your password again')}
          
          <button className="auth-submit" type="submit">
            {isSignUp ? 'Create account' : 'Sign in'}
            <i className="fa-solid fa-arrow-right" aria-hidden="true" />
          </button>

          {!isSignUp && (
            <button 
              type="button" 
              className="btn-demo-quick-fill" 
              onClick={handleFillDemo}
            >
              <i className="fa-solid fa-wand-magic-sparkles"></i> Use Demo Credentials
            </button>
          )}

          {message && <p className="auth-success" role="status">{message}</p>}
        </form>

        <p className="auth-switch">
          {isSignUp ? 'Already have an account?' : 'New to GraphicDesignHUB?'}
          {' '}<Link to={isSignUp ? '/signin' : '/signup'}>{isSignUp ? 'Sign in' : 'Create an account'}</Link>
        </p>
        <p className="auth-demo-note">
          Demo sign-in: enter any valid email/username and password (minimum 8 characters, with uppercase, lowercase, and a number).
        </p>
      </section>
    </main>
  );
}
