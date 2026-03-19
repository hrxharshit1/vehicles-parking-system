import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../../../apiConfig'
import './Parking.css'

const Parking = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()
  const [clubNames, setClubNames] = useState([])
  const { slotID } = location.state || {}

  const [form, setForm] = useState({
    slotId: slotID || id || '',
    barcode: '',
    vehicle_no: '',
    club_type: '',
    rfid_no: '',
    driver_name: '',
    driver_mobile: '',
    inTime: '',
    outTime: '',
    exitFloorId: '',
    amount: '',
    isPaid: '',
    paid: '',
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    let val = value

    // Convert specific fields to correct types
    if (['slotId', 'barcode', 'exitFloorId'].includes(name)) {
      val = value === '' ? null : parseInt(value)
    } else if (['amount', 'isPaid', 'paid'].includes(name)) {
      val = value === '' ? null : parseFloat(value)
    } else if (type === 'checkbox') {
      val = checked ? 1 : 0 // since isPaid is float in backend
    }

    setForm((prev) => ({
      ...prev,
      [name]: val,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('access_token')
    if (!token) {
      alert('Unauthorized: No token found.')
      return
    }

    // Sanitize payload: convert empty strings to null
    const sanitizedForm = {}
    Object.keys(form).forEach((key) => {
      const value = form[key]
      if (value === '' || value === undefined) {
        sanitizedForm[key] = null
      } else {
        sanitizedForm[key] = value
      }
    })

    const payload = {
      ...sanitizedForm,
      inTime: sanitizedForm.inTime && typeof sanitizedForm.inTime === 'string' 
              ? sanitizedForm.inTime.slice(0, 10) 
              : sanitizedForm.inTime,
      outTime: sanitizedForm.outTime && typeof sanitizedForm.outTime === 'string'
               ? sanitizedForm.outTime.slice(0, 10) 
               : sanitizedForm.outTime,
    }

    try {
      await axios.post(`${API_BASE_URL}/parking/parking`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      alert('Parking created successfully')
      navigate('/parkinglist')
    } catch (error) {
      console.error('Error creating parking:', error.response?.data || error.message)
      const errorDetail = error.response?.data?.detail
      let message = 'Unknown error'
      if (Array.isArray(errorDetail)) {
        message = errorDetail.map((err) => `${err.loc.join('.')}: ${err.msg}`).join('\n')
      } else if (typeof errorDetail === 'string') {
        message = errorDetail
      }
      alert(`Error:\n${message}`)
    }
  }
  // Fetch club names for the dropdown
  useEffect(() => {
    const fetchClubNames = async () => {
      const token = localStorage.getItem('access_token')
      if (!token) {
        console.error('No token found')
        return
      }

      try {
        // Define headers with Authorization token
        const headers = {
          Authorization: `Bearer ${token}`,
        }

        const response = await axios.get(`${API_BASE_URL}/club/clubsAll`, {
          headers: headers,
        })

        setClubNames(response.data)
      } catch (err) {
        console.error('Error fetching club names:', err)
      }
    }

    fetchClubNames()
  }, [])
  useEffect(() => {
    const currentSlotId = slotID || id
    if (currentSlotId) {
      setForm((prev) => ({ ...prev, slotId: currentSlotId }))
    }
  }, [location.state, id])

  return (
    <div className="roles-container">
      <h2 className="title">Parking Booking</h2>
      <form className="roles-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Slot ID</label>
            <input name="slotId" value={form.slotId} onChange={handleChange} readOnly />
          </div>

          <div className="form-group">
            <label>Vehicle Number</label>
            <input
              type="text"
              name="vehicle_no"
              value={form.vehicle_no}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Driver Name</label>
            <input
              type="text"
              name="driver_name"
              value={form.driver_name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Driver Mobile</label>
            <input
              type="text"
              name="driver_mobile"
              value={form.driver_mobile}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Club Type</label>
            <select
              name="club_type"
              value={form.club_type}
              onChange={handleChange}
            >
              <option value="">Select Club</option>
              {clubNames.map((club) => (
                <option key={club.id} value={club.clubName}>
                  {club.clubName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Barcode</label>
            <input
              type="number"
              name="barcode"
              value={form.barcode}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>RFID No</label>
            <input
              type="text"
              name="rfid_no"
              value={form.rfid_no}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              step="0.01"
              name="amount"
              value={form.amount}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Paid Amount</label>
            <input
              type="number"
              step="0.01"
              name="paid"
              value={form.paid}
              onChange={handleChange}
            />
          </div>

          <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px', justifyContent: 'flex-start' }}>
            <label style={{ marginBottom: 0 }}>Is Paid?</label>
            <input
              type="checkbox"
              name="isPaid"
              checked={form.isPaid === 1}
              onChange={handleChange}
              style={{ width: '20px', height: '20px' }}
            />
          </div>
        </div>

        <div className="btn">
          <div className="save-button">
            <button type="submit">Save</button>
          </div>
          <div className="cancel-button" onClick={() => navigate('/parkingList')}>
            <button type="cancel">Cancel</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Parking
