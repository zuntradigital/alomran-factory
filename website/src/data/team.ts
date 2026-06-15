import mohammedImg from '../assets/team/mohammed.jpg'
import ahmedImg from '../assets/team/ahmed.jpg'
import khalidImg from '../assets/team/khalid.jpg'
import noufImg from '../assets/team/nouf.jpg'

export interface TeamMember {
  id: number
  name: string
  roleAr: string
  roleEn: string
  image: string
}

export const team: TeamMember[] = [
  { id: 1, name: 'Mohammed Ibrahim', roleAr: 'الرئيس التنفيذي والمؤسس', roleEn: 'CEO & Founder', image: mohammedImg },
  { id: 2, name: 'Ahmed Alharbi', roleAr: 'مدير المشاريع', roleEn: 'Project Director', image: ahmedImg },
  { id: 3, name: 'Khalid Almutairi', roleAr: 'مدير الهندسة', roleEn: 'Engineering Manager', image: khalidImg },
  { id: 4, name: 'Nouf Alshammari', roleAr: 'مدير التصميم', roleEn: 'Design Manager', image: noufImg },
]
