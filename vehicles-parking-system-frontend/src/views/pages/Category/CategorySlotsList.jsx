import React, { useEffect, useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './CategorySlotsList.css'
import { CIcon } from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'

const ITEMS_PER_PAGE = 10

const CategoryWiseSlotsList = () => {
  const [categories, setCategories] = useState([])
  const [places, setPlaces] = useState([])
  const [floors, setFloors] = useState([])
  const [allCategories, setAllCategories] = useState([])

  const [currentPage, setCurrentPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token')
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  }

  // Fetch category-wise slots
  const fetchCategories = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/category/categoryWiseSlotsAll', {
        headers: getAuthHeaders(),
      })
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Failed to fetch category-wise slots:', error.message)
      alert('Authentication required. Please log in again.')
    }
  }

  const fetchPlaces = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/place/placesAll', {
        headers: getAuthHeaders(),
      })
      const data = await response.json()
      setPlaces(data)
    } catch (error) {
      console.error('Failed to fetch places:', error.message)
    }
  }

  const fetchFloors = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/floor/floorsAll', {
        headers: getAuthHeaders(),
      })
      const data = await response.json()
      setFloors(data)
    } catch (error) {
      console.error('Failed to fetch floors:', error.message)
    }
  }

  const fetchAllCategories = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/category/categoriesAll', {
        headers: getAuthHeaders(),
      })
      const data = await response.json()
      setAllCategories(data)
    } catch (error) {
      console.error('Failed to fetch categories:', error.message)
    }
  }

  useEffect(() => {
    fetchCategories()
    fetchPlaces()
    fetchFloors()
    fetchAllCategories()
  }, [])

  useEffect(() => {
    setSelectedIds([])
  }, [currentPage])

  const filteredCategories = useMemo(() => {
    const term = searchTerm.toLowerCase()
    return Array.isArray(categories)
      ? categories.filter(
          (item) =>
            item?.slotName?.toLowerCase().includes(term) ||
            item?.uid?.toString().toLowerCase().includes(term) ||
            item?.remarks?.toLowerCase().includes(term),
        )
      : []
  }, [categories, searchTerm])

  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentItems = filteredCategories.slice(startIndex, endIndex)

  const currentPageIds = currentItems.map((item) => item.id)
  const allSelected = currentPageIds.every((id) => selectedIds.includes(id))

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const deleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category slot?')) return
    try {
      await fetch(`http://127.0.0.1:8000/category/categoryWiseSlots/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
      setCategories((prev) => prev.filter((item) => item.id !== id))
    } catch (error) {
      console.error('Delete failed:', error.message)
      alert('Failed to delete. Authentication error.')
    }
  }

  const deleteSelected = async () => {
    if (!window.confirm('Delete selected category slots?')) return
    try {
      await Promise.all(
        selectedIds.map((id) =>
          fetch(`http://127.0.0.1:8000/category/categoriesSlotsMultiple/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
          }),
        ),
      )
      setCategories((prev) => prev.filter((item) => !selectedIds.includes(item.id)))
      setSelectedIds([])
    } catch (error) {
      console.error('Bulk delete failed:', error.message)
      alert('Bulk delete failed. Authentication error.')
    }
  }

  const deleteAll = async () => {
    if (!window.confirm('Delete all category slots?')) return
    try {
      await fetch('http://127.0.0.1:8000/category/categoryWiseSlotAll', {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
      setCategories([])
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
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !currentPageIds.includes(id)))
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...currentPageIds])])
    }
  }

  // Helpers to resolve names
  const getPlaceName = (id) => places.find((p) => p.id === id)?.placeName || 'Unknown'
  const getFloorName = (id) => floors.find((f) => f.id === id)?.floorName || 'Unknown'
  const getCategoryName = (id) => allCategories.find((c) => c.id === id)?.type || 'Unknown'

  return (
    <>
      <div className="category-box">
        <Link to="/categoryslot">
          <span className="add-btn"> New Category Slot</span>
        </Link>
      </div>

      <div className="filter-box">
        <div className="filter-input-wrapper">
          <CIcon icon={cilSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Search by Slot Name, UID, or Remarks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-input"
          />
        </div>
      </div>

      <div className="list-container">
        <div className="list-heading">
          <h2>Category-Wise Slots List</h2>
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
                  <input type="checkbox" checked={allSelected} onChange={handleSelectAll} />
                </th>
                <th>UID</th>
                <th>Place Name</th>
                <th>Floor Name</th>
                <th>Category Type</th>
                <th>Slot Name</th>
                <th>Slot ID</th>
                <th>Identity</th>
                <th>Remarks</th>
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
                  <td>{p.uid || p.id}</td>
                  <td>{getPlaceName(p.place_id)}</td>
                  <td>{getFloorName(p.floor_id)}</td>
                  <td>{getCategoryName(p.category_id)}</td>
                  <td>{p.slotName}</td>
                  <td>{p.slotID}</td>
                  <td>{p.identity}</td>
                  <td>{p.remarks}</td>
                  <td style={{ color: p.status === 1 ? 'green' : 'red' }}>
                    {p.status === 1 ? 'Enable' : 'Disable'}
                  </td>
                  <td className="actions">
                    <button className="view" onClick={() => navigate(`/floors/view/${p.id}`)}>
                      👁
                    </button>
                    <button className="edit" onClick={() => navigate(`/categoryslotEdit/${p.id}`)}>
                      ✏️
                    </button>
                    <button className="delete" onClick={() => deleteCategory(p.id)}>
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
              {currentItems.length === 0 && (
                <tr>
                  <td colSpan="11" style={{ textAlign: 'center' }}>
                    No matching records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <span>
            Showing {startIndex + 1}-{Math.min(endIndex, filteredCategories.length)} of{' '}
            {filteredCategories.length}
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

export default CategoryWiseSlotsList
