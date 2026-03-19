import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import './Role.css'

const Roles = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const token = localStorage.getItem('access_token')
  const headers = {
    Authorization: `Bearer ${token}`,
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
      roleName: '',
      description: '',
    },
  })

  const form = watch()

  // Fetch role data for editing if ID exists
  useEffect(() => {
    if (id) {
      const fetchRole = async () => {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/roles/role/${id}`, { headers })
          const newData = response.data
          setValue('roleName', newData.roleName)
          setValue('description', newData.description)
        } catch (err) {
          console.error('Error fetching role:', err)
          setError('Failed to fetch role details.')
        }
      }
      fetchRole()
    }
  }, [id, setValue])

  const onSubmit = async (data) => {
    try {
      if (id) {
        await axios.put(`http://127.0.0.1:8000/roles/roleUpdate/${id}`, data, { headers })
        alert('Role updated successfully!')
      } else {
        await axios.post('http://127.0.0.1:8000/roles/roleUser', data, { headers })
        alert('Role created successfully!')
      }
      navigate('/roleslist')
    } catch (err) {
      console.error('Error during submission:', err)
      setError(err.response?.data?.message || 'Something went wrong! Please try again later.')
    }
  }

  return (
    <div className="roles-container">
      <h2 className="title">{id ? 'Edit Role' : 'Add Role'}</h2>
      {error && <p className="error">{error}</p>}

      <form className="roles-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-row">
          <div className="form-group">
            <label>Role Name</label>
            <input type="text" {...register('rolename', { required: 'Role Name is required' })} />
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
        <div className="btn">
          <div className="save-button">
            <button type="submit">Save</button>
          </div>
          <div className="cancel-button" onClick={() => navigate('/roleslist')}>
            <button type="cancel">Cancel</button>
          </div>
        </div>


      </form>
    </div>
  )
}

export default Roles
