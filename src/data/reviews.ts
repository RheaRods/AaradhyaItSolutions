export type Review = {
  id: string
  name: string
  business: string
  location: string
  rating: number
  review: string
  date: string
  initials: string
}

export const reviews: Review[] = [
  {
    id: 'REV-001',
    name: 'Rahul S.',
    business: 'Retail Shop Owner',
    location: 'Panaji',
    rating: 5,
    review: 'Aaradhya IT completely transformed our billing process. The inventory management is seamless and the local support in Goa is outstanding.',
    date: '24 Apr 2026',
    initials: 'RS'
  },
  {
    id: 'REV-002',
    name: 'Priya M.',
    business: 'Pharmacy Owner',
    location: 'Margao',
    rating: 5,
    review: 'Best pharmacy billing software in Goa. Handles expiry dates and GST filings perfectly. Highly recommended for retail shops.',
    date: '18 Apr 2026',
    initials: 'PM'
  },
  {
    id: 'REV-003',
    name: 'Suresh K.',
    business: 'FMCG Distributor',
    location: 'Vasco',
    rating: 4,
    review: 'Good software overall. Minor learning curve but the technical team helped us migrate all our old data efficiently.',
    date: '12 Mar 2026',
    initials: 'SK'
  },
  {
    id: 'REV-004',
    name: 'Anita D.',
    business: 'Retail Shop',
    location: 'Mapusa',
    rating: 5,
    review: 'Very professional team. They provided onsite training for all my staff. The interface is very intuitive and fast.',
    date: '05 Mar 2026',
    initials: 'AD'
  },
  {
    id: 'REV-005',
    name: 'Mohan T.',
    business: 'Hardware Shop',
    location: 'Ponda',
    rating: 5,
    review: 'Exceptional service from Aaradhya IT Solutions. They implemented a robust inventory management system for my hardware shop.',
    date: '10 Feb 2026',
    initials: 'MT'
  },
  {
    id: 'REV-006',
    name: 'Neha R.',
    business: 'Medical Store',
    location: 'Calangute',
    rating: 5,
    review: 'We had our POS and networking setup done by Aaradhya. They understood the specific compliance needs of a pharmacy perfectly.',
    date: '02 Feb 2026',
    initials: 'NR'
  }
]