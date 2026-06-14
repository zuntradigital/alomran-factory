export interface Product {
  code: string
  nameAr: string
  nameEn: string
  category: string
  categoryAr: string
  categoryEn: string
  dimensions: string
  image: string
  featured?: boolean
}

export interface Category {
  id: string
  nameAr: string
  nameEn: string
}
