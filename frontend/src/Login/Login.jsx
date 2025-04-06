import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import Modal from '../components/Modal/Modal';
import Loading from '../components/Loading/Loading';
import styles from './Login.module.css';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ username: '', password: '', mode: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.username === '' || formData.password === '' || formData.mode === '') {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:5000/api/users/login', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userID', response.data.userID);
      localStorage.setItem('mode', response.data.mode);
      onLogin();
      navigate('/play');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error logging in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeSelect = (mode) => {
    setFormData(prev => ({ ...prev, mode }));
    setIsModalOpen(false);
  };
  
  const openModeSelection = () => {
    setIsModalOpen(true);
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.loginContainer}>
        <div className={styles.formWrapper}>
          <h1 className={styles.title}>Memory Game</h1>
          <p className={styles.subtitle}>Login to start playing</p>
          
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="username" className={styles.label}>Username</label>
              <input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className={styles.input}
                placeholder="Enter your username"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={styles.input}
                placeholder="Enter your password"
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Game Mode</label>
              <button 
                type="button" 
                onClick={openModeSelection} 
                className={styles.modeSelectButton}
              >
                {formData.mode !== '' ? `Selected: ${formData.mode.charAt(0).toUpperCase() + formData.mode.slice(1)}` : <span className={styles.modesSelectPlaceholder}>
                  Select Game Mode
                </span>}
              </button>
            </div>

            <div className={styles.buttonGroup}>
              <button type="submit" className={styles.loginButton}>
                {isLoading ? <Loading /> : 'Login'}
              </button>
              <button
                type="button"
                onClick={handleRegisterRedirect}
                className={styles.registerButton}
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Select Game Mode"
      >
        <div className={styles.levelButtons}>
          <button
            onClick={() => handleModeSelect('easy')}
            className={`${styles.levelButton} ${styles.easyButton}`}
          >
            Easy
          </button>
          <button
            onClick={() => handleModeSelect('medium')}
            className={`${styles.levelButton} ${styles.mediumButton}`}
          >
            Medium
          </button>
          <button
            onClick={() => handleModeSelect('hard')}
            className={`${styles.levelButton} ${styles.hardButton}`}
          >
            Hard
          </button>
        </div>
      </Modal>
    </div>
  );
};

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default Login;