import { request } from '../index';

export function connectDB(params) {
  return request.post('/connectDB', params);
}
