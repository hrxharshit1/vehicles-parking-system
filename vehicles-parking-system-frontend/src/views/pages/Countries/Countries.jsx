import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Countries.css'

const Countries = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const token = localStorage.getItem('access_token')
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }

  const defaultValues = {
    countryName: '',
    countryCode: '',
    status: '',
  }

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues })

  useEffect(() => {
    if (id) {
      const fetchCountries = async () => {
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/country/country?country_id=${id}`,
            {
              headers,
            },
          )

          Object.entries(defaultValues).forEach(([key, defaultVal]) => {
            const newVal = response?.data?.[key] || defaultVal
            setValue(key, newVal)
          })
        } catch (err) {
          console.error('Error fetching country:', err)
          setError('Failed to fetch country details.')
        }
      }
      fetchCountries()
    }
  }, [id, setValue])

  const onSubmit = async (data) => {
    try {
      const statusMap = {
        enable: 1,
        disable: 0,
      }

      const payload = {
        ...data,
        status: statusMap[data.status], // convert status string to int
      }

      if (id) {
        await axios.put(`http://127.0.0.1:8000/country/countryUpdate/${id}`, payload, { headers })
        alert('Country has been updated successfully!')
      } else {
        await axios.post('http://127.0.0.1:8000/country/country', payload, { headers })
        alert('Country has been created successfully!')
      }

      navigate('/countrieslist')
    } catch (err) {
      console.error('Error during submission:', err)
      setError(err.response?.data?.message || 'Something went wrong! Please try again later.')
    }
  }

  return (
    <div className="roles-container">
      <h2 className="title">{id ? 'Update Country Details' : 'New Country Details'}</h2>

      {error && <div className="error-message">{error}</div>}

      <form className="roles-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-row">
          <div className="form-group">
            <label>Country Name</label>
            <input
              type="text"
              {...register('countryName', { required: 'Country name is required' })}
            />
            {errors.countryName && <p className="error">{errors.countryName.message}</p>}
          </div>

          <div className="form-group">
            <label>Country Code</label>
            <input
              type="text"
              {...register('countryCode', { required: 'Country code is required' })}
            />
            {errors.countryCode && <p className="error">{errors.countryCode.message}</p>}
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Status</label>
            <select {...register('status', { required: 'Status is required' })}>
              <option value="">Select Status</option>
              <option value="enable">Enable</option>
              <option value="disable">Disable</option>
            </select>
            {errors.status && <p className="error">{errors.status.message}</p>}
          </div>
        </div>
        <div className="btn">
          <div className="save-button">
            <button type="submit">Save</button>
          </div>
          <div className="cancel-button" onClick={() => navigate('/VehicleAmountList')}>
            <button type="cancel">Cancel</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Countries
