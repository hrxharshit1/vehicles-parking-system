import React, { useState, useEffect } from 'react'
import './ParkingList.css'
import { useForm } from 'react-hook-form'

import { Link, useNavigate } from 'react-router-dom'
import { CIcon } from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'
import ParkingSlot from './ParkingSlot'
import axios from 'axios'
import { API_BASE_URL } from '../../../apiConfig'

const ITEMS_PER_PAGE = 10

const ParkingList = ({ isEmbedded = false }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [parkingList, setParkingList] = useState([])
  const [categoryWiseSlots, setCategoryWiseSlots] = useState([])
  const [selectedIds, setSelectedIds] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [options, setOptions] = useState([]) // Floor options
  const [selectedFloor, setSelectedFloor] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  const [floors, setFloors] = useState([])

  const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token')
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  }
  // fetching floors
  useEffect(() => {
    const headers = getAuthHeaders()
    const fetchfloors = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/floor/floorsAll`, { headers })
        setFloors(response.data)
      } catch (error) {
        console.error('Error fetching floors:', error)
      }
    }
    fetchfloors()
  }, [])

  const fetchParking = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/parking/parkingAll`, {
        headers: getAuthHeaders(),
      })
      setParkingList(response.data)
    } catch (error) {
      console.error('Error fetching parking:', error.message)
      alert('Authentication required. Please log in again.')
    }
  }

  const fetchCategoryWiseSlots = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/category/categoryWiseSlotsAll`, {
        headers: getAuthHeaders(),
      })
      setCategoryWiseSlots(response.data)
    } catch (err) {
      console.error('Error fetching category slots:', err.message)
    }
  }

  useEffect(() => {
    fetchParking()
    fetchCategoryWiseSlots()
  }, [])

  // Filtering
  const filteredData = parkingList.filter(
    (item) =>
      (item?.vehicle_no ?? '').toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!selectedFloor || item.exit_floor_id === parseInt(selectedFloor)),
  )

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentItems = filteredData.slice(startIndex, endIndex)

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([])
    } else {
      const currentPageIds = currentItems.map((item) => item.id)
      setSelectedIds(currentPageIds)
    }
    setSelectAll(!selectAll)
  }

  const getCategoryWiseSlot = (slotId) => {
    const slot = categoryWiseSlots.find((slot) => slot.id === slotId)
    return slot ? slot.slotName : 'Unknown'
  }

  const deleteParking = async (id) => {
    if (!window.confirm('Are you sure you want to delete this parking?')) return
    try {
      await axios.delete(`${API_BASE_URL}/parking/parking/${id}`, {
        headers: getAuthHeaders(),
      })
      setParkingList((prev) => prev.filter((item) => item.id !== id))
    } catch (error) {
      console.error('Delete failed:', error.message)
      alert('Failed to delete. Authentication error.')
    }
  }

  // Embedded view (minimal)
  if (isEmbedded) {
    return (
      <>
        {currentItems.map((item, index) => (
          <tr key={index}>
            <td>{item.slot_id}</td>
            <td>{item.vehicle_no}</td>
            <td>{item.driver_name}</td>
            <td>{item.in_time}</td>
            <td>{item.out_time}</td>
            <td>{item.amount}</td>
            <td>{item.paid}</td>
          </tr>
        ))}
      </>
    )
  }
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      floor_id: '',
    },
  })

  // Full view
  return (
    <>
      <div className="filter-container">
        <select
          style={{ padding: '10px', zIndex: 999 }}
          {...register('floor_id', {
            required: 'floor is required',
            onChange: (e) => setSelectedFloor(e.target.value),
          })}
        >
          <option value="">Select Floor</option>
          {floors.map((floor) => (
            <option key={floor.id} value={floor.id}>
              {floor.floorName}
            </option>
          ))}
        </select>

        {errors.floor_id && <p className="error">{errors.floor_id.message}</p>}
      </div>
      <ParkingSlot />

      <div className="category-box">
        <Link to="/parking/:id">
          <span className="add-btn">Add Parking</span>
        </Link>
      </div>

      <div className="filter-box">
        <div className="filter-input-wrapper">
          <CIcon icon={cilSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Search by Vehicle No..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-input"
          />
        </div>
      </div>

      <div className="list-container">
        <div className="list-heading">
          <h2>Parking List</h2>
        </div>

        <div className="table-responsive">
          <table className="product-table">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" onChange={handleSelectAll} checked={selectAll} />
                </th>
                <th>ID</th>
                <th>Place ID</th>
                <th>Slot ID</th>
                <th>Vehicle No</th>
                <th>Driver Name</th>
                <th>In Time</th>
                <th>Out Time</th>
                <th>Amount</th>
                <th>Paid</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => handleSelect(item.id)}
                    />
                  </td>
                  <td>{item.id}</td>
                  <td>{item.place_id}</td>
                  <td>{getCategoryWiseSlot(item.slot_id)}</td>
                  <td>{item.vehicle_no}</td>
                  <td>{item.driver_name}</td>
                  <td>{item.in_time}</td>
                  <td>{item.out_time}</td>
                  <td>{item.amount}</td>
                  <td>{item.paid}</td>
                  <td>{item.status === 1 ? 'Active' : 'Inactive'}</td>
                  <td className="actions">
                    <button className="view">👁</button>
                    <button className="edit">✏</button>
                    <button className="delete" onClick={() => deleteParking(item.id)}>
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <span>
            Showing {startIndex + 1}-{Math.min(endIndex, filteredData.length)} of{' '}
            {filteredData.length}
          </span>
          <ul>
            <li onClick={() => goToPage(currentPage - 1)}>&lt;&lt;</li>
            {[...Array(totalPages)].map((_, i) => (
              <li
                key={i}
                className={currentPage === i + 1 ? 'active' : ''}
                onClick={() => goToPage(i + 1)}
              >
                {i + 1}
              </li>
            ))}
            <li onClick={() => goToPage(currentPage + 1)}>&gt;&gt;</li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default ParkingList
