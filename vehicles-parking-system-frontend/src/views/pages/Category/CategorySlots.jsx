import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import './CategorySlots.css'

const CategorySlots = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [places, setPlaces] = useState([])
  const [floors, setFloors] = useState([])
  const [categories, setCategories] = useState([])

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
      floor_id: 0,
      category_id: 0,
      slotName: '',
      slotID: 0,
      identity: '',
      remarks: '',
      status: 0,
    },
  })

  // Fetch category-wise slot data for editing
  useEffect(() => {
    if (id) {
      const fetchCategoryWiseSlots = async () => {
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/category/categoryWiseSlots?catslot_id=${id}`,
            { headers },
          )
          console.log(response)
          const categoryData = response.data

          setValue('place_id', categoryData.place_id)
          setValue('floor_id', categoryData.floor_id)
          setValue('category_id', categoryData.category_id)
          setValue('slotName', categoryData.slotName)
          setValue('slotID', categoryData.slotID)
          setValue('identity', categoryData.identity)
          setValue('remarks', categoryData.remarks)
          setValue('status', categoryData.status === 1 ? 'enable' : 'disable')
        } catch (err) {
          console.error('Error fetching category slots:', err)
          setError('Failed to fetch category wise slot details.')
        }
      }
      fetchCategoryWiseSlots()
    }
  }, [id, setValue])

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

  useEffect(() => {
    const fetchFloors = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/floor/floorsAll', { headers })
        setFloors(response.data)
      } catch (error) {
        console.error('Error fetching floors:', error)
      }
    }
    fetchFloors()
  }, [])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/category/categoriesAll', {
          headers,
        })
        setCategories(response.data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
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
        floor_id: parseInt(data.floor_id),
        category_id: parseInt(data.category_id),
        status: statusMap[data.status],
      }

      if (id) {
        await axios.put(`http://127.0.0.1:8000/category/categorywiseslotsUpdate/${id}`, payload, {
          headers,
        })
        alert('Category has been updated successfully!')
      } else {
        await axios.post('http://127.0.0.1:8000/category/categoryWiseSlots', payload, { headers })
        alert('Category has been created successfully!')
      }

      navigate('/CategorySlotsList')
    } catch (err) {
      console.error('Error during submission:', err)
      setError(err.response?.data?.message || 'Something went wrong! Please try again later.')
    }
  }

  return (
    <div className="category-slots-container">
      <h2 className="title">Category wise Slots</h2>
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
            <label>Floor Name</label>
            <select {...register('floor_id', { required: true })}>
              <option value="">Select Floor</option>
              {floors.map((floor) => (
                <option key={floor.id} value={floor.id}>
                  {floor.floorName}
                </option>
              ))}
            </select>
            {errors.floor_id && <span className="error-text">Floor is required</span>}
          </div>

          <div className="form-group">
            <label>Category Type</label>
            <select {...register('category_id', { required: true })}>
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.type}
                </option>
              ))}
            </select>
            {errors.category_id && <span className="error-text">Category type is required</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Slot Name</label>
            <input
              type="text"
              placeholder="Enter slot name"
              {...register('slotName', { required: true })}
            />
            {errors.slotName && <span className="error-text">Slot Name is required</span>}
          </div>
          <div className="form-group">
            <label>Slot ID</label>
            <input
              type="text"
              placeholder="Enter slot ID"
              {...register('slotID', { required: true })}
            />
            {errors.type && <span className="error-text">Slot id is required</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Identity</label>
            <input
              type="text"
              placeholder="Enter identity"
              {...register('identity', { required: true })}
            />
            {errors.type && <span className="error-text">Identity is required</span>}
          </div>

          <div className="form-group">
            <label>Remarks</label>
            <input
              type="text"
              placeholder="Enter remarks"
              {...register('remarks', { required: true })}
            />
            {errors.type && <span className="error-text">Remarks is required</span>}
          </div>
        </div>

        <div className="form-row">
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
          <div className="cancel-button" onClick={() => navigate('/CategorySlotsList')}>
            <button type="cancel">Cancel</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default CategorySlots
