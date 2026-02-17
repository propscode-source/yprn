import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/useAuth'
import {
  Plus,
  Edit3,
  Trash2,
  X,
  Upload,
  Calendar,
  MapPin,
  Tag,
  Image,
  LogOut,
  LayoutDashboard,
  AlertCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  Home,
  Briefcase,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { API_URL, getImageUrl } from '../config/api'

const AdminDashboard = () => {
  const { admin, token, logout } = useAuth()
  const navigate = useNavigate()
  const [kegiatan, setKegiatan] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [detailItem, setDetailItem] = useState(null)
  const [message, setMessage] = useState({ text: '', type: '' })
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 9

  // Hero Beranda state
  const [heroImages, setHeroImages] = useState([])
  const [heroLoading, setHeroLoading] = useState(true)
  const [showHeroModal, setShowHeroModal] = useState(false)
  const [editingHero, setEditingHero] = useState(null)
  const [deleteHeroConfirm, setDeleteHeroConfirm] = useState(null)
  const [heroFormData, setHeroFormData] = useState({ judul: '', deskripsi: '', urutan: 0 })
  const [heroImageFile, setHeroImageFile] = useState(null)
  const [heroImagePreview, setHeroImagePreview] = useState(null)
  const [heroFormLoading, setHeroFormLoading] = useState(false)

  // Proyek state
  const [proyek, setProyek] = useState([])
  const [proyekLoading, setProyekLoading] = useState(true)
  const [showProyekModal, setShowProyekModal] = useState(false)
  const [editingProyek, setEditingProyek] = useState(null)
  const [deleteProyekConfirm, setDeleteProyekConfirm] = useState(null)
  const [detailProyek, setDetailProyek] = useState(null)
  const [proyekFormData, setProyekFormData] = useState({
    judul: '',
    deskripsi: '',
    detail: '',
    tags: '',
    kategori: 'sia',
  })
  const [proyekImageFile, setProyekImageFile] = useState(null)
  const [proyekImagePreview, setProyekImagePreview] = useState(null)
  const [proyekFormLoading, setProyekFormLoading] = useState(false)
  const [proyekCurrentPage, setProyekCurrentPage] = useState(1)
  const PROYEK_PER_PAGE = 6

  // Form state
  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: '',
    tanggal: '',
    lokasi: '',
    kategori: 'kegiatan',
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [formLoading, setFormLoading] = useState(false)

  const fetchKegiatan = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/kegiatan`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setKegiatan(data)
    } catch (err) {
      console.error('Error fetching kegiatan:', err)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchKegiatan()
  }, [fetchKegiatan])

  // Hero Beranda fetch & handlers
  const fetchHeroImages = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/hero-beranda`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setHeroImages(data)
    } catch (err) {
      console.error('Error fetching hero images:', err)
    } finally {
      setHeroLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchHeroImages()
  }, [fetchHeroImages])

  const openCreateHeroModal = () => {
    setEditingHero(null)
    setHeroFormData({ judul: '', deskripsi: '', urutan: 0 })
    setHeroImageFile(null)
    setHeroImagePreview(null)
    setShowHeroModal(true)
  }

  const openEditHeroModal = (item) => {
    setEditingHero(item)
    setHeroFormData({
      judul: item.judul || '',
      deskripsi: item.deskripsi || '',
      urutan: item.urutan || 0,
    })
    setHeroImageFile(null)
    setHeroImagePreview(item.gambar ? getImageUrl(item.gambar) : null)
    setShowHeroModal(true)
  }

  const handleHeroImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setHeroImageFile(file)
      setHeroImagePreview(URL.createObjectURL(file))
    }
  }

  const handleHeroSubmit = async (e) => {
    e.preventDefault()
    setHeroFormLoading(true)

    try {
      const data = new FormData()
      data.append('judul', heroFormData.judul)
      data.append('deskripsi', heroFormData.deskripsi)
      data.append('urutan', heroFormData.urutan)
      if (heroImageFile) {
        data.append('gambar', heroImageFile)
      }

      const url = editingHero
        ? `${API_URL}/hero-beranda/${editingHero.id}`
        : `${API_URL}/hero-beranda`

      const res = await fetch(url, {
        method: editingHero ? 'PUT' : 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      })

      if (res.ok) {
        showMessage(
          editingHero ? 'Hero image berhasil diperbarui!' : 'Hero image berhasil ditambahkan!'
        )
        setShowHeroModal(false)
        fetchHeroImages()
      } else {
        const errData = await res.json()
        showMessage(errData.message || 'Terjadi kesalahan', 'error')
      }
    } catch {
      showMessage('Gagal menyimpan hero image', 'error')
    } finally {
      setHeroFormLoading(false)
    }
  }

  const handleDeleteHero = async (id) => {
    try {
      const res = await fetch(`${API_URL}/hero-beranda/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.ok) {
        showMessage('Hero image berhasil dihapus!')
        setDeleteHeroConfirm(null)
        fetchHeroImages()
      }
    } catch {
      showMessage('Gagal menghapus hero image', 'error')
    }
  }

  // ==================== PROYEK HANDLERS ====================
  const fetchProyek = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/proyek`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setProyek(Array.isArray(data) ? data : [])
      }
    } catch (err) {
      console.error('Error fetching proyek:', err)
    } finally {
      setProyekLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchProyek()
  }, [fetchProyek])

  const openCreateProyekModal = () => {
    setEditingProyek(null)
    setProyekFormData({ judul: '', deskripsi: '', detail: '', tags: '', kategori: 'sia' })
    setProyekImageFile(null)
    setProyekImagePreview(null)
    setShowProyekModal(true)
  }

  const openEditProyekModal = (item) => {
    setEditingProyek(item)
    setProyekFormData({
      judul: item.judul || '',
      deskripsi: item.deskripsi || '',
      detail: item.detail || '',
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : '',
      kategori: item.kategori || 'sia',
    })
    setProyekImageFile(null)
    setProyekImagePreview(item.gambar ? getImageUrl(item.gambar) : null)
    setShowProyekModal(true)
  }

  const handleProyekImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProyekImageFile(file)
      setProyekImagePreview(URL.createObjectURL(file))
    }
  }

  const handleProyekSubmit = async (e) => {
    e.preventDefault()
    setProyekFormLoading(true)

    try {
      const data = new FormData()
      data.append('judul', proyekFormData.judul)
      data.append('deskripsi', proyekFormData.deskripsi)
      data.append('detail', proyekFormData.detail)
      data.append('tags', proyekFormData.tags)
      data.append('kategori', proyekFormData.kategori)
      if (proyekImageFile) {
        data.append('gambar', proyekImageFile)
      }

      const url = editingProyek ? `${API_URL}/proyek/${editingProyek.id}` : `${API_URL}/proyek`

      const res = await fetch(url, {
        method: editingProyek ? 'PUT' : 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      })

      if (res.ok) {
        showMessage(editingProyek ? 'Proyek berhasil diperbarui!' : 'Proyek berhasil ditambahkan!')
        setShowProyekModal(false)
        fetchProyek()
      } else {
        const errData = await res.json()
        showMessage(errData.message || 'Terjadi kesalahan', 'error')
      }
    } catch {
      showMessage('Gagal menyimpan proyek', 'error')
    } finally {
      setProyekFormLoading(false)
    }
  }

  const handleDeleteProyek = async (id) => {
    try {
      const res = await fetch(`${API_URL}/proyek/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.ok) {
        showMessage('Proyek berhasil dihapus!')
        setDeleteProyekConfirm(null)
        fetchProyek()
      }
    } catch {
      showMessage('Gagal menghapus proyek', 'error')
    }
  }

  const proyekTotalPages = Math.ceil(proyek.length / PROYEK_PER_PAGE)
  const paginatedProyek = proyek.slice(
    (proyekCurrentPage - 1) * PROYEK_PER_PAGE,
    proyekCurrentPage * PROYEK_PER_PAGE
  )

  const goToProyekPage = (page) => {
    setProyekCurrentPage(page)
    document.getElementById('proyek-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  const proyekKategoriLabel = {
    sia: 'SIA',
    sroi: 'SROI',
  }

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage({ text: '', type: '' }), 3000)
  }

  const openCreateModal = () => {
    setEditingItem(null)
    setFormData({ judul: '', deskripsi: '', tanggal: '', lokasi: '', kategori: 'kegiatan' })
    setImageFile(null)
    setImagePreview(null)
    setShowModal(true)
  }

  const openEditModal = (item) => {
    setEditingItem(item)
    setFormData({
      judul: item.judul,
      deskripsi: item.deskripsi || '',
      tanggal: item.tanggal ? item.tanggal.split('T')[0] : '',
      lokasi: item.lokasi || '',
      kategori: item.kategori || 'kegiatan',
    })
    setImageFile(null)
    setImagePreview(item.gambar ? getImageUrl(item.gambar) : null)
    setShowModal(true)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)

    try {
      const data = new FormData()
      data.append('judul', formData.judul)
      data.append('deskripsi', formData.deskripsi)
      data.append('tanggal', formData.tanggal)
      data.append('lokasi', formData.lokasi)
      data.append('kategori', formData.kategori)
      if (imageFile) {
        data.append('gambar', imageFile)
      }

      const url = editingItem ? `${API_URL}/kegiatan/${editingItem.id}` : `${API_URL}/kegiatan`

      const res = await fetch(url, {
        method: editingItem ? 'PUT' : 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      })

      if (res.ok) {
        showMessage(
          editingItem ? 'Kegiatan berhasil diperbarui!' : 'Kegiatan berhasil ditambahkan!'
        )
        setShowModal(false)
        fetchKegiatan()
      } else {
        const errData = await res.json()
        showMessage(errData.message || 'Terjadi kesalahan', 'error')
      }
    } catch {
      showMessage('Gagal menyimpan kegiatan', 'error')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/kegiatan/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.ok) {
        showMessage('Kegiatan berhasil dihapus!')
        setDeleteConfirm(null)
        fetchKegiatan()
      }
    } catch {
      showMessage('Gagal menghapus kegiatan', 'error')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const kategoriLabel = {
    kegiatan: 'Kegiatan',
    sia: 'Social Impact Assessment',
    sroi: 'Social Return on Investment',
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return null
    return new Date(dateStr).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const totalPages = Math.ceil(kegiatan.length / ITEMS_PER_PAGE)
  const paginatedKegiatan = kegiatan.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const goToPage = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 200, behavior: 'smooth' })
  }

  return (
    <div className="pt-20 min-h-screen bg-dark">
      {/* Header */}
      <div className="bg-dark-50/80 border-b border-dark-200/50">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <LayoutDashboard className="text-primary" size={24} />
              <div>
                <h1 className="text-xl font-bold text-text-heading">Admin Dashboard</h1>
                <p className="text-sm text-text-muted">
                  Selamat datang, {admin?.nama || admin?.username}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/20 transition-all duration-300"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div className="container-custom mt-4">
          <div
            className={`p-4 rounded-xl text-sm font-medium ${
              message.type === 'error'
                ? 'bg-red-500/10 border border-red-500/30 text-red-400'
                : 'bg-green-500/10 border border-green-500/30 text-green-400'
            }`}
          >
            {message.text}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="px-0 md:px-6 lg:px-8 max-w-7xl mx-auto py-4 md:py-8">
        {/* ==================== HERO BERANDA SECTION ==================== */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6 md:mb-8 px-4 md:px-0">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Home size={20} className="text-primary" />
                <h2 className="text-2xl font-bold text-text-heading">Hero Beranda</h2>
              </div>
              <p className="text-text-body text-sm mt-1">
                Kelola gambar hero yang tampil di halaman utama
              </p>
            </div>
            <button
              onClick={openCreateHeroModal}
              className="flex items-center space-x-2 px-4 py-2.5 sm:px-5 sm:py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 text-sm sm:text-base"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Tambah Gambar</span>
              <span className="sm:hidden">Tambah</span>
            </button>
          </div>

          {heroLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : heroImages.length === 0 ? (
            <div className="text-center py-12 px-4 bg-dark-50/80 rounded-none md:rounded-2xl border-b md:border border-dark-200/50 mx-0 md:mx-0">
              <Image className="mx-auto text-text-muted mb-4" size={48} />
              <p className="text-text-body text-lg">Belum ada hero image</p>
              <p className="text-text-muted text-sm mt-1">
                Gambar default akan ditampilkan di halaman beranda
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 md:gap-6">
              {heroImages.map((item) => (
                <div
                  key={item.id}
                  className="bg-dark-50/80 rounded-none md:rounded-2xl border-b md:border border-dark-200/50 overflow-hidden group hover:border-primary/30 transition-all duration-300"
                >
                  <div className="relative h-52 sm:h-48 bg-dark-200/30">
                    {item.gambar ? (
                      <img
                        src={getImageUrl(item.gambar)}
                        alt={item.judul || 'Hero Image'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Image className="text-text-muted" size={40} />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-secondary/80 text-white text-xs font-medium rounded-full">
                        Urutan: {item.urutan}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 md:p-5">
                    <h3 className="text-lg font-bold text-text-heading mb-1 line-clamp-1">
                      {item.judul || 'Tanpa judul'}
                    </h3>
                    {item.deskripsi && (
                      <p className="text-text-body text-sm mb-3 line-clamp-2">{item.deskripsi}</p>
                    )}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditHeroModal(item)}
                        className="flex-1 flex items-center justify-center space-x-1 py-2 bg-primary/10 text-primary border border-primary/30 rounded-xl hover:bg-primary/20 transition-all text-sm font-medium"
                      >
                        <Edit3 size={14} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => setDeleteHeroConfirm(item.id)}
                        className="flex-1 flex items-center justify-center space-x-1 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/20 transition-all text-sm font-medium"
                      >
                        <Trash2 size={14} />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-dark-200/50 mx-4 md:mx-0 mb-8"></div>

        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6 md:mb-8 px-4 md:px-0">
          <div>
            <h2 className="text-2xl font-bold text-text-heading">Kelola Kegiatan</h2>
            <p className="text-text-body text-sm mt-1">
              Tambah, edit, atau hapus dokumentasi kegiatan
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center space-x-2 px-4 py-2.5 sm:px-5 sm:py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 text-sm sm:text-base"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Tambah Kegiatan</span>
            <span className="sm:hidden">Tambah</span>
          </button>
        </div>

        {/* Kegiatan List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : kegiatan.length === 0 ? (
          <div className="text-center py-20 px-4">
            <Image className="mx-auto text-text-muted mb-4" size={48} />
            <p className="text-text-body text-lg">Belum ada kegiatan</p>
            <p className="text-text-muted text-sm mt-1">
              Klik tombol "Tambah Kegiatan" untuk menambahkan
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 md:gap-6">
              {paginatedKegiatan.map((item) => (
                <div
                  key={item.id}
                  className="bg-dark-50/80 rounded-none md:rounded-2xl border-b md:border border-dark-200/50 overflow-hidden group hover:border-primary/30 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative h-52 sm:h-48 bg-dark-200/30">
                    {item.gambar ? (
                      <img
                        src={getImageUrl(item.gambar)}
                        alt={item.judul}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Image className="text-text-muted" size={40} />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 bg-primary/80 text-white text-xs font-medium rounded-full">
                        {kategoriLabel[item.kategori] || item.kategori}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 md:p-5">
                    <h3 className="text-lg font-bold text-text-heading mb-2 line-clamp-1">
                      {item.judul}
                    </h3>
                    {item.deskripsi && (
                      <p className="text-text-body text-sm mb-3 line-clamp-2">{item.deskripsi}</p>
                    )}
                    <div className="flex flex-wrap gap-3 text-xs text-text-muted mb-4">
                      {item.tanggal && (
                        <span className="flex items-center space-x-1">
                          <Calendar size={12} />
                          <span>{new Date(item.tanggal).toLocaleDateString('id-ID')}</span>
                        </span>
                      )}
                      {item.lokasi && (
                        <span className="flex items-center space-x-1">
                          <MapPin size={12} />
                          <span>{item.lokasi}</span>
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setDetailItem(item)}
                        className="flex-1 flex items-center justify-center space-x-1 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-xl hover:bg-blue-500/20 transition-all text-sm font-medium"
                      >
                        <Eye size={14} />
                        <span>Lihat</span>
                      </button>
                      <button
                        onClick={() => openEditModal(item)}
                        className="flex-1 flex items-center justify-center space-x-1 py-2 bg-primary/10 text-primary border border-primary/30 rounded-xl hover:bg-primary/20 transition-all text-sm font-medium"
                      >
                        <Edit3 size={14} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(item.id)}
                        className="flex-1 flex items-center justify-center space-x-1 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/20 transition-all text-sm font-medium"
                      >
                        <Trash2 size={14} />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center mt-8 space-x-2 px-4 md:px-0">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-dark-200/50 text-text-body hover:text-primary hover:border-primary/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25'
                        : 'border border-dark-200/50 text-text-body hover:text-primary hover:border-primary/50'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-dark-200/50 text-text-body hover:text-primary hover:border-primary/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}

            {/* Info total */}
            {kegiatan.length > 0 && (
              <div className="text-center mt-4">
                <p className="text-text-muted text-sm">
                  Menampilkan {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
                  {Math.min(currentPage * ITEMS_PER_PAGE, kegiatan.length)} dari {kegiatan.length}{' '}
                  kegiatan
                </p>
              </div>
            )}
          </>
        )}

        {/* Divider */}
        <div className="border-t border-dark-200/50 mx-4 md:mx-0 my-8"></div>

        {/* ==================== PROYEK SECTION ==================== */}
        <div id="proyek-section" className="mb-12">
          <div className="flex items-center justify-between mb-6 md:mb-8 px-4 md:px-0">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Briefcase size={20} className="text-primary" />
                <h2 className="text-2xl font-bold text-text-heading">Kelola Proyek</h2>
              </div>
              <p className="text-text-body text-sm mt-1">
                Tambah, edit, atau hapus proyek kajian SIA & SROI
              </p>
            </div>
            <button
              onClick={openCreateProyekModal}
              className="flex items-center space-x-2 px-4 py-2.5 sm:px-5 sm:py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 text-sm sm:text-base"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Tambah Proyek</span>
              <span className="sm:hidden">Tambah</span>
            </button>
          </div>

          {proyekLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : proyek.length === 0 ? (
            <div className="text-center py-12 px-4 bg-dark-50/80 rounded-none md:rounded-2xl border-b md:border border-dark-200/50">
              <Briefcase className="mx-auto text-text-muted mb-4" size={48} />
              <p className="text-text-body text-lg">Belum ada proyek</p>
              <p className="text-text-muted text-sm mt-1">
                Klik tombol &quot;Tambah Proyek&quot; untuk menambahkan
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 md:gap-6">
                {paginatedProyek.map((item) => (
                  <div
                    key={item.id}
                    className="bg-dark-50/80 rounded-none md:rounded-2xl border-b md:border border-dark-200/50 overflow-hidden group hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="relative h-52 sm:h-48 bg-dark-200/30">
                      {item.gambar ? (
                        <img
                          src={getImageUrl(item.gambar)}
                          alt={item.judul}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Briefcase className="text-text-muted" size={40} />
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <span className="px-3 py-1 bg-secondary/80 text-white text-xs font-medium rounded-full">
                          {proyekKategoriLabel[item.kategori] || item.kategori}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 md:p-5">
                      <h3 className="text-lg font-bold text-text-heading mb-2 line-clamp-1">
                        {item.judul}
                      </h3>
                      {item.deskripsi && (
                        <p className="text-text-body text-sm mb-3 line-clamp-2">{item.deskripsi}</p>
                      )}
                      {Array.isArray(item.tags) && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {item.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full border border-primary/20"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <button
                          onClick={() => setDetailProyek(item)}
                          className="flex-1 flex items-center justify-center space-x-1 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-xl hover:bg-blue-500/20 transition-all text-sm font-medium"
                        >
                          <Eye size={14} />
                          <span>Lihat</span>
                        </button>
                        <button
                          onClick={() => openEditProyekModal(item)}
                          className="flex-1 flex items-center justify-center space-x-1 py-2 bg-primary/10 text-primary border border-primary/30 rounded-xl hover:bg-primary/20 transition-all text-sm font-medium"
                        >
                          <Edit3 size={14} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => setDeleteProyekConfirm(item.id)}
                          className="flex-1 flex items-center justify-center space-x-1 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/20 transition-all text-sm font-medium"
                        >
                          <Trash2 size={14} />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {proyekTotalPages > 1 && (
                <div className="flex items-center justify-center mt-8 space-x-2 px-4 md:px-0">
                  <button
                    onClick={() => goToProyekPage(proyekCurrentPage - 1)}
                    disabled={proyekCurrentPage === 1}
                    className="p-2 rounded-lg border border-dark-200/50 text-text-body hover:text-primary hover:border-primary/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  {Array.from({ length: proyekTotalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => goToProyekPage(page)}
                      className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all ${
                        proyekCurrentPage === page
                          ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25'
                          : 'border border-dark-200/50 text-text-body hover:text-primary hover:border-primary/50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => goToProyekPage(proyekCurrentPage + 1)}
                    disabled={proyekCurrentPage === proyekTotalPages}
                    className="p-2 rounded-lg border border-dark-200/50 text-text-body hover:text-primary hover:border-primary/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}

              {proyek.length > 0 && (
                <div className="text-center mt-4">
                  <p className="text-text-muted text-sm">
                    Menampilkan {(proyekCurrentPage - 1) * PROYEK_PER_PAGE + 1}-
                    {Math.min(proyekCurrentPage * PROYEK_PER_PAGE, proyek.length)} dari{' '}
                    {proyek.length} proyek
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/80 backdrop-blur-sm">
          <div className="bg-dark-50 rounded-2xl border border-dark-200/50 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-dark-200/50">
              <h3 className="text-lg font-bold text-text-heading">
                {editingItem ? 'Edit Kegiatan' : 'Tambah Kegiatan Baru'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-text-muted hover:text-text-heading rounded-lg hover:bg-dark-200/30 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Judul */}
              <div>
                <label className="block text-sm font-medium text-text-heading mb-2">Judul *</label>
                <input
                  type="text"
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  className="w-full px-4 py-3 bg-dark/50 border border-dark-200/50 rounded-xl text-text-heading placeholder-text-muted focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Judul kegiatan"
                  required
                />
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-sm font-medium text-text-heading mb-2">
                  Deskripsi
                </label>
                <textarea
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-dark/50 border border-dark-200/50 rounded-xl text-text-heading placeholder-text-muted focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  placeholder="Deskripsi kegiatan..."
                />
              </div>

              {/* Tanggal & Lokasi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-heading mb-2">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    value={formData.tanggal}
                    onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                    className="w-full px-4 py-3 bg-dark/50 border border-dark-200/50 rounded-xl text-text-heading focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-heading mb-2">Lokasi</label>
                  <input
                    type="text"
                    value={formData.lokasi}
                    onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                    className="w-full px-4 py-3 bg-dark/50 border border-dark-200/50 rounded-xl text-text-heading placeholder-text-muted focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="Lokasi"
                  />
                </div>
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-sm font-medium text-text-heading mb-2">Kategori</label>
                <select
                  value={formData.kategori}
                  onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                  className="w-full px-4 py-3 bg-dark/50 border border-dark-200/50 rounded-xl text-text-heading focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                >
                  <option value="kegiatan">Kegiatan</option>
                  <option value="sia">Social Impact Assessment</option>
                  <option value="sroi">Social Return on Investment</option>
                </select>
              </div>

              {/* Upload Gambar */}
              <div>
                <label className="block text-sm font-medium text-text-heading mb-2">Gambar</label>
                <div className="border-2 border-dashed border-dark-200/50 rounded-xl p-4 text-center hover:border-primary/50 transition-all">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null)
                          setImagePreview(null)
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block py-6">
                      <Upload className="mx-auto text-text-muted mb-2" size={32} />
                      <p className="text-text-body text-sm">Klik untuk upload gambar</p>
                      <p className="text-text-muted text-xs mt-1">JPG, PNG, GIF, WebP (max 5MB)</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Submit */}
              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 px-6 border border-dark-200/50 text-text-body rounded-xl hover:bg-dark-200/20 transition-all font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all font-semibold disabled:opacity-50 flex items-center justify-center"
                >
                  {formLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : editingItem ? (
                    'Simpan Perubahan'
                  ) : (
                    'Tambah Kegiatan'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/80 backdrop-blur-sm">
          <div className="bg-dark-50 rounded-2xl border border-dark-200/50 p-6 w-full max-w-sm">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-red-500/10 rounded-2xl mb-4">
                <AlertCircle className="text-red-400" size={28} />
              </div>
              <h3 className="text-lg font-bold text-text-heading mb-2">Hapus Kegiatan?</h3>
              <p className="text-text-body text-sm mb-6">
                Data yang dihapus tidak dapat dikembalikan.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-3 border border-dark-200/50 text-text-body rounded-xl hover:bg-dark-200/20 transition-all font-medium"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all font-semibold"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail View Modal */}
      {detailItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/85 backdrop-blur-sm"
          onClick={() => setDetailItem(null)}
        >
          <div
            className="relative bg-dark-50 rounded-2xl border border-dark-200/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setDetailItem(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-dark/70 backdrop-blur-sm text-white rounded-full hover:bg-dark transition-all"
            >
              <X size={20} />
            </button>

            {/* Image */}
            {detailItem.gambar ? (
              <img
                src={getImageUrl(detailItem.gambar)}
                alt={detailItem.judul}
                className="w-full h-64 md:h-80 object-cover rounded-t-2xl"
              />
            ) : (
              <div className="w-full h-64 md:h-80 bg-dark-200/30 flex items-center justify-center rounded-t-2xl">
                <Image className="text-text-muted" size={64} />
              </div>
            )}

            {/* Content */}
            <div className="p-6 md:p-8">
              {/* Kategori badge */}
              <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-xs font-medium rounded-full mb-3">
                {kategoriLabel[detailItem.kategori] || detailItem.kategori}
              </span>

              <h2 className="text-2xl font-bold text-text-heading mb-4">{detailItem.judul}</h2>

              <div className="flex flex-wrap gap-3 mb-5">
                {detailItem.tanggal && (
                  <div className="flex items-center space-x-2 text-text-body bg-dark/30 px-3 py-2 rounded-lg">
                    <Calendar size={16} className="text-primary" />
                    <span className="text-sm">{formatDate(detailItem.tanggal)}</span>
                  </div>
                )}
                {detailItem.lokasi && (
                  <div className="flex items-center space-x-2 text-text-body bg-dark/30 px-3 py-2 rounded-lg">
                    <MapPin size={16} className="text-primary" />
                    <span className="text-sm">{detailItem.lokasi}</span>
                  </div>
                )}
              </div>

              {detailItem.deskripsi ? (
                <p className="text-text-body leading-relaxed whitespace-pre-line mb-6">
                  {detailItem.deskripsi}
                </p>
              ) : (
                <p className="text-text-muted italic mb-6">Belum ada deskripsi.</p>
              )}

              {/* Admin Actions */}
              <div className="flex space-x-3 pt-4 border-t border-dark-200/30">
                <button
                  onClick={() => {
                    setDetailItem(null)
                    openEditModal(detailItem)
                  }}
                  className="flex-1 flex items-center justify-center space-x-2 py-3 bg-primary/10 text-primary border border-primary/30 rounded-xl hover:bg-primary/20 transition-all font-medium"
                >
                  <Edit3 size={16} />
                  <span>Edit Kegiatan</span>
                </button>
                <button
                  onClick={() => {
                    setDetailItem(null)
                    setDeleteConfirm(detailItem.id)
                  }}
                  className="flex-1 flex items-center justify-center space-x-2 py-3 bg-red-500/10 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/20 transition-all font-medium"
                >
                  <Trash2 size={16} />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== PROYEK MODALS ==================== */}

      {/* Proyek Create/Edit Modal */}
      {showProyekModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/80 backdrop-blur-sm">
          <div className="bg-dark-50 rounded-2xl border border-dark-200/50 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-dark-200/50">
              <h3 className="text-lg font-bold text-text-heading">
                {editingProyek ? 'Edit Proyek' : 'Tambah Proyek Baru'}
              </h3>
              <button
                onClick={() => setShowProyekModal(false)}
                className="p-2 text-text-muted hover:text-text-heading rounded-lg hover:bg-dark-200/30 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleProyekSubmit} className="p-6 space-y-5">
              {/* Judul */}
              <div>
                <label className="block text-sm font-medium text-text-heading mb-2">
                  Judul Proyek *
                </label>
                <input
                  type="text"
                  value={proyekFormData.judul}
                  onChange={(e) => setProyekFormData({ ...proyekFormData, judul: e.target.value })}
                  className="w-full px-4 py-3 bg-dark/50 border border-dark-200/50 rounded-xl text-text-heading placeholder-text-muted focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Judul proyek kajian"
                  required
                />
              </div>

              {/* Deskripsi Singkat */}
              <div>
                <label className="block text-sm font-medium text-text-heading mb-2">
                  Deskripsi Singkat
                </label>
                <textarea
                  value={proyekFormData.deskripsi}
                  onChange={(e) =>
                    setProyekFormData({ ...proyekFormData, deskripsi: e.target.value })
                  }
                  rows={2}
                  className="w-full px-4 py-3 bg-dark/50 border border-dark-200/50 rounded-xl text-text-heading placeholder-text-muted focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  placeholder="Deskripsi singkat yang tampil di card..."
                />
              </div>

              {/* Detail Lengkap */}
              <div>
                <label className="block text-sm font-medium text-text-heading mb-2">
                  Detail Lengkap
                </label>
                <textarea
                  value={proyekFormData.detail}
                  onChange={(e) => setProyekFormData({ ...proyekFormData, detail: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 bg-dark/50 border border-dark-200/50 rounded-xl text-text-heading placeholder-text-muted focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  placeholder="Penjelasan detail proyek yang akan tampil saat user mengklik..."
                />
              </div>

              {/* Tags & Kategori */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-heading mb-2">Tags</label>
                  <input
                    type="text"
                    value={proyekFormData.tags}
                    onChange={(e) => setProyekFormData({ ...proyekFormData, tags: e.target.value })}
                    className="w-full px-4 py-3 bg-dark/50 border border-dark-200/50 rounded-xl text-text-heading placeholder-text-muted focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="Tag1, Tag2, Tag3"
                  />
                  <p className="text-text-muted text-xs mt-1">Pisahkan dengan koma</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-heading mb-2">
                    Kategori
                  </label>
                  <select
                    value={proyekFormData.kategori}
                    onChange={(e) =>
                      setProyekFormData({ ...proyekFormData, kategori: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-dark/50 border border-dark-200/50 rounded-xl text-text-heading focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    <option value="sia">SIA</option>
                    <option value="sroi">SROI</option>
                  </select>
                </div>
              </div>

              {/* Upload Gambar */}
              <div>
                <label className="block text-sm font-medium text-text-heading mb-2">
                  Gambar Cover
                </label>
                <div className="border-2 border-dashed border-dark-200/50 rounded-xl p-4 text-center hover:border-primary/50 transition-all">
                  {proyekImagePreview ? (
                    <div className="relative">
                      <img
                        src={proyekImagePreview}
                        alt="Preview"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setProyekImageFile(null)
                          setProyekImagePreview(null)
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block py-6">
                      <Upload className="mx-auto text-text-muted mb-2" size={32} />
                      <p className="text-text-body text-sm">Klik untuk upload gambar</p>
                      <p className="text-text-muted text-xs mt-1">JPG, PNG, GIF, WebP (max 5MB)</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProyekImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Submit */}
              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowProyekModal(false)}
                  className="flex-1 py-3 px-6 border border-dark-200/50 text-text-body rounded-xl hover:bg-dark-200/20 transition-all font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={proyekFormLoading}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all font-semibold disabled:opacity-50 flex items-center justify-center"
                >
                  {proyekFormLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : editingProyek ? (
                    'Simpan Perubahan'
                  ) : (
                    'Tambah Proyek'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Proyek Detail Modal */}
      {detailProyek && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/85 backdrop-blur-sm"
          onClick={() => setDetailProyek(null)}
        >
          <div
            className="relative bg-dark-50 rounded-2xl border border-dark-200/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setDetailProyek(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-dark/70 backdrop-blur-sm text-white rounded-full hover:bg-dark transition-all"
            >
              <X size={20} />
            </button>

            {detailProyek.gambar ? (
              <img
                src={getImageUrl(detailProyek.gambar)}
                alt={detailProyek.judul}
                className="w-full h-64 md:h-80 object-cover rounded-t-2xl"
              />
            ) : (
              <div className="w-full h-64 md:h-80 bg-dark-200/30 flex items-center justify-center rounded-t-2xl">
                <Briefcase className="text-text-muted" size={64} />
              </div>
            )}

            <div className="p-6 md:p-8">
              <span className="inline-block px-3 py-1 bg-secondary/20 text-secondary text-xs font-medium rounded-full mb-3">
                {proyekKategoriLabel[detailProyek.kategori] || detailProyek.kategori}
              </span>

              <h2 className="text-2xl font-bold text-text-heading mb-4">{detailProyek.judul}</h2>

              {Array.isArray(detailProyek.tags) && detailProyek.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {detailProyek.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full border border-primary/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {detailProyek.deskripsi && (
                <p className="text-text-body leading-relaxed mb-4">{detailProyek.deskripsi}</p>
              )}

              {detailProyek.detail ? (
                <div className="bg-dark/30 rounded-xl p-4 mb-6">
                  <h4 className="text-sm font-semibold text-text-heading mb-2">Detail Proyek</h4>
                  <p className="text-text-body leading-relaxed whitespace-pre-line">
                    {detailProyek.detail}
                  </p>
                </div>
              ) : (
                <p className="text-text-muted italic mb-6">Belum ada detail proyek.</p>
              )}

              <div className="flex space-x-3 pt-4 border-t border-dark-200/30">
                <button
                  onClick={() => {
                    setDetailProyek(null)
                    openEditProyekModal(detailProyek)
                  }}
                  className="flex-1 flex items-center justify-center space-x-2 py-3 bg-primary/10 text-primary border border-primary/30 rounded-xl hover:bg-primary/20 transition-all font-medium"
                >
                  <Edit3 size={16} />
                  <span>Edit Proyek</span>
                </button>
                <button
                  onClick={() => {
                    setDetailProyek(null)
                    setDeleteProyekConfirm(detailProyek.id)
                  }}
                  className="flex-1 flex items-center justify-center space-x-2 py-3 bg-red-500/10 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/20 transition-all font-medium"
                >
                  <Trash2 size={16} />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Proyek Delete Confirmation Modal */}
      {deleteProyekConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/80 backdrop-blur-sm">
          <div className="bg-dark-50 rounded-2xl border border-dark-200/50 p-6 w-full max-w-sm">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-red-500/10 rounded-2xl mb-4">
                <AlertCircle className="text-red-400" size={28} />
              </div>
              <h3 className="text-lg font-bold text-text-heading mb-2">Hapus Proyek?</h3>
              <p className="text-text-body text-sm mb-6">
                Data yang dihapus tidak dapat dikembalikan.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setDeleteProyekConfirm(null)}
                  className="flex-1 py-3 border border-dark-200/50 text-text-body rounded-xl hover:bg-dark-200/20 transition-all font-medium"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleDeleteProyek(deleteProyekConfirm)}
                  className="flex-1 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all font-semibold"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== HERO BERANDA MODALS ==================== */}

      {/* Hero Create/Edit Modal */}
      {showHeroModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/80 backdrop-blur-sm">
          <div className="bg-dark-50 rounded-2xl border border-dark-200/50 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-dark-200/50">
              <h3 className="text-lg font-bold text-text-heading">
                {editingHero ? 'Edit Hero Image' : 'Tambah Hero Image'}
              </h3>
              <button
                onClick={() => setShowHeroModal(false)}
                className="p-2 text-text-muted hover:text-text-heading rounded-lg hover:bg-dark-200/30 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleHeroSubmit} className="p-6 space-y-5">
              {/* Judul */}
              <div>
                <label className="block text-sm font-medium text-text-heading mb-2">
                  Judul (opsional)
                </label>
                <input
                  type="text"
                  value={heroFormData.judul}
                  onChange={(e) => setHeroFormData({ ...heroFormData, judul: e.target.value })}
                  className="w-full px-4 py-3 bg-dark/50 border border-dark-200/50 rounded-xl text-text-heading placeholder-text-muted focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Judul untuk alt text gambar"
                />
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-sm font-medium text-text-heading mb-2">
                  Deskripsi (opsional)
                </label>
                <textarea
                  value={heroFormData.deskripsi}
                  onChange={(e) => setHeroFormData({ ...heroFormData, deskripsi: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 bg-dark/50 border border-dark-200/50 rounded-xl text-text-heading placeholder-text-muted focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  placeholder="Keterangan gambar..."
                />
              </div>

              {/* Urutan */}
              <div>
                <label className="block text-sm font-medium text-text-heading mb-2">
                  Urutan Tampil
                </label>
                <input
                  type="number"
                  min="0"
                  value={heroFormData.urutan}
                  onChange={(e) =>
                    setHeroFormData({ ...heroFormData, urutan: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-4 py-3 bg-dark/50 border border-dark-200/50 rounded-xl text-text-heading focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <p className="text-text-muted text-xs mt-1">Angka lebih kecil tampil lebih dulu</p>
              </div>

              {/* Upload Gambar */}
              <div>
                <label className="block text-sm font-medium text-text-heading mb-2">
                  Gambar {!editingHero && '*'}
                </label>
                <div className="border-2 border-dashed border-dark-200/50 rounded-xl p-4 text-center hover:border-primary/50 transition-all">
                  {heroImagePreview ? (
                    <div className="relative">
                      <img
                        src={heroImagePreview}
                        alt="Preview"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setHeroImageFile(null)
                          setHeroImagePreview(null)
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block py-6">
                      <Upload className="mx-auto text-text-muted mb-2" size={32} />
                      <p className="text-text-body text-sm">Klik untuk upload gambar</p>
                      <p className="text-text-muted text-xs mt-1">
                        JPG, PNG, GIF, WebP (max 5MB) - Rasio 4:3 disarankan
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleHeroImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Submit */}
              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowHeroModal(false)}
                  className="flex-1 py-3 px-6 border border-dark-200/50 text-text-body rounded-xl hover:bg-dark-200/20 transition-all font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={heroFormLoading || (!editingHero && !heroImageFile)}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all font-semibold disabled:opacity-50 flex items-center justify-center"
                >
                  {heroFormLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : editingHero ? (
                    'Simpan Perubahan'
                  ) : (
                    'Tambah Gambar'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hero Delete Confirmation Modal */}
      {deleteHeroConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/80 backdrop-blur-sm">
          <div className="bg-dark-50 rounded-2xl border border-dark-200/50 p-6 w-full max-w-sm">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-red-500/10 rounded-2xl mb-4">
                <AlertCircle className="text-red-400" size={28} />
              </div>
              <h3 className="text-lg font-bold text-text-heading mb-2">Hapus Hero Image?</h3>
              <p className="text-text-body text-sm mb-6">
                Gambar yang dihapus tidak dapat dikembalikan.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setDeleteHeroConfirm(null)}
                  className="flex-1 py-3 border border-dark-200/50 text-text-body rounded-xl hover:bg-dark-200/20 transition-all font-medium"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleDeleteHero(deleteHeroConfirm)}
                  className="flex-1 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all font-semibold"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
