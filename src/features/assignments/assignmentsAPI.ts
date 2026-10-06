// ==========================================
// BUỔI 3: REDUX TOOLKIT - MOCK API SERVICE
// Yêu cầu chức năng 7: Lấy danh sách mẫu ban đầu từ API giả lập (có network latency)
// Sử dụng Generic ApiResponse<T> (Buổi 1)
// ==========================================

import type { Assignment, CreateAssignmentInput } from '../../types/assignment';
import type { ApiResponse } from '../../common/utils/generics';
import { getDateOffsetString } from '../../common/utils/dateUtils';
import { getLocalStorageItem, setLocalStorageItem } from '../../common/utils/generics';

const STORAGE_KEY = 'student_deadline_tracker_data_v1';

/**
 * Danh sách bài tập mẫu ban đầu
 * Sử dụng getDateOffsetString để dữ liệu luôn phản ánh đúng thực tế
 * (có bài quá hạn, có bài hôm nay, có bài sắp tới hạn, có bài hoàn thành)
 */
export function getInitialMockData(): Assignment[] {
  return [
    {
      id: 'task-001',
      subject: 'Lập trình Web',
      title: 'Xây dựng Website Quản lý Deadline Sinh viên với React & Redux Toolkit',
      dueDate: getDateOffsetString(1), // Ngày mai
      priority: 'urgent',
      completed: false,
      createdAt: new Date().toISOString(),
      description: 'Áp dụng TypeScript nâng cao, Compound Component, HOC và Redux Toolkit.',
    },
    {
      id: 'task-002',
      subject: 'Cấu trúc dữ liệu & Giải thuật',
      title: 'Cài đặt và Đánh giá hiệu năng Cây AVL & Red-Black Tree',
      dueDate: getDateOffsetString(4), // Còn 4 ngày
      priority: 'high',
      completed: false,
      createdAt: new Date().toISOString(),
      description: 'Viết mã nguồn minh họa các phép quay đơn, quay kép và vẽ đồ thị cân bằng cây.',
    },
    {
      id: 'task-003',
      subject: 'Cơ sở dữ liệu',
      title: 'Thiết kế Mô hình E-R & Chuẩn hóa BCNF cho Hệ thống Quản lý Bệnh viện',
      dueDate: getDateOffsetString(-2), // Đã quá hạn 2 ngày
      priority: 'high',
      completed: false,
      createdAt: new Date().toISOString(),
      description: 'Bao gồm sơ đồ quan hệ ERD, lược đồ quan hệ chuẩn 3NF/BCNF và script SQL DDL.',
    },
    {
      id: 'task-004',
      subject: 'Thiết kế giao diện UI/UX',
      title: 'Thiết kế High-Fidelity Prototype Ứng dụng Di động trên Figma',
      dueDate: getDateOffsetString(0), // Hôm nay đến hạn
      priority: 'urgent',
      completed: false,
      createdAt: new Date().toISOString(),
      description: 'Hoàn thiện Design System gồm Typography, Color Palette, Components và Micro-interactions.',
    },
    {
      id: 'task-005',
      subject: 'Trí tuệ nhân tạo (AI)',
      title: 'Huấn luyện Mô hình Phân lớp Ảnh với Convolutional Neural Networks (CNN)',
      dueDate: getDateOffsetString(7), // Còn 7 ngày
      priority: 'medium',
      completed: false,
      createdAt: new Date().toISOString(),
      description: 'Fine-tuning mô hình ResNet50 trên bộ dữ liệu ảnh y tế và báo cáo độ chính xác Precision/Recall.',
    },
    {
      id: 'task-006',
      subject: 'Mạng máy tính',
      title: 'Cấu hình Lab Mạng VLAN, Routing OSPF & NAT trên Cisco Packet Tracer',
      dueDate: getDateOffsetString(-4), // Đã hoàn thành (bài cũ)
      priority: 'low',
      completed: true,
      createdAt: new Date().toISOString(),
      description: 'Kiểm tra kết nối ping liên VLAN và đóng gói file .pkt kèm báo cáo ảnh chụp.',
    },
    {
      id: 'task-007',
      subject: 'Kiến trúc phần mềm',
      title: 'Thiết kế Kiến trúc Microservices cho Hệ thống Thương mại Điện tử',
      dueDate: getDateOffsetString(12), // Còn 12 ngày
      priority: 'low',
      completed: false,
      createdAt: new Date().toISOString(),
      description: 'Vẽ sơ đồ kiến trúc thành phần (C4 Model), API Gateway, Message Queue Kafka và Database per service.',
    },
  ];
}

