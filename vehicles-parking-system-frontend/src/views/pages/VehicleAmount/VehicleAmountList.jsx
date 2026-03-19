import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../../../apiConfig'
import './VehicleAmountList.css'
import { CIcon } from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'

const ITEMS_PER_PAGE = 10

const VehicleAmountList = () => {
  const [vehicleAmounts, setVehicleAmounts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryTypes, setCategoryTypes] = useState([])
  const navigate = useNavigate()

  const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token')
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  }

  const fetchVehicleAmounts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/vehicleamount/vehicleAmountAll`, {
        headers: getAuthHeaders(),
      })
      if (!response.ok) throw new Error('Failed to fetch vehicle amounts')
      const data = await response.json()
      setVehicleAmounts(data)
      console.log('VehicleAmounts fetched:', data) // DEBUG: check vehiclesCategory format
    } catch (error) {
      console.error('Error fetching vehicle amounts:', error.message)
      alert('Authentication required. Please log in again.')
    }
  }

  const fetchCategoryTypes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/category/categoriesAll`, {
        headers: getAuthHeaders(),
      })
      setCategoryTypes(response.data)
    } catch (err) {
      console.error('Error fetching category types:', err)
    }
  }

  useEffect(() => {
    fetchVehicleAmounts()
    fetchCategoryTypes()
  }, [])

  const getCategoryType = (category) => {
    if (!category) return 'Unknown'
    if (typeof category === 'object' && category.type) {
      return category.type
    }
    const found = categoryTypes.find((t) => String(t.id) === String(category))
    return found ? found.type : 'Unknown'
  }

  const filteredItems = vehicleAmounts.filter((item) => {
    const term = searchTerm.toLowerCase()
    const vehicleType = getCategoryType(item.vehiclesCategory).toLowerCase()
    return (
      item.uid?.toLowerCase().includes(term) ||
      item.rateName?.toLowerCase().includes(term) ||
      vehicleType.includes(term)
    )
  })

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const currentItems = filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  useEffect(() => {
    const currentIds = currentItems.map((item) => item.id)
    setSelectAll(currentIds.every((id) => selectedIds.includes(id)))
  }, [currentItems, selectedIds])

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const deleteVehicleAmount = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vehicle amount?')) return
    try {
      await fetch(`${API_BASE_URL}/vehicleamount/vehicleAmount/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
      setVehicleAmounts((prev) => prev.filter((item) => item.id !== id))
    } catch (error) {
      console.error('Delete failed:', error.message)
      alert('Failed to delete. Authentication error.')
    }
  }

  const deleteSelected = async () => {
    if (!window.confirm('Delete selected items?')) return
    try {
      await Promise.all(
        selectedIds.map((id) =>
          fetch(`${API_BASE_URL}/vehicleamount/vehiclesAmountMultiple/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
          }),
        ),
      )
      setVehicleAmounts((prev) => prev.filter((item) => !selectedIds.includes(item.id)))
      setSelectedIds([])
    } catch (error) {
      console.error('Bulk delete failed:', error.message)
      alert('Bulk delete failed. Authentication error.')
    }
  }

  const deleteAll = async () => {
    if (!window.confirm('Delete all items?')) return
    try {
      await fetch(`${API_BASE_URL}/vehicleamount/vehicleAmountAll`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
      setVehicleAmounts([])
      setSelectedIds([])
    } catch (error) {
      console.error('Delete all failed:', error.message)
      alert('Failed to delete all. Authentication error.')
    }
  }

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }

  const handleSelectAll = () => {
    const currentIds = currentItems.map((item) => item.id)
    if (selectAll) {
      setSelectedIds((prev) => prev.filter((id) => !currentIds.includes(id)))
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...currentIds])])
    }
  }

  return (
    <>
      <div className="category-box">
        <Link to="/VehicleAmount">
          <span className="add-btn">Add Vehicle Amount</span>
        </Link>
      </div>

      <div className="filter-box">
        <div className="filter-input-wrapper">
          <CIcon icon={cilSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Search by UID, Rate Name, or Vehicle Category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-input"
          />
        </div>
      </div>

      <div className="list-container">
        <div className="list-heading">
          <h2>Vehicle Amount List</h2>
        </div>

        <div className="bulk-actions">
          <button
            className="delete-selected"
            onClick={deleteSelected}
            disabled={selectedIds.length === 0}
          >
            Delete Selected
          </button>
          <button className="delete-all" onClick={deleteAll} disabled={vehicleAmounts.length === 0}>
            Delete All
          </button>
        </div>

        <div className="table-responsive">
          <table className="product-table">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                </th>
                <th>ID</th>
                <th>Rate Name</th>
                <th>Vehicle's Category</th>
                <th>Type</th>
                <th>Rate</th>
                <th>Category</th>
                <th>Set Time</th>
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
                  <td>{item.uid || `#${item.id}`}</td>
                  <td>{item.rateName}</td>
                  <td>{getCategoryType(item.vehicleCategory)}</td>
                  <td>{item.type}</td>
                  <td>{item.rate}</td>
                  <td>{item.category}</td>
                  <td>{item.setTime}</td>
                  <td className="actions">
                    <button
                      className="view"
                      onClick={() => navigate(`/vehicleAmount/view/${item.id}`)}
                    >
                      👁
                    </button>
                    <button
                      className="edit"
                      onClick={() => navigate(`/vehicleAmount/edit/${item.id}`)}
                    >
                      ✏️
                    </button>
                    <button className="delete" onClick={() => deleteVehicleAmount(item.id)}>
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
            Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredItems.length)}{' '}
            of {filteredItems.length}
          </span>
          <ul>
            <li onClick={() => goToPage(currentPage - 1)}>&lt;&lt;</li>
            {[...Array(totalPages)].map((_, index) => (
              <li
                key={`page-${index + 1}`}
                className={currentPage === index + 1 ? 'active' : ''}
                onClick={() => goToPage(index + 1)}
              >
                {index + 1}
              </li>
            ))}
            <li onClick={() => goToPage(currentPage + 1)}>&gt;&gt;</li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default VehicleAmountList
