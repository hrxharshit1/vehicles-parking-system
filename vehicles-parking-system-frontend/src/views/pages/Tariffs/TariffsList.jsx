import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './TariffsList.css'

const ITEMS_PER_PAGE = 10

const TariffsList = () => {
  const [tariffs, setTariffs] = useState([])
  const [places, setPlaces] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const navigate = useNavigate()

  const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token')
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  }

  const fetchTariffs = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/tariff/tariffsAll', {
        headers: getAuthHeaders(),
      })
      if (!response.ok) throw new Error('Failed to fetch tariffs')
      const data = await response.json()
      setTariffs(data)
    } catch (error) {
      console.error('Error fetching tariffs:', error.message)
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
    fetchTariffs()
    fetchPlaces()
  }, [])

  const getPlaceName = (placeId) => {
    const place = places.find((p) => p.id === placeId)
    return place ? place.placeName : 'Unknown'
  }

  const totalPages = Math.ceil(tariffs.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentItems = tariffs.slice(startIndex, endIndex)

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const deleteTariff = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tariff?')) return
    try {
      await fetch(`http://127.0.0.1:8000/tariff/tariffs/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
      setTariffs((prev) => prev.filter((item) => item.id !== id))
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
          fetch(`http://127.0.0.1:8000/tariff/tariffsMultiple/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
          }),
        ),
      )
      setTariffs((prev) => prev.filter((item) => !selectedIds.includes(item.id)))
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
      await fetch('http://127.0.0.1:8000/tariff/tariffsAll', {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
      setTariffs([])
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
    const currentPageIds = currentItems.map((item) => item.id)
    if (currentPageIds.every((id) => selectedIds.includes(id))) {
      setSelectedIds((prev) => prev.filter((id) => !currentPageIds.includes(id)))
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...currentPageIds])])
    }
    setSelectAll(!selectAll)
  }

  return (
    <div className="list-container">
      <div className="list-heading">
        <h2>Tariffs List</h2>
        <Link to="/tariffs">
          <span className="add-btn">Add Tariff</span>
        </Link>
      </div>

      <div className="bulk-actions">
        <button onClick={deleteSelected} className='btn' disabled={selectedIds.length === 0}>
          Delete Selected
        </button>
        <button onClick={deleteAll} className='btn'>Delete All</button>
      </div>

      <div className="table-responsive">
        <table className="product-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={currentItems.every((item) => selectedIds.includes(item.id))}
                  onChange={handleSelectAll}
                />
              </th>
              <th>UID</th>
              <th>Place</th>
              <th>Tariff Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Min Amount</th>
              <th>Per Hour</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center' }}>
                  No records found.
                </td>
              </tr>
            ) : (
              currentItems.map((p) => (
                <tr key={p.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(p.id)}
                      onChange={() => handleSelect(p.id)}
                    />
                  </td>
                  <td>{p.uid || p.id}</td>
                  <td>{getPlaceName(p.place_id)}</td>
                  <td>{p.tariffName}</td>
                  <td>{p.startDate}</td>
                  <td>{p.endDate}</td>
                  <td>{p.minAmount}</td>
                  <td>{p.parHour}</td>
                  <td style={{ color: p.status === 1 ? 'green' : 'red' }}>
                    {p.status === 1 ? 'Enable' : 'Disable'}
                  </td>
                  <td className="actions">
                    <button className="view" onClick={() => navigate(`/places/view/${p.id}`)}>
                      👁
                    </button>
                    <button className="edit" onClick={() => navigate(`/tariffsEdit/${p.id}`)}>
                      ✏
                    </button>
                    <button className="delete" onClick={() => deleteTariff(p.id)}>
                      🗑
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <span>
          Showing {startIndex + 1}-{Math.min(endIndex, tariffs.length)} of {tariffs.length}
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
  )
}

export default TariffsList
