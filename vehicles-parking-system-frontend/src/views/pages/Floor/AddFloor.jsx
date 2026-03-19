import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './AddFloor.css'

const AddFloor = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [places, setPlaces] = useState([])

  const token = localStorage.getItem('access_token')
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      place_id: '',
      floorName: '',
      floorLevel: '',
      remarks: '',
      status: '',
    },
  })

  useEffect(() => {
    if (id) {
      const fetchFloor = async () => {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/floor/floor?floor_id=${id}`, {
            headers,
          })

          Object.entries(defaultValues).forEach(([key, defaultVal]) => {
            const newVal = response?.data?.[key] || defaultVal
            setValue(key, newVal)
          })
        } catch (err) {
          console.error('Error fetching floor:', err)
          setError('Failed to fetch floor details.')
        }
      }
      fetchFloor()
    }
  }, [id, setValue])

  // Fetch all places for dropdown
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/place/placesAll', { headers })
        setPlaces(response.data)
      } catch (error) {
        console.error('Error fetching place name:', error)
      }
    }
    fetchPlaces()
  }, [])

  const onSubmit = async (data) => {
    try {
      const statusMap = {
        enable: 1,
        disable: 0,
      }

      const payload = {
        ...data,
        floorLevel: parseInt(data.floorLevel),
        status: statusMap[data.status],
        place_id: parseInt(data.place_id),
      }

      if (id) {
        await axios.put(`http://127.0.0.1:8000/floor/floorUpdate/${id}`, payload, { headers })
        alert('Floor has been updated successfully!')
      } else {
        await axios.post('http://127.0.0.1:8000/floor/floor', payload, { headers })
        alert('Floor has been created successfully!')
      }

      navigate('/FloorList')
    } catch (err) {
      console.error('Error during submission:', err)
      setError(err.response?.data?.message || 'Something went wrong! Please try again later.')
    }
  }

  return (
    <div className="add-floor-container">
      <h2 className="title">{id ? 'Update Floor' : 'New Floor'}</h2>
      <form className="add-floor-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-row">
          <div className="form-group">
            <label>Place Name</label>
            <select {...register('place_id', { required: 'Place is required' })}>
              <option value="">Select Place</option>
              {places.map((place) => (
                <option key={place.id} value={place.id}>
                  {place.placeName}
                </option>
              ))}
            </select>
            {errors.place_id && <p className="error">{errors.place_id.message}</p>}
          </div>

          <div className="form-group">
            <label>Floor Name</label>
            <input type="text" {...register('floorName', { required: 'Floor name is required' })} />
            {errors.floorName && <p className="error">{errors.floorName.message}</p>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Floor Level</label>
            <input
              type="number"
              {...register('floorLevel', { required: 'Floor level is required' })}
            />
            {errors.floorLevel && <p className="error">{errors.floorLevel.message}</p>}
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
        </div>

        <div className="form-group full-width">
          <label>Remarks</label>
          <textarea {...register('remarks')} rows="4" />
        </div>

        {error && <p className="error">{error}</p>}

        <div className="btn">
          <div className="save-button">
            <button type="submit">Save</button>
          </div>
          <div className="cancel-button" onClick={() => navigate('/FloorList')}>
            <button type="cancel">Cancel</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddFloor
