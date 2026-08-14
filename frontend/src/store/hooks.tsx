import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// استخدم دول في كل مكان بدل useDispatch و useSelector العاديين
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();