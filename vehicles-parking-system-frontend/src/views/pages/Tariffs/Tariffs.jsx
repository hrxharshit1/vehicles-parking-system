import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import './Tariffs.css'

const Tariffs = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [places, setPlaces] = useState([])
  const token = localStorage.getItem('access_token')

  const headers = {
    Authorization: `Bearer ${token}`, // ✅ Fixed template string
    'Content-Type': 'application/json',
  }

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      place_id: '',
      tariffName: '',
      startDate: '',
      endDate: '',
      minAmount: '',
      perHour: '',
      status: 'enable',
    },
  })

  const form = watch()

  // Fetch existing tariff
  useEffect(() => {
    if (!token) {
      setError('Access token not found. Please login again.')
      return
    }

    if (id) {
      const fetchTariff = async () => {
        try {
          setLoading(true)
          const response = await axios.get(`http://127.0.0.1:8000/tariff/tariff?tariff_id=${id}`, {
            headers,
          })
          const newData = response.data

          setValue('place_id', newData.place_id)
          setValue('tariffName', newData.tariffName)
          setValue('startDate', newData.startDate)
          setValue('endDate', newData.endDate)
          setValue('minAmount', newData.minAmount)
          setValue('perHour', newData.perHour) // ✅ Matches backend
          setValue('status', newData.status === 1 ? 'enable' : 'disable')
        } catch (err) {
          console.error('Error fetching tariff:', err)
          setError(err.response?.data?.message || err.message || 'Failed to fetch tariff details.')
        } finally {
          setLoading(false)
        }
      }
      fetchTariff()
    }
  }, [id, token, setValue])

  // Fetch places
  useEffect(() => {
    if (!token) return
    const fetchPlaces = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/place/placesAll', { headers })
        setPlaces(response.data)
      } catch (err) {
        console.error('Error fetching places:', err)
        setError('Failed to load places.')
      }
    }
    fetchPlaces()
  }, [token])

  // Form submission
  const onSubmit = async (data) => {
    try {
      setError('')
      setLoading(true)

      const statusMap = {
        enable: 1,
        disable: 0,
      }

      const payload = {
        ...data,
        place_id: parseInt(data.place_id),
        minAmount: parseFloat(data.minAmount),
        perHour: parseFloat(data.perHour),
        status: statusMap[data.status],
      }

      if (id) {
        await axios.put(`http://127.0.0.1:8000/tariff/tariffUpdate/${id}`, payload, { headers })
        alert('Tariff updated successfully!')
      } else {
        await axios.post('http://127.0.0.1:8000/tariff/tariff', payload, {
          headers,
        })
        alert('Tariff created successfully!')
      }

      navigate('/TariffsList')
    } catch (err) {
      console.error('Error during submission:', err)
      setError(
        err.response?.data?.message ||
          err.message ||
          'Something went wrong! Please try again later.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="roles-container">
      <h2 className="title">Tariffs</h2>
      {error && <p className="error">{error}</p>}
      {loading && <p className="loading">Loading...</p>}
      <form className="roles-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-row">
          <div className="form-group">
            <label>Place</label>
            <select {...register('place_id', { required: true })}>
              <option value="">Select Place</option>
              {places.map((place) => (
                <option key={place.id} value={place.id}>
                  {place.placeName}
                </option>
              ))}
            </select>
            {errors.place_id && <p className="error">Place is required.</p>}
          </div>

          <div className="form-group">
            <label>Tariff Name</label>
            <input type="text" {...register('tariffName', { required: true })} />
            {errors.tariffName && <p className="error">Tariff Name is required.</p>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Start Date</label>
            <input type="date" {...register('startDate', { required: true })} />
            {errors.startDate && <p className="error">Start Date is required.</p>}
          </div>

          <div className="form-group">
            <label>End Date</label>
            <input type="date" {...register('endDate', { required: true })} />
            {errors.endDate && <p className="error">End Date is required.</p>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Min Amount</label>
            <input type="number" step="0.01" {...register('minAmount', { required: true })} />
            {errors.minAmount && <p className="error">Minimum amount is required.</p>}
          </div>

          <div className="form-group">
            <label>Per Hour</label>
            <input type="number" {...register('perHour', { required: true })} />
            {errors.perHour && <p className="error">Per hour rate is required.</p>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Status</label>
            <select {...register('status', { required: true })}>
              <option value="enable">Enable</option>
              <option value="disable">Disable</option>
            </select>
            {errors.status && <p className="error">Status is required.</p>}
          </div>
        </div>

        <div className="btn">
          <div className="save-button">
            <button type="submit">Save</button>
          </div>
          <div className="cancel-button" onClick={() => navigate('/TariffsList')}>
            <button type="cancel">Cancel</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Tariffs
