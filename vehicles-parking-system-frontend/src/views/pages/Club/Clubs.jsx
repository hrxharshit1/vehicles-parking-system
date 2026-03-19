import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import './Clubs.css'

const Clubs = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [error, setError] = useState('')
  const [vehicleTypes, setVehicleTypes] = useState([])

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
      clubName: '',
      vehicleNumber: 0,
      storeNumber: 0,
      vehicleType: '',
      cronJobDate: '',
      cronJobStatus: 'disable',
    },
  })

  // Fetch club data if editing
  useEffect(() => {
    if (id) {
      const fetchClub = async () => {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/club/clubs?club_id=${id}`, {
            headers,
          })
          const data = response.data

          setValue('clubName', data.clubName)
          setValue('vehicleNumber', data.vehicleNumber)
          setValue('storeNumber', data.storeNumber)
          setValue('vehicleType', data.vehicleType.toString())
          setValue('cronJobDate', data.cronJobDate)
          setValue('cronJobStatus', data.cronJobStatus === 1 ? 'enable' : 'disable')
        } catch (err) {
          console.error('Error fetching club:', err)
          setError('Failed to fetch club details.')
        }
      }
      fetchClub()
    }
  }, [id, setValue])

  // Fetch vehicle types
  useEffect(() => {
    const fetchVehicleTypes = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/category/categoriesAll', {
          headers,
        })
        setVehicleTypes(response.data)
      } catch (err) {
        console.error('Error fetching vehicle types:', err)
      }
    }
    fetchVehicleTypes()
  }, [])

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        vehicleNumber: parseInt(data.vehicleNumber),
        storeNumber: parseInt(data.storeNumber),
        vehicleType: parseInt(data.vehicleType),
        cronJobStatus: data.cronJobStatus === 'enable' ? 1 : 0,
      }

      if (id) {
        await axios.put(`http://127.0.0.1:8000/club/clubUpdate/${id}`, payload, { headers })
        alert('Club has been updated successfully!')
      } else {
        await axios.post('http://127.0.0.1:8000/club/clubs', payload, { headers })
        alert('Club has been created successfully!')
      }

      navigate('/clubslist')
    } catch (err) {
      console.error('Error during submission:', err)
      setError(err.response?.data?.message || 'Something went wrong! Please try again later.')
    }
  }

  return (
    <div className="category-dashboard-container">
      <h2 className="form-title">{id ? 'Edit Club' : 'Create Club'}</h2>
      {error && <p className="error">{error}</p>}

      <form className="category-dashboard-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            {...register('clubName', { required: true })}
            placeholder="Enter club name"
          />
          {errors.clubName && <span className="error">Club name is required.</span>}
        </div>

        <div className="form-group">
          <label>Vehicle Number</label>
          <input
            type="number"
            {...register('vehicleNumber', { required: true })}
            placeholder="Enter vehicle number"
          />
        </div>

        <div className="form-group">
          <label>Store Number</label>
          <input
            type="number"
            {...register('storeNumber', { required: true })}
            placeholder="Enter store number"
          />
        </div>

        <div className="form-group">
          <label>Vehicle Type</label>
          <select {...register('vehicleType', { required: true })}>
            <option value="">Select vehicle type</option>
            {vehicleTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.type}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Cron Job Date</label>
          <input type="date" {...register('cronJobDate', { required: true })} />
        </div>

        <div className="form-group">
          <label>Cron Job Status</label>
          <select {...register('cronJobStatus', { required: true })}>
            <option value="enable">Enable</option>
            <option value="disable">Disable</option>
          </select>
        </div>

        <div className="btn">
          <div className="save-button">
            <button type="submit">Save</button>
          </div>
          <div className="cancel-button" onClick={() => navigate('/clubslist')}>
            <button type="cancel">Cancel</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Clubs
