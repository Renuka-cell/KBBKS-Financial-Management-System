import { createContext, useContext, useState, useEffect } from 'react'
import { getVendors } from '../services/vendor.service'
import { getBills } from '../services/bill.service'
import defaultAvatar from '../pictures/avatardefault_92824.png'

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
      const finalVendors = (Array.isArray(vendorsArray) ? vendorsArray : []).map((v) => {
        const logo = v.logo || ''
        const isBackendDefault = typeof logo === 'string' && logo.includes('/uploads/vendor_logos/default.png')
        return {
          ...v,
          logo: isBackendDefault ? defaultAvatar : logo,
        }
      })
      setVendors(finalVendors)
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to load vendors'
      setVendorError(errorMsg)
      setVendors([])
    } finally {
      setLoadingVendors(false)
    }
  }

  const fetchBills = async (options = {}) => {
    setLoadingBills(true)
    setBillError(null)
    try {
      const params = options?.pendingOnly ? { pending: 1 } : undefined
      const response = await getBills(params)
      const billsArray = response?.data?.data ?? response?.data ?? response
      const apiBase = import.meta.env.VITE_API_URL || '';
      const preparedBills = Array.isArray(billsArray) ? billsArray : [];
      preparedBills.forEach(b => {
        if (b.vendor_logo && !b.vendor_logo.match(/^https?:\/\//)) {
          b.vendor_logo = apiBase.replace(/\/?$/, '') + '/' + b.vendor_logo.replace(/^\//, '');
        }
      });
      setBills(preparedBills)
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
