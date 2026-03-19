import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './PlacesList.css'
import { CIcon } from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'
import axios from 'axios'
import { API_BASE_URL } from '../../../apiConfig'

const ITEMS_PER_PAGE = 10

const PlacesList = () => {
  const [places, setPlaces] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token')
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  }

  const fetchPlaces = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/place/placesAll`, {
        headers: getAuthHeaders(),
      })
      if (!response.ok) {
        throw new Error('Failed to fetch places: Not authenticated')
      }
      const data = await response.json()
      setPlaces(data)
    } catch (error) {
      console.error('Error fetching places:', error.message)
      alert('Authentication required. Please log in again.')
    }
  }

  useEffect(() => {
    fetchPlaces()
  }, [])

  const filteredPlaces = places.filter((place) => {
    const term = searchTerm.toLowerCase()
    return (
      place.placeName?.toLowerCase().includes(term) ||
      place.id?.toString().includes(term) ||
      place.uid?.toString().includes(term)
    )
  })

  const totalPages = Math.ceil(filteredPlaces.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentItems = filteredPlaces.slice(startIndex, endIndex)

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const deletePlace = async (id) => {
    if (!window.confirm('Are you sure you want to delete this place?')) return
    try {
      await fetch(`${API_BASE_URL}/place/places/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
      setPlaces((prev) => prev.filter((place) => place.id !== id))
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
          fetch(`${API_BASE_URL}/place/placesMultiple/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
          }),
        ),
      )
      setPlaces((prev) => prev.filter((place) => !selectedIds.includes(place.id)))
      setSelectedIds([])
      setSelectAll(false)
    } catch (error) {
      console.error('Bulk delete failed:', error.message)
      alert('Bulk delete failed. Authentication error.')
    }
  }

  const deleteAll = async () => {
    if (!window.confirm('Delete all items?')) return
    try {
      await fetch(`${API_BASE_URL}/place/placesAll`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
      setPlaces([])
      setSelectedIds([])
      setSelectAll(false)
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
    if (selectAll) {
      setSelectedIds([])
    } else {
      const currentPageIds = currentItems.map((item) => item.id)
      setSelectedIds(currentPageIds)
    }
    setSelectAll(!selectAll)
  }

  return (
    <div>
      <div className="category-box">
        <Link to="/places">
          <span className="add-btn">New Place</span>
        </Link>
      </div>
      <div className="filter-box">
        <div className="filter-input-wrapper">
          <CIcon icon={cilSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Search by Place Name, UID, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-input"
          />
        </div>
      </div>
      <div className="list-container mt-3">
        <div className="list-heading">
          <h2>Places List</h2>
        </div>

        <div className="bulk-actions">
          <button onClick={deleteSelected} disabled={selectedIds.length === 0}>
            Delete Selected
          </button>
          <button onClick={deleteAll}>Delete All</button>
        </div>

        <div className="table-responsive">
          <table className="product-table">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                </th>
                <th>UID</th>
                <th>Place Name</th>
                <th>Description</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((p, i) => (
                <tr key={p.id || i}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(p.id)}
                      onChange={() => handleSelect(p.id)}
                    />
                  </td>
                  <td>{p.uid || `${p.id}`}</td>
                  <td>{p.placeName}</td>
                  <td>{p.description}</td>
                  <td style={{ color: p.status === 1 ? 'green' : 'red' }}>
                    {p.status === 1 ? 'Enable' : 'Disable'}
                  </td>
                  <td className="actions">
                    <button className="view" onClick={() => navigate(`/places/view/${p.id}`)}>
                      👁
                    </button>
                    <button className="edit" onClick={() => navigate(`/editPlaces/${p.id}`)}>
                      ✏️
                    </button>
                    <button className="delete" onClick={() => deletePlace(p.id)}>
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
              {currentItems.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>
                    No matching records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <span>
            Showing {startIndex + 1}-{Math.min(endIndex, filteredPlaces.length)} of{' '}
            {filteredPlaces.length}
          </span>
          <ul>
            <li onClick={() => goToPage(currentPage - 1)}>&lt;&lt;</li>
            {[...Array(totalPages)].map((_, index) => (
              <li
                key={index}
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
    </div>
  )
}

export default PlacesList
