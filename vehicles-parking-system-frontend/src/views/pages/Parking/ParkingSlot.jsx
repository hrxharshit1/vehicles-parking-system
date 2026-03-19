import React, { useEffect, useState } from 'react'
import './ParkingSlot.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../../../apiConfig'

const ParkingSlot = () => {
  const [selectedSlots, setSelectedSlots] = useState([])
  const [showPopup, setShowPopup] = useState(false)
  const [slotsData, setSlotsData] = useState([])
  const [parkingList, setParkingList] = useState([])

  const navigate = useNavigate()

  const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token')
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  }

  useEffect(() => {
    // Fetch category slots and parking data in parallel
    const fetchData = async () => {
      try {
        const [slotsRes, parkingRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/category/categoryWiseSlotsAll`, {
            headers: getAuthHeaders(),
          }),
          axios.get(`${API_BASE_URL}/parking/parkingAll`, {
            headers: getAuthHeaders(),
          }),
        ])

        const flatSlots = slotsRes.data || []
        const formattedSlots = groupIntoGrid(flatSlots, 3, 5, 5)

        setSlotsData(formattedSlots)
        setParkingList(parkingRes.data || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  const groupIntoGrid = (slots, sections = 3, rows = 5, cols = 5) => {
    const grid = []
    let index = 0
    for (let s = 0; s < sections; s++) {
      const section = []
      for (let r = 0; r < rows; r++) {
        const row = []
        for (let c = 0; c < cols; c++) {
          row.push(slots[index] || null)
          index++
        }
        section.push(row)
      }
      grid.push(section)
    }
    return grid
  }

  const toggleSlot = (secIndex, rowIndex, colIndex) => {
    const key = `${secIndex}-${rowIndex}-${colIndex}`
    setSelectedSlots([key])
    setShowPopup(true)
  }

  const getSlotClass = (slot, key) => {
    if (!slot) return 'empty'
    const slotID = slot.slotID
    const isSelected = selectedSlots.includes(key)

    // Check if slotID exists in parkingList
    const isInParking = parkingList.some((p) => p.slotId === slotID)

    const baseClass = isInParking ? 'pink' : 'white'
    return `${baseClass} ${isSelected ? 'selected' : ''}`
  }

  const handlePopupOk = () => {
    const lastSelectedKey = selectedSlots[selectedSlots.length - 1]
    const [secIndex, rowIndex, colIndex] = lastSelectedKey.split('-').map(Number)
    const selectedSlot = slotsData[secIndex]?.[rowIndex]?.[colIndex]

    if (selectedSlot?.slotID) {
      navigate(`/parking/${selectedSlot.slotID}`, {
        state: { slotID: selectedSlot.slotID },
      })
    } else {
      alert('Slot data not found.')
      setShowPopup(false)
    }
  }

  const handlePopupCancel = () => {
    setShowPopup(false)
  }

  return (
    <>
      <div className="parking-container">
        {slotsData.map((section, secIndex) => (
          <div key={secIndex} className="parking-section">
            {section.map((row, rowIndex) => (
              <div key={rowIndex} className="parking-row">
                {/* {row.map((slot, colIndex) => {
                  const key = `${secIndex}-${rowIndex}-${colIndex}` */}
                {row.map((slot, colIndex) => {
                  const key = `${secIndex}-${rowIndex}-${colIndex}`
                  const isSelected = selectedSlots.includes(key)
                  const isInParking = slot && parkingList.some((p) => p.slotId === slot.slotID)
                  // Determine class
                  const slotClass = slot
                    ? `${isInParking ? 'pink' : 'white'} ${isSelected ? 'selected' : ''}`
                    : 'disabled'
                  return (
                    <div
                      key={key}
                      className={slotClass}
                      onClick={() => {
                        if (slot) toggleSlot(secIndex, rowIndex, colIndex)
                      }}
                    >
                      {slot?.slotName || '--'}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        ))}
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-modal">
            <p>Do you want to proceed to the parking form?</p>
            <div className="popup-actions">
              <button onClick={handlePopupOk} className="popup-ok">
                OK
              </button>
              <button onClick={handlePopupCancel} className="popup-cancel">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ParkingSlot
