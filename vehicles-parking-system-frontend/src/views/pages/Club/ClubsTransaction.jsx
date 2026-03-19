import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import './ClubsTransaction.css'

const ClubsTransaction = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [clubNames, setClubNames] = useState([])

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
      club_id: '',
      transaction_id: '',
      amount: '',
      gracePeriod: '',
      cronJobDate: '',
      cronJobStatus: 'disable',
    },
  })

  // Fetch clubTransaction data if editing
  useEffect(() => {
    if (id) {
      const fetchClubTransaction = async () => {
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/club/clubTransaction/${id}`,
            { headers }
          )
          const data = response.data

          setValue('club_id', data.club_id)
          setValue('transaction_id', data.transaction_id)
          setValue('amount', data.amount)
          setValue('gracePeriod', data.gracePeriod)
          setValue('cronJobDate', data.cronJobDate)
          setValue('cronJobStatus', data.cronJobStatus === 1 ? 'enable' : 'disable')
        } catch (err) {
          console.error('Error fetching club transaction:', err)
          setError('Failed to fetch club transaction details.')
        }
      }
      fetchClubTransaction()
    }
  }, [id, setValue])

  // Fetch club names
  useEffect(() => {
    const fetchClubNames = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/club/clubsAll', { headers })
        setClubNames(response.data)
      } catch (err) {
        console.error('Error fetching club names:', err)
      }
    }
    fetchClubNames()
  }, [])

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        gracePeriod: parseInt(data.gracePeriod) || 0,
        cronJobStatus: data.cronJobStatus === 'enable' ? 1 : 0,
      }

      if (id) {
        await axios.put(
          `http://127.0.0.1:8000/club/clubTransactionUpdate/${id}`,
          payload,
          { headers }
        )
        alert('Club transaction has been updated successfully!')
      } else {
        await axios.post(
          'http://127.0.0.1:8000/club/clubTransaction',
          payload,
          { headers }
        )
        alert('Club transaction has been created successfully!')
      }

      navigate('/clubtransactionlist')
    } catch (err) {
      console.error('Error during submission:', err)
      setError(err.response?.data?.message || 'Something went wrong! Please try again later.')
    }
  }

  return (
    <div className="category-dashboard-container">
      <h2 className="form-title">Club Transaction</h2>
      <form className="category-dashboard-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>Club name</label>
          <select {...register('club_id', { required: true })}>
            <option value="">Select Club</option>
            {clubNames.map((club) => (
              <option key={club.id} value={club.id}>
                {club.clubName}
              </option>
            ))}
          </select>
          {errors.club_id && <p className="error">Club is required</p>}
        </div>

        <div className="form-group">
          <label>Transaction ID</label>
          <input
            type="number"
            placeholder="Enter Transaction ID"
            {...register('transaction_id', { required: true })}
          />
          {errors.transaction_id && <p className="error">Transaction ID is required</p>}
        </div>

        <div className="form-group">
          <label>Amount</label>
          <input
            type="number"
            placeholder="Enter Amount"
            {...register('amount', { required: true })}
          />
          {errors.amount && <p className="error">Amount is required</p>}
        </div>

        <div className="form-group">
          <label>Grace Period</label>
          <input type="number" placeholder="Enter Grace Period" {...register('gracePeriod')} />
        </div>

        <div className="form-group">
          <label>Cron Job Date</label>
          <input type="date" {...register('cronJobDate')} />
        </div>

        <div className="form-group">
          <label>Cron Job Status</label>
          <select {...register('cronJobStatus')}>
            <option value="enable">Enable</option>
            <option value="disable">Disable</option>
          </select>
        </div>

        {error && <p className="error">{error}</p>}

        <div className="btn">
          <div className="save-button">
            <button type="submit">Save</button>
          </div>
          <div className="cancel-button">
            <button type="button" onClick={() => navigate('/clubtransactionlist')}>
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ClubsTransaction
