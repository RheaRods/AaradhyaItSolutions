import API_URL from "../../config/api"

export interface CompanyInfo {
  companyName: string
  supportEmail: string
  salesEmail: string
  primaryPhone: string
  whatsapp: string
  supportPhone1: string
  supportPhone2: string
  supportPhone3: string
  salesPhone1: string
  salesPhone2: string
  address1: string
  address2: string
  city: string
  state: string
  pin: string
  youtube: string
  instagram: string
  facebook: string
  customSocials: string
  logoPath: string
  hoursWeekday: string
  hoursWeekdayOpen: boolean
  hoursSaturday: string
  hoursSaturdayOpen: boolean
  hoursSunday: string
  hoursSundayOpen: boolean
}

export const getCompanyInfo = async (): Promise<CompanyInfo> => {
  const res = await fetch(`${API_URL}/api/public/company-info`)
  if (!res.ok) throw new Error("Failed to fetch company info")
  return res.json()
}