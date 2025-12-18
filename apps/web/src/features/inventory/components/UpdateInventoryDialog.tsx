"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

import { useUpdateInventoryMutation } from "../mutations"
import { UpdateInventoryFormValues, UpdateInventorySchema } from "../validator"
import { Inventory } from "../types"
import toast from "react-hot-toast"

interface UpdateInventoryDialogProps {
  inventory: Inventory
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function UpdateInventoryDialog({
  inventory,
  trigger,
  open,
  onOpenChange,
}: UpdateInventoryDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isControlled = open !== undefined
  const show = isControlled ? open : internalOpen
  const setShow = isControlled ? onOpenChange : setInternalOpen

  // Use the hook with the hotelId from the inventory item
  const { mutate, isPending } = useUpdateInventoryMutation(inventory.hotelId)

  const form = useForm<UpdateInventoryFormValues>({
    resolver: zodResolver(UpdateInventorySchema),
    defaultValues: {
      totalRooms: inventory.totalRooms,
      availableRooms: inventory.availableRooms,
      stopSell: inventory.stopSell,
    },
  })

  // Update default values when inventory prop changes
  React.useEffect(() => {
    if (inventory) {
      form.reset({
        totalRooms: inventory.totalRooms,
        availableRooms: inventory.availableRooms,
        stopSell: inventory.stopSell,
      })
    }
  }, [inventory, form])

  const onSubmit = (values: UpdateInventoryFormValues) => {
    mutate(
      { id: inventory.id, payload: values },
      {
        onSuccess: () => {
          setShow?.(false)
          toast.success("Inventory updated successfully")
        },
        onError: (error) => {
          console.error(error)
          toast.error("Failed to update inventory")
        },
      }
    )
  }

  return (
    <Dialog open={show} onOpenChange={setShow}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Inventory</DialogTitle>
          <DialogDescription>
            Update inventory details for {inventory.date}.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="totalRooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Rooms</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g. 10"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : parseInt(e.target.value, 10)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="availableRooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available Rooms</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g. 5"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : parseInt(e.target.value, 10)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="stopSell"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Stop Sell</FormLabel>
                    <FormDescription>
                      Stop selling this room type for this date.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShow?.(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Inventory
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
