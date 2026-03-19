import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import './Migrations.css'
import { useNavigate, Link, useParams } from 'react-router-dom'

const Migrations = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [migrationTypes, setMigrationTypes] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

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
      migration: '',
      batch: 0,
    },
  })

  // Fetch migration details (edit mode)
  useEffect(() => {
    if (id) {
      const fetchMigration = async () => {
        setLoading(true)
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/migration/migrations?migration_id=${id}`,
            {
              headers,
            },
          )

          const data = response.data
          setValue('migration', data.migration)
          setValue('batch', data.batch)
        } catch (err) {
          console.error('Error fetching migration:', err)
          console.log('Full response:', err.response)
          setError(
            err.response?.data?.message || `Failed to fetch migration details: ${err.message}`,
          )
        } finally {
          setLoading(false)
        }
      }

      fetchMigration()
    }
  }, [id, setValue])

  // Fetch all migration types (optional - not used in form here)
  useEffect(() => {
    const fetchMigrationTypes = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/migration/migrationsAll', {
          headers,
        })
        setMigrationTypes(response.data)
      } catch (err) {
        console.error('Error fetching migration types:', err)
      }
    }

    fetchMigrationTypes()
  }, [])

  const onSubmit = async (data) => {
    try {
      const payload = {
        migration: data.migration,
        batch: data.batch,
      }

      if (id) {
        await axios.put(`http://127.0.0.1:8000/migration/migrationUpdate/${id}`, payload, {
          headers,
        })
        alert('Migration has been updated successfully!')
      } else {
        await axios.post('http://127.0.0.1:8000/migration/migrations', payload, {
          headers,
        })
        alert('Migration has been created successfully!')
      }

      navigate('/MigrationsList')
    } catch (err) {
      console.error('Submission error:', err)
      setError(err.response?.data?.message || 'Something went wrong! Please try again later.')
    }
  }

  return (
    <div className="roles-container">
      <h2 className="title">Migrations</h2>

      {loading && <p>Loading migration details...</p>}
      {error && <p className="error-message">{error}</p>}

      <form className="roles-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-row">
          <div className="form-group">
            <label>Migration</label>
            <input
              type="text"
              {...register('migration', { required: 'Migration name is required' })}
            />
            {errors.migration && <span>{errors.migration.message}</span>}
          </div>

          <div className="form-group">
            <label>Batch</label>
            <input
              type="number"
              {...register('batch', {
                required: 'Batch is required',
                valueAsNumber: true,
              })}
            />
            {errors.batch && <span>{errors.batch.message}</span>}
          </div>
        </div>

        <div className="btn">
          <div className="save-button">
            <button type="submit">Save</button>
          </div>
          <div className="cancel-button" onClick={() => navigate('/MigrationsList')}>
            <button type="cancel">Cancel</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Migrations
