<template>
  <div class="products-management">
    <h2>Products Management</h2>
    <div class="add-product">
      <form @submit.prevent="isEditing ? handleEditProduct() : handleAddProduct()">
        <div class="form-row">
          <div class="form-group">
            <label for="productName">Name</label>
            <input type="text" v-model="productName" placeholder="Enter product name" required />
          </div>
          <div class="form-group">
            <label for="productDescription">Description</label>
            <input type="text" v-model="productDescription" placeholder="Enter product description" required />
          </div>
          <div class="form-group">
            <label for="productPrice">Price</label>
            <input type="number" v-model="productPrice" placeholder="Enter product price" required />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="productExpirationDate">Expiration Date</label>
            <input type="date" v-model="productExpirationDate" placeholder="Enter product expiration date" required />
          </div>
          <div class="form-group">
            <label for="productImage">Image URL</label>
            <input type="text" v-model="productImage" placeholder="Enter product image URL" />
          </div>
          <div class="form-group">
            <label for="productCategoryId">Category</label>
            <select v-model="productCategoryId" required>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>
        </div>
        <button type="submit">{{ isEditing ? 'Update' : 'Add' }}</button>
      </form>
    </div>
    <h2>Product List</h2>
    <div class="search-bar">
      <input type="text" v-model="searchQuery" placeholder="Search products by name" />
    </div>
    <div class="product-list">
      <div v-if="isLoading || isActionLoading" class="spinner-container">
        <div class="spinner"></div>
      </div>
      <ul v-else-if="paginatedProducts && paginatedProducts.length > 0">
        <li v-for="product in paginatedProducts" :key="product.id">
          <div>
            <strong>Name:</strong> {{ product.name }}
          </div>
          <div>
            <strong>Description:</strong> {{ product.description }}
          </div>
          <div>
            <strong>Price:</strong> R$ {{ product.price }}
          </div>
          <div>
            <strong>Expiration Date:</strong> {{ product.expiration_date }}
          </div>
          <div>
            <strong>Image URL:</strong> {{ product.image || 'N/A' }}
          </div>
          <div>
            <strong>Category:</strong> {{ getCategoryName(product.category_id) }}
          </div>
          <div class="button-group">
            <button class="delete-button" @click="deleteProduct(product.id)">Delete</button>
            <button class="edit-button" @click="startEditing(product)">Edit</button>
          </div>
        </li>
      </ul>
      <div v-else>No products registered.</div>
      <div class="pagination-controls" v-if="totalPages > 1">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">Previous</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">Next</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import apiClient from '../axios';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  expiration_date: string;
  image: string | null;
  category_id: number;
}

interface Category {
  id: number;
  name: string;
}

