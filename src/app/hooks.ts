// ==========================================
// BUỔI 3: REDUX TOOLKIT - TYPED HOOKS
// useAppDispatch và useAppSelector chuẩn TypeScript
// Tránh việc phải gõ (state: RootState) ở từng component
// ==========================================

import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
