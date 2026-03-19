import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import './Category.css'

const Category = () => {
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
      place_id: 0,
      type: '',
      description: '',
      limitCount: 0,
      status: 0,
    },
  })

  // Fetch category data for editing
  useEffect(() => {
    if (id) {
      const fetchCategory = async () => {
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/category/categories?category_id=${id}`,
            { headers },
          )
          const categoryData = response.data

          setValue('place_id', categoryData.place_id)
          setValue('type', categoryData.type)
          setValue('description', categoryData.description)
          setValue('limitCount', categoryData.limitCount)
          setValue('status', categoryData.status === 1 ? 'enable' : 'disable')
        } catch (err) {
          console.error('Error fetching category:', err)
          setError('Failed to fetch category details.')
        }
      }
      fetchCategory()
    }
  }, [id, setValue])

  // Fetch all places for dropdown
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/place/placesAll', { headers })
        setPlaces(response.data)
      } catch (error) {
        console.error('Error fetching places:', error)
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
        place_id: parseInt(data.place_id),
        limitCount: parseInt(data.limitCount),
        status: statusMap[data.status],
      }

      if (id) {
        await axios.put(`http://127.0.0.1:8000/category/categoriesUpdate/${id}`, payload, {
          headers,
        })
        alert('Category has been updated successfully!')
      } else {
        await axios.post('http://127.0.0.1:8000/category/category', payload, { headers })
        alert('Category has been created successfully!')
      }

      navigate('/CategoryList')
    } catch (err) {
      console.error('Error during submission:', err)
      setError(err.response?.data?.message || 'Something went wrong! Please try again later.')
    }
  }

  return (
    <div className="category-dashboard-container">
      <h2 className="form-title">Category</h2>
      {error && <p className="error-message">{error}</p>}

      <form className="category-dashboard-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-row">
          <div className="form-group">
            <label>Place Name</label>
            <select {...register('place_id', { required: true })}>
              <option value="">Select Place</option>
              {places.map((place) => (
                <option key={place.id} value={place.id}>
                  {place.placeName}
                </option>
              ))}
            </select>
            {errors.place_id && <span className="error-text">Place is required</span>}
          </div>

          <div className="form-group">
            <label>Type</label>
            <input type="text" placeholder="Enter type" {...register('type', { required: true })} />
            {errors.type && <span className="error-text">Type is required</span>}
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea rows="3" placeholder="Enter description" {...register('description')} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Limit Count</label>
            <input
              type="number"
              placeholder="Enter limit count"
              {...register('limitCount', { required: true })}
            />
            {errors.limitCount && <span className="error-text">Limit count is required</span>}
          </div>

          <div className="form-group">
            <label>Status</label>
            <select {...register('status', { required: true })}>
              <option value="">Select status</option>
              <option value="enable">Enable</option>
              <option value="disable">Disable</option>
            </select>
            {errors.status && <span className="error-text">Status is required</span>}
          </div>
        </div>

        <div className="btn">
          <div className="save-button">
            <button type="submit">Save</button>
          </div>
          <div className="cancel-button" onClick={() => navigate('/CategoryList')}>
            <button type="cancel">Cancel</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Category
