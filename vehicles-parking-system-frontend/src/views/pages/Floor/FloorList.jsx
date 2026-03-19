import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './FloorList.css'
import { CIcon } from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'

const ITEMS_PER_PAGE = 10

const FloorList = () => {
  const [floors, setFloors] = useState([])
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

  const fetchFloors = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/floor/floorsAll', {
        headers: getAuthHeaders(),
      })
      if (!response.ok) throw new Error('Failed to fetch floors')
      const data = await response.json()
      setFloors(data)
    } catch (error) {
      console.error('Error fetching floors:', error.message)
      alert('Authentication required. Please log in again.')
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
      console.error('Error fetching places:', error.message)
    }
  }

  useEffect(() => {
    fetchFloors()
    fetchPlaces()
  }, [])

  const getPlaceName = (placeId) => {
    const place = places.find((p) => p.id === placeId)
    return place ? place.placeName : 'Unknown'
  }

  const filteredFloors = floors.filter((floor) => {
    const term = searchTerm.toLowerCase()
    return (
      floor.floorName?.toLowerCase().includes(term) ||
      floor.uid?.toString().includes(term) ||
      floor.id?.toString().includes(term)
    )
  })

  const totalPages = Math.ceil(filteredFloors.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentItems = filteredFloors.slice(startIndex, endIndex)

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const deleteFloor = async (id) => {
    if (!window.confirm('Are you sure you want to delete this floor?')) return
    try {
      await fetch(`http://127.0.0.1:8000/floor/floors/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
      setFloors((prev) => prev.filter((item) => item.id !== id))
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
          fetch(`http://127.0.0.1:8000/floor/floorsMultiple/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
          }),
        ),
      )
      setFloors((prev) => prev.filter((item) => !selectedIds.includes(item.id)))
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
      await fetch('http://127.0.0.1:8000/floor/floorsAll', {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
      setFloors([])
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
        <Link to="/Floors">
          <span className="add-btn"> New Floor</span>
        </Link>
      </div>
      <div className="filter-box">
        <div className="filter-input-wrapper">
          <CIcon icon={cilSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Search by Floor Name, UID, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-input"
          />
        </div>
      </div>
      <div className="list-container">
        <div className="list-heading">
          <h2>Floors List</h2>
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
                <th>Floor Name</th>
                <th>Floor Level</th>
                <th>Remarks</th>
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
                  <td>{getPlaceName(p.place_id)}</td>
                  <td>{p.floorName}</td>
                  <td>{p.floorLevel}</td>
                  <td>{p.remarks}</td>
                  <td style={{ color: p.status === 1 ? 'green' : 'red' }}>
                    {p.status === 1 ? 'Enable' : 'Disable'}
                  </td>
                  <td className="actions">
                    <button className="view" onClick={() => navigate(`/floors/view/${p.id}`)}>
                      👁
                    </button>
                    <button className="edit" onClick={() => navigate(`/editFloors/${p.id}`)}>
                      ✏️
                    </button>
                    <button className="delete" onClick={() => deleteFloor(p.id)}>
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
              {currentItems.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center' }}>
                    No matching records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <span>
            Showing {startIndex + 1}-{Math.min(endIndex, filteredFloors.length)} of{' '}
            {filteredFloors.length}
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
    </>
  )
}

export default FloorList
