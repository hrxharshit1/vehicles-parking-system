import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Places.css'

const Places = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const token = localStorage.getItem('access_token')
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }

  const defaultValues = {
    placeName: '',
    description: '',
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
      const fetchPlace = async () => {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/place/place?place_id=${id}`, {
            headers,
          })

          Object.entries(defaultValues).forEach(([key, defaultVal]) => {
            const newVal = response?.data?.[key] || defaultVal
            setValue(key, newVal)
          })
        } catch (err) {
          console.error('Error fetching place:', err)
          setError('Failed to fetch place details.')
        }
      }
      fetchPlace()
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
        await axios.put(`http://127.0.0.1:8000/place/placeUpdate/${id}`, payload, { headers })
        alert('Place has been updated successfully!')
      } else {
        await axios.post('http://127.0.0.1:8000/place/place', payload, { headers })
        alert('Place has been created successfully!')
      }

      navigate('/PlacesList')
    } catch (err) {
      console.error('Error during submission:', err)
      setError(err.response?.data?.message || 'Something went wrong! Please try again later.')
    }
  }

  return (
    <div className="roles-container">
      <h2 className="title">{id ? 'Update Place' : 'New Place'}</h2>

      {error && <div className="error-message">{error}</div>}

      <form className="roles-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-row">
          <div className="form-group">
            <label>Place Name</label>
            <input type="text" {...register('placeName', { required: 'Place name is required' })} />
            {errors.placeName && <p className="error">{errors.placeName.message}</p>}
          </div>

          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              {...register('description', { required: 'Description is required' })}
            />
            {errors.description && <p className="error">{errors.description.message}</p>}
          </div>
        </div>

        <div className="form-group">
          <label>Status</label>
          <select {...register('status', { required: 'Status is required' })}>
            <option value="">Select Status</option>
            <option value="enable">Enable</option>
            <option value="disable">Disable</option>
          </select>
          {errors.status && <p className="error">{errors.status.message}</p>}
        </div>
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

export default Places
