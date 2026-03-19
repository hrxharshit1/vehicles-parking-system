import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './VehicleAmount.css'

const VehicleAmount = () => {
  const { id } = useParams()
  const navigate = useNavigate()
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
      rateName: '',
      vehicleCategory: '',
      type: '',
      category: '',
      rate: '',
      setTime: '',
      status: 'enable',
    },
  })

  // Fetch vehicle categories/types
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

  // Fetch existing vehicle amount data if editing
  useEffect(() => {
    if (id) {
      const fetchVehicleAmount = async () => {
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/vehicleamount/vehicleAmount?vehicle_id=${id}`,
            { headers },
          )

          const data = response.data
          Object.entries(data).forEach(([key, value]) => {
            setValue(key, value)
          })
        } catch (err) {
          console.error('Error fetching vehicle amount:', err)
          setError('Failed to fetch vehicle amount details.')
        }
      }

      fetchVehicleAmount()
    }
  }, [id, setValue])

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        status: data.status === 'enable' ? 1 : 0,
      }

      if (id) {
        await axios.put(
          `http://127.0.0.1:8000/vehicleamount/vehicleAmount?vehicle_id=${id}`,
          payload,
          { headers },
        )
        alert('Vehicle amount has been updated successfully!')
      } else {
        await axios.post('http://127.0.0.1:8000/vehicleamount/vehicleAmount', payload, { headers })
        alert('Vehicle amount has been created successfully!')
      }

      navigate('/VehicleAmountList')
    } catch (err) {
      console.error('Error during submission:', err)
      setError(err.response?.data?.message || 'Something went wrong! Please try again later.')
    }
  }

  return (
    <div className="category-dashboard-container">
      <h2 className="form-title">Vehicle Amount</h2>
      {error && <p className="error-message">{error}</p>}
      <form className="category-dashboard-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-row">
          <div className="form-group">
            <label>Rate Name</label>
            <input
              type="text"
              placeholder="Enter rate name"
              {...register('rateName', { required: 'Rate Name is required' })}
            />
            {errors.rateName && <span className="error">{errors.rateName.message}</span>}
          </div>

          <div className="form-group">
            <label>Vehicle's Category</label>
            <select {...register('vehicleCategory', { required: 'Vehicle category is required' })}>
              <option value="">Select vehicle type</option>
              {vehicleTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.type}
                </option>
              ))}
            </select>
            {errors.vehicleCategory && (
              <span className="error">{errors.vehicleCategory.message}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Type</label>
            <input
              type="text"
              placeholder="Enter type"
              {...register('type', { required: 'Type is required' })}
            />
            {errors.type && <span className="error">{errors.type.message}</span>}
          </div>

          <div className="form-group">
            <label>Rate</label>
            <input
              type="number"
              placeholder="Enter rate"
              {...register('rate', {
                required: 'Rate is required',
                valueAsNumber: true,
                min: { value: 0, message: 'Rate must be a positive number' },
              })}
            />
            {errors.rate && <span className="error">{errors.rate.message}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              placeholder="Enter category"
              {...register('category', { required: 'Category is required' })}
            />
            {errors.category && <span className="error">{errors.category.message}</span>}
          </div>

          <div className="form-group">
            <label>Set Time</label>
            <input
              type="text"
              placeholder="Enter set time"
              {...register('setTime', { required: 'Set time is required' })}
            />
            {errors.setTime && <span className="error">{errors.setTime.message}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Status</label>
            <select {...register('status')}>
              <option value="enable">Enable</option>
              <option value="disable">Disable</option>
            </select>
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

export default VehicleAmount
