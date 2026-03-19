import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './SubUsers.css'

const SubUsers = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const token = localStorage.getItem('access_token')

  // Handle missing or invalid token
  useEffect(() => {
    if (!token) {
      setError('Unauthorized: Please log in again.')
      navigate('/login') // Redirect to login
    }
  }, [token, navigate])

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      userName: '',
      password: '',
      designation: '',
      places: true,
      floors: true,
      category: true,
      categoryWiseSlots: true,
      clubs: true,
      clubTransaction: true,
      rfdVehicles: true,
      tariff: true,
      migrations: true,
      countries: false,
      language: false,
      roles: false,
      roleUser: false,
      vehicleAmount: false,
      parking: true,
      passwordReset: false,
      verified: false,
    },
  })

  const permissions = [
    'places',
    'floors',
    'category',
    'categoryWiseSlots',
    'clubs',
    'clubTransaction',
    'rfdVehicles',
    'tariff',
    'migrations',
    'countries',
    'language',
    'roles',
    'roleUser',
    'vehicleAmount',
    'passwordReset',
    'parking',
  ]

  useEffect(() => {
    if (id && token) {
      const fetchUser = async () => {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/subuser/subuser?ID=${id}`, {
            headers,
          })

          const userData = response.data
          Object.keys(userData).forEach((key) => {
            if (key in userData) {
              setValue(key, userData[key])
            }
          })
        } catch (err) {
          console.error('Error fetching subuser:', err)
          if (err.response?.status === 401) {
            setError('Unauthorized. Please log in again.')
            navigate('/login')
          } else {
            setError('Failed to fetch subuser details.')
          }
        }
      }

      fetchUser()
    }
  }, [id, setValue, token, navigate])

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
      }

      if (id) {
        await axios.put(`http://127.0.0.1:8000/subuser/subuser?ID=${id}`, payload, { headers })
        setSuccess('Subuser has been updated successfully!')
      } else {
        await axios.post('http://127.0.0.1:8000/subuser/subuser', payload, { headers })
        setSuccess('Subuser has been created successfully!')
      }

      setTimeout(() => navigate('/subUserslist'), 1500)
    } catch (err) {
      console.error('Error during submission:', err)
      if (err.response?.status === 401) {
        setError('Unauthorized. Please log in again.')
        navigate('/login')
      } else {
        setError(err.response?.data?.message || 'Something went wrong! Please try again later.')
      }
    }
  }

  return (
    <div className="register-container">
      <h2 className="title">{id ? 'Edit Sub User' : 'Create Sub User'}</h2>
      <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
        <input type="text" placeholder="User Name" {...register('userName', { required: true })} />
        {errors.userName && <span className="error-message">User Name is required</span>}

        <input
          type="password"
          placeholder="Password"
          {...register('password', { required: !id })}
        />
        {errors.password && <span className="error-message">Password is required</span>}

        <input
          type="text"
          placeholder="Designation"
          {...register('designation', { required: true })}
        />
        {errors.designation && <span className="error-message">Designation is required</span>}

        <div className="checkbox-group">
          {permissions.map((perm) => (
            <label key={perm} className="checkbox-label">
              <input type="checkbox" {...register(perm)} />
              <span className="label-text">
                {perm.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
              </span>
            </label>
          ))}
        </div>

        <label className="verify-label">
          <input type="checkbox" {...register('verified')} />I agree to the terms and conditions
        </label>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <div className="btn">
          <div className="save-button">
            <button type="submit">Save</button>
          </div>
          <div className="cancel-button" onClick={() => navigate('/PlacesList')}>
            <button type="cancel">Cancel</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default SubUsers
