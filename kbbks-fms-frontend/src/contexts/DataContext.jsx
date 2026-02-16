import { createContext, useContext, useState, useEffect } from 'react'
import { getVendors } from '../services/vendor.service'
import { getBills } from '../services/bill.service'

const DataContext = createContext()

export function DataProvider({ children }) {
  const [vendors, setVendors] = useState([])
  const [bills, setBills] = useState([])
  const [loadingVendors, setLoadingVendors] = useState(false)
  const [loadingBills, setLoadingBills] = useState(false)
  const [vendorError, setVendorError] = useState(null)
  const [billError, setBillError] = useState(null)

  // Fetch vendors once on mount
  useEffect(() => {
    fetchVendors()
  }, [])

  const fetchVendors = async () => {
    setLoadingVendors(true)
    setVendorError(null)
    try {
      const response = await getVendors()
      const vendorsArray = response?.data?.data ?? response?.data ?? response
      setVendors(Array.isArray(vendorsArray) ? vendorsArray : [])
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to load vendors'
      setVendorError(errorMsg)
      setVendors([])
    } finally {
      setLoadingVendors(false)
    }
  }

  const fetchBills = async () => {
    if (bills.length > 0) return // Use cache if already loaded
    
    setLoadingBills(true)
    setBillError(null)
    try {
      const response = await getBills()
      const billsArray = response?.data?.data ?? response?.data ?? response
      setBills(Array.isArray(billsArray) ? billsArray : [])
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to load bills'
      setBillError(errorMsg)
      setBills([])
    } finally {
      setLoadingBills(false)
    }
  }

  const refreshVendors = () => fetchVendors()
  const refreshBills = () => {
    setBills([])
    fetchBills()
  }

  return (
    <DataContext.Provider
      value={{
        vendors,
        bills,
        loadingVendors,
        loadingBills,
        vendorError,
        billError,
        fetchVendors: refreshVendors,
        fetchBills,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
