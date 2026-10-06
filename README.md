# 🎓 Student Deadline Tracker

> **Ứng dụng quản lý deadline bài tập cá nhân sinh viên**, được xây dựng dựa trên sự kết hợp toàn diện của 3 buổi học chuyên sâu: **TypeScript nâng cao**, **React Design Patterns**, và **Redux Toolkit + TypeScript**.

---

## 🌟 Tổng quan tính năng

1. **Hiển thị danh sách bài tập**: Đầy đủ thông tin môn học, tên bài tập, hạn nộp, độ ưu tiên (Thấp / Trung bình / Cao / Khẩn cấp), trạng thái hoàn thành.
2. **Thêm bài tập mới qua Form Modal**: Cho phép nhập môn học (có gợi ý nhanh), tên bài tập, chọn ngày hạn nộp và chọn mức độ ưu tiên trực quan.
3. **Đánh dấu hoàn thành / Bỏ đánh dấu**: Cập nhật trạng thái tức thì, gạch ngang tiêu đề và đổi màu trạng thái.
4. **Xoá bài tập**: Xác nhận an toàn và hiển thị Toast thông báo.
5. **Bộ lọc trạng thái linh hoạt**: Tất cả / Chưa hoàn thành / Quá hạn / Đã hoàn thành kèm số lượng (Badge count) thời gian thực.
6. **Tính toán thời hạn thông minh (Countdown)**: Tự động hiển thị `"Còn X ngày"`, `"Quá hạn Y ngày"`, `"Hôm nay đến hạn"` kèm hiệu ứng cảnh báo quá hạn.
7. **Khởi động với API giả lập (Mock API)**: Tải dữ liệu ban đầu qua `createAsyncThunk` với hiệu ứng Loading Skeleton và mạng trễ mô phỏng 750ms.
8. **Khôi phục dữ liệu mẫu (Reset Mock Data)**: Hỗ trợ người dùng dễ dàng khôi phục danh sách mẫu ban đầu để kiểm thử bất kỳ lúc nào.

---

## 🏗️ Cấu trúc đồ án & Kiến trúc kỹ thuật

