<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'

interface Asset {
  asset_id?: number
  asset_name: string
  stock_quantity: number
  category: 'Consumable' | 'Non-Consumable'
}

const API_URL = 'http://localhost:3000/assets'

const assets = ref<Asset[]>([])
const loading = ref(false)
const error = ref('')
const editingId = ref<number | null>(null)

const formData = reactive<Asset>({
  asset_name: '',
  stock_quantity: 0,
  category: 'Non-Consumable',
})

const fetchAssets = async () => {
  try {
    loading.value = true
    error.value = ''
    console.log('Fetching assets from:', API_URL)
    const response = await axios.get(API_URL)
    console.log('Response received:', response.data)
    assets.value = response.data
    console.log('Assets updated:', assets.value)
  } catch (err) {
    error.value = 'Failed to fetch assets'
    console.error('Fetch error:', err)
  } finally {
    loading.value = false
  }
}

const createAsset = async () => {
  if (!formData.asset_name || formData.stock_quantity < 0) {
    error.value = 'Please fill all fields correctly'
    return
  }
  try {
    await axios.post(API_URL, formData)
    formData.asset_name = ''
    formData.stock_quantity = 0
    formData.category = 'Non-Consumable'
    await fetchAssets()
  } catch (err) {
    error.value = 'Failed to create asset'
    console.error(err)
  }
}

const updateAsset = async () => {
  if (!editingId.value) return
  try {
    await axios.put(`${API_URL}/${editingId.value}`, formData)
    editingId.value = null
    formData.asset_name = ''
    formData.stock_quantity = 0
    formData.category = 'Non-Consumable'
    await fetchAssets()
  } catch (err) {
    error.value = 'Failed to update asset'
    console.error(err)
  }
}

const deleteAsset = async (id: number) => {
  if (!confirm('Delete this asset?')) return
  try {
    await axios.delete(`${API_URL}/${id}`)
    await fetchAssets()
  } catch (err) {
    error.value = 'Failed to delete asset'
    console.error(err)
  }
}

const editAsset = (asset: Asset) => {
  editingId.value = asset.asset_id || null
  formData.asset_name = asset.asset_name
  formData.stock_quantity = asset.stock_quantity
  formData.category = asset.category
}

const cancel = () => {
  editingId.value = null
  formData.asset_name = ''
  formData.stock_quantity = 0
  formData.category = 'Non-Consumable'
}

const handleSubmit = () => {
  if (editingId.value) {
    updateAsset()
  } else {
    createAsset()
  }
}

onMounted(() => {
  fetchAssets()
})
</script>

<template>
  <div class="container">
    <h1>Asset Management System</h1>
    
    <div v-if="error" class="error">{{ error }}</div>
    
    <div class="form-section">
      <h2>{{ editingId ? 'Edit Asset' : 'Add New Asset' }}</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>Asset Name:</label>
          <input v-model="formData.asset_name" type="text" placeholder="Enter asset name" required />
        </div>
        
        <div class="form-group">
          <label>Stock Quantity:</label>
          <input v-model.number="formData.stock_quantity" type="number" min="0" required />
        </div>
        
        <div class="form-group">
          <label>Category:</label>
          <select v-model="formData.category">
            <option value="Consumable">Consumable</option>
            <option value="Non-Consumable">Non-Consumable</option>
          </select>
        </div>
        
        <div class="button-group">
          <button type="submit" class="btn btn-primary">{{ editingId ? 'Update' : 'Create' }}</button>
          <button v-if="editingId" type="button" @click="cancel" class="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
    
    <div class="table-section">
      <h2>Assets</h2>
      <div v-if="loading" class="loading">Loading...</div>
      <table v-else class="assets-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Quantity</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="asset in assets" :key="asset.asset_id">
            <td>{{ asset.asset_id }}</td>
            <td>{{ asset.asset_name }}</td>
            <td>{{ asset.stock_quantity }}</td>
            <td>{{ asset.category }}</td>
            <td>
              <button @click="editAsset(asset)" class="btn btn-sm btn-info">Edit</button>
              <button @click="deleteAsset(asset.asset_id!)" class="btn btn-sm btn-danger">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="assets.length === 0 && !loading" class="empty">No assets found</div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  font-family: sans-serif;
}

h1 {
  text-align: center;
  color: #000000;
  margin-bottom: 2rem;
  font-weight: 700;
}

h2 {
  color: #000000;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

h2 {
  color: #555;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

.error {
  background-color: #fee;
  color: #c33;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.form-section {
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

input,
select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus,
select:focus {
  outline: none;
  border-color: #0066cc;
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}

.button-group {
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-primary {
  background-color: #0066cc;
  color: white;
}

.btn-primary:hover {
  background-color: #0052a3;
}

.btn-secondary {
  background-color: #666;
  color: white;
}

.btn-secondary:hover {
  background-color: #555;
}

.btn-info {
  background-color: #0099ff;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.btn-danger {
  background-color: #cc3333;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.btn-danger:hover {
  background-color: #aa2222;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
}

.table-section {
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
}

.assets-table {
  width: 100%;
  border-collapse: collapse;
}

.assets-table thead {
  background-color: #0066cc;
  color: white;
}

.assets-table th,
.assets-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
  color: #000000;
  background-color: #ffffff;
}

.assets-table tbody tr:hover {
  background-color: #f0f0f0;
}

.assets-table td:last-child {
  display: flex;
  gap: 0.5rem;
}

.loading,
.empty {
  text-align: center;
  padding: 2rem;
  color: #666;
}
</style>
