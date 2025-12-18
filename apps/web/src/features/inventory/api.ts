import api from "@/lib/axios";
import { InventoryQueryParams } from "./types";
import { API_ENDPOINTS } from "@/constants";
import { BulkSetInventoryFormValues, UpdateInventoryFormValues } from "./validator";

export const getInventory = async (hotelId: string, params: InventoryQueryParams) => {
    const response = await api.get(`${API_ENDPOINTS.HOTEL.HOTELS}/${hotelId}/inventories`, {params});
    return response.data.items;
}

export const createInventory = async (hotelId: string, data: BulkSetInventoryFormValues) => {
    const response = await api.post(`${API_ENDPOINTS.HOTEL.HOTELS}/${hotelId}/inventories/bulk`, data);
    return response.data;
}

export const updateInventory = async (hotelId: string, id: string, data: UpdateInventoryFormValues) => {
    const response = await api.patch(`${API_ENDPOINTS.HOTEL.HOTELS}/${hotelId}/inventories/${id}`, data);
    return response.data;
}