/**
 * Hàm hỗ trợ giả lập độ trễ mạng (Network Latency)
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mock API Client
 */
export const assignmentsAPI = {
  /**
   * Yêu cầu chức năng 7: Lấy danh sách mẫu ban đầu từ API giả lập
   */
  async fetchAssignments(): Promise<ApiResponse<Assignment[]>> {
    await delay(750); // Giả lập độ trễ mạng 750ms

    // Kiểm tra xem đã có dữ liệu lưu trong LocalStorage chưa
    const stored = getLocalStorageItem<Assignment[] | null>(STORAGE_KEY, null);
    const data = stored && stored.length > 0 ? stored : getInitialMockData();

    // Đồng bộ lại vào LocalStorage
    setLocalStorageItem(STORAGE_KEY, data);

    return {
      data,
      status: 'success',
      message: 'Tải danh sách bài tập thành công!',
      statusCode: 200,
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * Tạo bài tập mới
   */
  async createAssignment(input: CreateAssignmentInput): Promise<ApiResponse<Assignment>> {
    await delay(350); // Giả lập độ trễ

    const newAssignment: Assignment = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      ...input,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    const currentList = getLocalStorageItem<Assignment[]>(STORAGE_KEY, []);
    const updatedList = [newAssignment, ...currentList];
    setLocalStorageItem(STORAGE_KEY, updatedList);

    return {
      data: newAssignment,
      status: 'success',
      message: 'Thêm bài tập mới thành công!',
      statusCode: 201,
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * Đánh dấu hoàn thành / bỏ đánh dấu
   */
  async toggleAssignment(id: string): Promise<ApiResponse<Assignment>> {
    await delay(200);

    const currentList = getLocalStorageItem<Assignment[]>(STORAGE_KEY, []);
    const target = currentList.find((item) => item.id === id);

    if (!target) {
      throw new Error(`Không tìm thấy bài tập với id: ${id}`);
    }

    const updatedTarget: Assignment = {
      ...target,
      completed: !target.completed,
    };

    const updatedList = currentList.map((item) => (item.id === id ? updatedTarget : item));
    setLocalStorageItem(STORAGE_KEY, updatedList);

    return {
      data: updatedTarget,
      status: 'success',
      message: updatedTarget.completed ? 'Đã hoàn thành bài tập!' : 'Đã bỏ đánh dấu hoàn thành!',
      statusCode: 200,
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * Xoá bài tập
   */
  async deleteAssignment(id: string): Promise<ApiResponse<string>> {
    await delay(200);

    const currentList = getLocalStorageItem<Assignment[]>(STORAGE_KEY, []);
    const updatedList = currentList.filter((item) => item.id !== id);
    setLocalStorageItem(STORAGE_KEY, updatedList);

    return {
      data: id,
      status: 'success',
      message: 'Đã xoá bài tập thành công!',
      statusCode: 200,
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * Khôi phục danh sách mẫu ban đầu
   */
  async resetToMockData(): Promise<ApiResponse<Assignment[]>> {
    await delay(400);
    const mockData = getInitialMockData();
    setLocalStorageItem(STORAGE_KEY, mockData);

    return {
      data: mockData,
      status: 'success',
      message: 'Đã khôi phục dữ liệu mẫu ban đầu!',
      statusCode: 200,
      timestamp: new Date().toISOString(),
    };
  },
};
