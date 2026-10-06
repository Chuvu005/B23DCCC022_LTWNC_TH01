// ==========================================
// BUỔI 3: REDUX TOOLKIT - ASSIGNMENTS SLICE & ASYNC THUNKS
// Cấu trúc Feature-based, tạo Thunk với createAsyncThunk và quản lý trạng thái có kiểu
// ==========================================

import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type {
  Assignment,
  CreateAssignmentInput,
  FilterStatus,
  SortOption,
} from '../../types/assignment';
import { assignmentsAPI } from './assignmentsAPI';

export interface AssignmentsState {
  items: Assignment[];
  filter: FilterStatus;
  searchQuery: string;
  selectedSubject: string;
  sortBy: SortOption;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  actionStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  notification: string | null;
}

const initialState: AssignmentsState = {
  items: [],
  filter: 'all',
  searchQuery: '',
  selectedSubject: 'all',
  sortBy: 'dueDateAsc',
  status: 'idle',
  actionStatus: 'idle',
  error: null,
  notification: null,
};

// -------------------------------------------------------------------
// ASYNC THUNKS (createAsyncThunk)
// -------------------------------------------------------------------

/**
 * Thunk lấy danh sách bài tập ban đầu từ API giả lập (Yêu cầu 7)
 */
export const fetchAssignments = createAsyncThunk<
  Assignment[],
  void,
  { rejectValue: string }
>('assignments/fetchAssignments', async (_, { rejectWithValue }) => {
  try {
    const response = await assignmentsAPI.fetchAssignments();
    return response.data;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Lỗi khi tải dữ liệu từ máy chủ';
    return rejectWithValue(message);
  }
});

/**
 * Thunk thêm bài tập mới (Yêu cầu 2)
 */
export const addAssignment = createAsyncThunk<
  Assignment,
  CreateAssignmentInput,
  { rejectValue: string }
>('assignments/addAssignment', async (input, { rejectWithValue }) => {
  try {
    const response = await assignmentsAPI.createAssignment(input);
    return response.data;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Lỗi khi thêm bài tập';
    return rejectWithValue(message);
  }
});

/**
 * Thunk đánh dấu hoàn thành / bỏ đánh dấu (Yêu cầu 3)
 */
export const toggleAssignment = createAsyncThunk<
  Assignment,
  string,
  { rejectValue: string }
>('assignments/toggleAssignment', async (id, { rejectWithValue }) => {
  try {
    const response = await assignmentsAPI.toggleAssignment(id);
    return response.data;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Lỗi khi cập nhật trạng thái';
    return rejectWithValue(message);
  }
});

/**
 * Thunk xoá bài tập (Yêu cầu 4)
 */
export const deleteAssignment = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('assignments/deleteAssignment', async (id, { rejectWithValue }) => {
  try {
    const response = await assignmentsAPI.deleteAssignment(id);
    return response.data;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Lỗi khi xoá bài tập';
    return rejectWithValue(message);
  }
});

/**
 * Thunk khôi phục dữ liệu mẫu ban đầu
 */
export const resetToMockData = createAsyncThunk<
  Assignment[],
  void,
  { rejectValue: string }
>('assignments/resetToMockData', async (_, { rejectWithValue }) => {
  try {
    const response = await assignmentsAPI.resetToMockData();
    return response.data;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Lỗi khi khôi phục dữ liệu mẫu';
    return rejectWithValue(message);
  }
});

// -------------------------------------------------------------------
// ASSIGNMENTS SLICE
// -------------------------------------------------------------------

export const assignmentsSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    // Thay đổi bộ lọc trạng thái (Yêu cầu 5)
    setFilter: (state, action: PayloadAction<FilterStatus>) => {
      state.filter = action.payload;
    },
    // Thay đổi từ khoá tìm kiếm
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    // Lọc theo môn học
    setSelectedSubject: (state, action: PayloadAction<string>) => {
      state.selectedSubject = action.payload;
    },
    // Thay đổi tiêu chí sắp xếp
    setSortBy: (state, action: PayloadAction<SortOption>) => {
      state.sortBy = action.payload;
    },
    // Xoá thông báo tạm thời
    clearNotification: (state) => {
      state.notification = null;
    },
    // Xoá lỗi
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // 1. fetchAssignments
    builder
      .addCase(fetchAssignments.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Không thể tải danh sách bài tập';
      });

    // 2. addAssignment
    builder
      .addCase(addAssignment.pending, (state) => {
        state.actionStatus = 'loading';
      })
      .addCase(addAssignment.fulfilled, (state, action) => {
        state.actionStatus = 'succeeded';
        state.items.unshift(action.payload);
        state.notification = `Đã thêm thành công: "${action.payload.title}"`;
      })
      .addCase(addAssignment.rejected, (state, action) => {
        state.actionStatus = 'failed';
        state.error = action.payload ?? 'Không thể thêm bài tập';
      });

    // 3. toggleAssignment
    builder
      .addCase(toggleAssignment.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.notification = action.payload.completed
          ? `Đã hoàn thành: "${action.payload.title}"`
          : `Đã mở lại bài tập: "${action.payload.title}"`;
      })
      .addCase(toggleAssignment.rejected, (state, action) => {
        state.error = action.payload ?? 'Không thể đổi trạng thái bài tập';
      });

    // 4. deleteAssignment
    builder
      .addCase(deleteAssignment.fulfilled, (state, action) => {
        const deletedItem = state.items.find((item) => item.id === action.payload);
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.notification = deletedItem
          ? `Đã xoá bài tập: "${deletedItem.title}"`
          : 'Đã xoá bài tập';
      })
      .addCase(deleteAssignment.rejected, (state, action) => {
        state.error = action.payload ?? 'Không thể xoá bài tập';
      });

    // 5. resetToMockData
    builder
      .addCase(resetToMockData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(resetToMockData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.notification = 'Đã khôi phục dữ liệu bài tập mẫu ban đầu!';
      })
      .addCase(resetToMockData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Không thể khôi phục dữ liệu mẫu';
      });
  },
});

export const {
  setFilter,
  setSearchQuery,
  setSelectedSubject,
  setSortBy,
  clearNotification,
  clearError,
} = assignmentsSlice.actions;

export default assignmentsSlice.reducer;
