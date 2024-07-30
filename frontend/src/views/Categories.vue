<template>
  <div class="categories-management">
    <h2>Categories Management</h2>
    <div class="add-category">
      <form @submit.prevent="isEditing ? handleEditCategory() : handleAddCategory()">
        <input type="text" v-model="categoryName" placeholder="Enter category name" required />
        <button type="submit">{{ isEditing ? 'Update' : 'Add' }}</button>
      </form>
    </div>
    <h2>Category List</h2>
    <div class="search-category">
      <input type="text" v-model="searchQuery" placeholder="Search category by name" />
    </div>
    <div class="category-list">
      <div v-if="isLoading || isActionLoading" class="spinner-container">
        <div class="spinner"></div>
      </div>
      <ul v-else-if="paginatedCategories && paginatedCategories.length > 0">
        <li v-for="category in paginatedCategories" :key="category.id">
          <span>{{ category.name }}</span>
          <div class="button-group">
            <button class="delete-button" @click="deleteCategory(category.id)">Delete</button>
            <button class="edit-button" @click="startEditing(category)">Edit</button>
          </div>
        </li>
      </ul>
      <div v-else>No categories registered.</div>
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

interface Category {
  id: number;
  name: string;
}

export default defineComponent({
  name: 'CategoriesPage',
  setup() {
    const categories = ref<Category[]>([]);
    const categoryName = ref('');
    const searchQuery = ref('');
    const isLoading = ref(false);
    const isActionLoading = ref(false);
    const isEditing = ref(false);
    const categoryIdBeingEdited = ref<number | null>(null);
    const currentPage = ref(1);
    const itemsPerPage = ref(4);

    const fetchCategories = async () => {
      isLoading.value = true;
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
      } finally {
        isLoading.value = false;
      }
    };

    const filteredCategories = computed(() => {
      return categories.value.filter(category => 
        category.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });

    const paginatedCategories = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return filteredCategories.value.slice(start, end);
    });

    const totalPages = computed(() => {
      return Math.ceil(filteredCategories.value.length / itemsPerPage.value);
    });

    const changePage = (page: number) => {
      if (page > 0 && page <= totalPages.value) {
        currentPage.value = page;
      }
    };

    const handleAddCategory = async () => {
      isActionLoading.value = true;
      try {
        const response = await apiClient.post('/categories', { name: categoryName.value }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.data.status) {
          fetchCategories(); // Fetch categories again to update the list
          categoryName.value = '';
        } else {
          console.error('Error adding category:', response.data.message);
        }
      } catch (error) {
        console.error('Error adding category:', error);
      } finally {
        isActionLoading.value = false;
      }
    };

    const handleEditCategory = async () => {
      if (!categoryIdBeingEdited.value) return;

      isActionLoading.value = true;
      try {
        const response = await apiClient.put(`/categories/${categoryIdBeingEdited.value}`, { name: categoryName.value }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.data.status) {
          fetchCategories(); // Fetch categories again to update the list
          cancelEditing();
        } else {
          console.error('Error updating category:', response.data.message);
        }
      } catch (error) {
        console.error('Error updating category:', error);
      } finally {
        isActionLoading.value = false;
      }
    };

    const startEditing = (category: Category) => {
      categoryName.value = category.name;
      isEditing.value = true;
      categoryIdBeingEdited.value = category.id;
    };

    const cancelEditing = () => {
      categoryName.value = '';
      isEditing.value = false;
      categoryIdBeingEdited.value = null;
    };

    const deleteCategory = async (id: number) => {
      isActionLoading.value = true;
      try {
        const response = await apiClient.delete(`/categories/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.data.status) {
          fetchCategories(); // Fetch categories again to update the list
        } else {
          console.error('Error deleting category:', response.data.message);
        }
      } catch (error) {
        console.error('Error deleting category:', error);
      } finally {
        isActionLoading.value = false;
      }
    };

    onMounted(fetchCategories);

    return {
      categories,
      categoryName,
      searchQuery,
      isLoading,
      isActionLoading,
      isEditing,
      currentPage,
      itemsPerPage,
      paginatedCategories,
      totalPages,
      handleAddCategory,
      handleEditCategory,
      deleteCategory,
      startEditing,
      cancelEditing,
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

.categories-management {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(to right, #f06, #f90);
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
  color: white;
  padding: 20px;
}

.categories-management h1 {
  font-size: 36px;
}

.categories-management h2 {
  margin-top: 20px;
}

.add-category {
  background-color: #333;
  padding: 20px;
  border-radius: 10px;
  width: 60%;
  text-align: center;
  margin-bottom: 20px;
}

.add-category input {
  width: 80%;
  padding: 10px;
  margin-right: 10px;
  border: none;
  border-radius: 5px;
}

.add-category button {
  padding: 10px 20px;
  background-color: #42b983;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
}

.add-category button:hover {
  background-color: #2c8e6b;
}

.search-category {
  margin-bottom: 20px;
  width: 60%;
  text-align: center;
}

.search-category input {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
}

.category-list {
  background-color: #333;
  padding: 20px;
  border-radius: 10px;
  min-height: 120px;
  width: 60%;
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

.category-list ul {
  list-style: none;
  padding: 0;
}

.category-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #444;
  padding: 10px;
  margin: 5px 0;
  border-radius: 5px;
}

.category-list li .button-group {
  display: flex;
  gap: 10px;
}

.category-list .delete-button {
  padding: 5px 10px;
  background-color: #d9534f;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
}

.category-list .delete-button:hover {
  background-color: #c9302c;
}

.category-list .edit-button {
  padding: 5px 10px;
  background-color: #f0ad4e;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
}

.category-list .edit-button:hover {
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
  .categories-management {
    height: auto;
    padding: 20px;
  }

  .add-category input {
    width: 100%;
    margin: 0 0 10px;
    box-sizing: border-box;
  }

  .add-category {
    width: 90%;
    margin-bottom: 10px;
  }

  .category-list {
    width: 90%;
  }

  .pagination-controls {
    flex-direction: column;
    gap: 5px;
  }
}
</style>