export default defineComponent({
  name: 'ProductsPage',
  setup() {
    const products = ref<Product[]>([]);
    const categories = ref<Category[]>([]);
    const productName = ref('');
    const productDescription = ref('');
    const productPrice = ref(0);
    const productExpirationDate = ref('');
    const productImage = ref<string | null>('');
    const productCategoryId = ref(0);
    const searchQuery = ref('');
    const isLoading = ref(false);
    const isActionLoading = ref(false);
    const isEditing = ref(false);
    const productIdBeingEdited = ref<number | null>(null);
    const currentPage = ref(1);
    const itemsPerPage = ref(4);

    const fetchProducts = async () => {
      isLoading.value = true;
      try {
        const response = await apiClient.get('/products', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.data.status) {
          products.value = response.data.data.data || [];
        } else {
          console.error('Error fetching products:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        isLoading.value = false;
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await apiClient.get('/categories', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.data.status) {
          categories.value = response.data.data.data || [];
        } else {
          console.error('Error fetching categories:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const filteredProducts = computed(() => {
      return products.value.filter(product => 
        product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });

    const paginatedProducts = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return filteredProducts.value.slice(start, end);
    });

    const totalPages = computed(() => {
      return Math.ceil(filteredProducts.value.length / itemsPerPage.value);
    });

    const changePage = (page: number) => {
      if (page > 0 && page <= totalPages.value) {
        currentPage.value = page;
      }
    };

    const handleAddProduct = async () => {
      isActionLoading.value = true;
      try {
        const response = await apiClient.post('/products', {
          name: productName.value,
          description: productDescription.value,
          price: productPrice.value,
          expiration_date: productExpirationDate.value,
          image: productImage.value,
          category_id: productCategoryId.value,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.data.status) {
          fetchProducts(); // Fetch products again to update the list
          resetForm();
        } else {
          console.error('Error adding product:', response.data.message);
        }
      } catch (error) {
        console.error('Error adding product:', error);
      } finally {
        isActionLoading.value = false;
      }
    };

    const handleEditProduct = async () => {
      if (!productIdBeingEdited.value) return;

      isActionLoading.value = true;
      try {
        const response = await apiClient.put(`/products/${productIdBeingEdited.value}`, {
          name: productName.value,
          description: productDescription.value,
          price: productPrice.value,
          expiration_date: productExpirationDate.value,
          image: productImage.value,
          category_id: productCategoryId.value,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.data.status) {
          fetchProducts(); // Fetch products again to update the list
          cancelEditing();
        } else {
          console.error('Error updating product:', response.data.message);
        }
      } catch (error) {
        console.error('Error updating product:', error);
      } finally {
        isActionLoading.value = false;
      }
    };

    const startEditing = (product: Product) => {
      productName.value = product.name;
      productDescription.value = product.description;
      productPrice.value = product.price;
      productExpirationDate.value = product.expiration_date;
      productImage.value = product.image;
      productCategoryId.value = product.category_id;
      isEditing.value = true;
      productIdBeingEdited.value = product.id;
    };

    const cancelEditing = () => {
      resetForm();
      isEditing.value = false;
      productIdBeingEdited.value = null;
    };

    const deleteProduct = async (id: number) => {
      isActionLoading.value = true;
      try {
        const response = await apiClient.delete(`/products/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.data.status) {
          fetchProducts(); // Fetch products again to update the list
        } else {
          console.error('Error deleting product:', response.data.message);
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      } finally {
        isActionLoading.value = false;
      }
    };

    const resetForm = () => {
      productName.value = '';
      productDescription.value = '';
      productPrice.value = 0;
      productExpirationDate.value = '';
      productImage.value = '';
      productCategoryId.value = 0;
    };

    const getCategoryName = (categoryId: number) => {
      const category = categories.value.find((cat: Category) => cat.id === categoryId);
      return category ? category.name : 'N/A';
    };

    onMounted(() => {
      fetchProducts();
      fetchCategories();
    });

    return {
      products,
      categories,
      productName,
      productDescription,
      productPrice,
      productExpirationDate,
      productImage,
      productCategoryId,
      searchQuery,
      isLoading,
      isActionLoading,
      isEditing,
      currentPage,
      itemsPerPage,
      paginatedProducts,
      totalPages,
      handleAddProduct,
      handleEditProduct,
      deleteProduct,
      startEditing,
      cancelEditing,
      getCategoryName,
      changePage,
    };
  },
});
</script>

<style scoped>
html, body {
  height: 100%;
  margin: 0;
}

.products-management {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(to right, #f06, #f90);
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
  color: white;
  padding: 20px;
}

.products-management h1 {
  font-size: 36px;
}

.products-management h2 {
  margin-top: 20px;
}

.add-product {
  background-color: #333;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  text-align: center;
  margin-bottom: 20px;
}

.add-product .form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  width: 30%;
  padding: 0 10px;
}

.add-product .form-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.add-product input,
.add-product select {
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  border: none;
  border-radius: 5px;
  box-sizing: border-box;
}

.add-product button {
  padding: 10px 20px;
  background-color: #42b983;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  width: 100%;
  margin-top: 10px;
}

.add-product button:hover {
  background-color: #2c8e6b;
}

.search-bar {
  width: 80%;
  margin-bottom: 20px;
}

.search-bar input {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  box-sizing: border-box;
}

.product-list {
  background-color: #333;
  padding: 20px;
  border-radius: 10px;
  min-height: 120px;
  width: 80%;
  text-align: center;
  position: relative;
}

.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: transparent;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #fff;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.product-list ul {
  list-style: none;
  padding: 0;
}

.product-list li {
  display: flex;
  flex-direction: column;
  background-color: #444;
  padding: 10px;
  margin: 5px 0;
  border-radius: 5px;
}

.product-list li .button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.product-list .delete-button {
  padding: 5px 10px;
  background-color: #d9534f;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
}

.product-list .delete-button:hover {
  background-color: #c9302c;
}

.product-list .edit-button {
  padding: 5px 10px;
  background-color: #f0ad4e;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
}

.product-list .edit-button:hover {
  background-color: #ec971f;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}

.pagination-controls button {
  padding: 5px 10px;
  background-color: #42b983;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
}

.pagination-controls button:disabled {
  background-color: #888;
}

.pagination-controls span {
  font-weight: bold;
}

/* Adicionando responsividade */
@media (max-width: 768px) {
  .products-management {
    height: auto;
    padding: 20px;
  }

  .add-product input,
  .add-product select {
    width: 100%;
    margin: 0 0 10px;
    box-sizing: border-box;
  }

  .add-product {
    width: 90%;
    margin-bottom: 10px;
  }

  .product-list {
    width: 90%;
  }

  .pagination-controls {
    flex-direction: column;
    gap: 5px;
  }
}
</style>