### 📘 Buổi 1 — TypeScript Nâng Cao
- **Generic**:
  - `ApiResponse<T>`: Wrapper định dạng phản hồi chuẩn cho API giả lập ([generics.ts](file:///c:/Users/admin/Desktop/thuchanhweb/src/common/utils/generics.ts)).
  - `filterCollection<T>()`: Hàm lọc mảng generic với type safety.
  - `sortByProperty<T, K extends keyof T>()`: Sắp xếp mảng generic có ràng buộc thuộc tính `keyof T`.
  - `searchByFields<T>()`: Tìm kiếm chuỗi qua nhiều trường dữ liệu tùy biến.
- **Utility Types**:
  - `Omit<Assignment, 'id' | 'createdAt' | 'completed'>`: Tạo kiểu `CreateAssignmentInput` loại bỏ các trường do hệ thống tự sinh ([assignment.ts](file:///c:/Users/admin/Desktop/thuchanhweb/src/types/assignment.ts)).
  - `Pick<Assignment, 'id'>`: Tạo kiểu `ToggleAssignmentPayload` cho việc thay đổi trạng thái bài tập.
  - `Partial<...>` & `Pick<...>`: Dùng cho kiểu `UpdateAssignmentInput`.
  - `Record<Priority, PriorityMeta>`: Định cấu hình màu sắc, nhãn và trọng số cho từng mức ưu tiên ([priorityConfig.ts](file:///c:/Users/admin/Desktop/thuchanhweb/src/common/constants/priorityConfig.ts)).
  - `Readonly<Assignment>`: Đảm bảo tính bất biến (Immutability).
- **Type Guards (User-Defined)**:
  - `isAssignment(value: unknown): value is Assignment`: Xác thực đối tượng bài tập runtime.
  - `isPriority(value: unknown): value is Priority`: Thu hẹp kiểu sang `Priority`.
  - `isFilterStatus(value: unknown): value is FilterStatus`: Thu hẹp kiểu sang `FilterStatus`.
  - `isAssignmentOverdue(assignment: Assignment): boolean`: Thuật toán kiểm tra bài tập quá hạn ([typeGuards.ts](file:///c:/Users/admin/Desktop/thuchanhweb/src/common/utils/typeGuards.ts)).

### ⚛️ Buổi 2 — React Design Patterns
- **Compound Component Pattern**:
  - `<AssignmentCard>`: Tách biệt cấu trúc card thành các subcomponent liên kết thông qua React Context:
    - `<AssignmentCard.Header>`
    - `<AssignmentCard.SubjectBadge />`
    - `<AssignmentCard.PriorityBadge />`
    - `<AssignmentCard.Body>`
    - `<AssignmentCard.Title />`
    - `<AssignmentCard.Description />`
    - `<AssignmentCard.DueInfo />`
    - `<AssignmentCard.Actions>`
    - `<AssignmentCard.ToggleButton />`
    - `<AssignmentCard.DeleteButton />`
  - `<Modal>`: Hộp thoại dùng Compound Pattern với `<Modal.Header>`, `<Modal.Body>`, `<Modal.Footer>` ([Modal.tsx](file:///c:/Users/admin/Desktop/thuchanhweb/src/common/components/Modal/Modal.tsx)).
- **Higher-Order Component (HOC)**:
  - `withLoading<P>()`: Bọc ngoài danh sách bài tập để tự động hiển thị Skeleton loader mượt mà khi đang fetching dữ liệu ([withLoading.tsx](file:///c:/Users/admin/Desktop/thuchanhweb/src/common/components/HOC/withLoading.tsx)).
- **Custom Hook Nâng Cao**:
  - `useDeadlineCalculator(dueDate, completed)`: Tự động tính toán số ngày còn lại hoặc quá hạn, gán class cảnh báo tương ứng ([useDeadlineCalculator.ts](file:///c:/Users/admin/Desktop/thuchanhweb/src/common/hooks/useDeadlineCalculator.ts)).
  - `useAssignmentFilter(...)`: Quản lý tập trung logic lọc theo trạng thái, tìm kiếm, lọc môn học, sắp xếp và tính toán số liệu thống kê ([useAssignmentFilter.ts](file:///c:/Users/admin/Desktop/thuchanhweb/src/common/hooks/useAssignmentFilter.ts)).

### 🛡️ Buổi 3 — Redux Toolkit + TypeScript
- **Feature-based Structure**: Cấu trúc thư mục theo tính năng tại `src/features/assignments/` kết hợp `src/app/` ([assignmentsSlice.ts](file:///c:/Users/admin/Desktop/thuchanhweb/src/features/assignments/assignmentsSlice.ts)).
- **Typed Hooks**: Cung cấp `useAppDispatch` và `useAppSelector` chuẩn TypeScript thông qua `useDispatch.withTypes<AppDispatch>()` ([hooks.ts](file:///c:/Users/admin/Desktop/thuchanhweb/src/app/hooks.ts)).
- **createAsyncThunk**:
  - `fetchAssignments`: Lấy dữ liệu bài tập ban đầu từ mock API có network delay 750ms.
  - `addAssignment`: Thêm bài tập mới bất đồng bộ.
  - `toggleAssignment`: Đổi trạng thái hoàn thành bất đồng bộ.
  - `deleteAssignment`: Xoá bài tập bất đồng bộ.
  - `resetToMockData`: Khôi phục lại dữ liệu mẫu ban đầu.

---

## 🚀 Hướng dẫn chạy ứng dụng

```bash
# 1. Cài đặt các gói phụ thuộc
npm install

# 2. Khởi chạy máy chủ phát triển
npm run dev

# 3. Biên dịch kiểm tra TypeScript và Production Build
npm run build
```

Mở trình duyệt tại địa chỉ: **`http://localhost:5173/`**
