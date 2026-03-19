import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './RoleUserList.css'
import { CIcon } from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'
const ITEMS_PER_PAGE = 10

const RoleUserList = () => {
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
      const response = await fetch('http://127.0.0.1:8000/place/placesAll', {
        headers: getAuthHeaders(),
      })
      if (!response.ok) throw new Error('Failed to fetch places')
      const data = await response.json()
      setPlaces(data)
    } catch (error) {
      console.error('Error:', error.message)
      alert('Authentication failed. Please log in again.')
    }
  }

  useEffect(() => {
    fetchPlaces()
  }, [])

  const totalPages = Math.ceil(places.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentItems = places.slice(startIndex, endIndex)

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const deletePlace = async (id) => {
    if (!window.confirm('Are you sure you want to delete this place?')) return
    try {
      await fetch(`http://127.0.0.1:8000/place/places/${id}`, {
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
          fetch(`http://127.0.0.1:8000/place/placesMultiple/${id}`, {
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
      await fetch('http://127.0.0.1:8000/place/placesAll', {
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
    <>
      <div className="category-box">
        <Link to="/roleuser">
          <span className="add-btn">New Role User</span>
        </Link>
      </div>
      <div className="filter-box">
        <input
          type="text"
          placeholder="Search by Role User..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="filter-input"
        />
      </div>
      <div className="list-container">
        <div className="list-heading">
          <h2>Role User List</h2>
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
              {currentItems.map((p) => (
                <tr key={p.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(p.id)}
                      onChange={() => handleSelect(p.id)}
                    />
                  </td>
                  <td>{p.uid || `#${p.id}`}</td>
                  <td>{p.placeName}</td>
                  <td>{p.description}</td>
                  <td>{p.status}</td>
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
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <span>
            Showing {startIndex + 1}-{Math.min(endIndex, places.length)} of {places.length}
          </span>
          <ul>
            <li onClick={() => goToPage(currentPage - 1)}>&laquo;</li>
            {[...Array(totalPages)].map((_, index) => (
              <li
                key={index}
                className={currentPage === index + 1 ? 'active' : ''}
                onClick={() => goToPage(index + 1)}
              >
                {index + 1}
              </li>
            ))}
            <li onClick={() => goToPage(currentPage + 1)}>&raquo;</li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default RoleUserList
