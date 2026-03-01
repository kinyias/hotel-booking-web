import { useQuery } from "@tanstack/react-query"
import { getInventory } from "./api"
import { InventoryQueryParams } from "./types"

export const useQueryInventory = (hotelId: string, params: InventoryQueryParams) => {
    return useQuery({
        queryKey: ["inventory", hotelId, params],
        queryFn: () => getInventory(hotelId, params),
        enabled: !!hotelId,
    })
}