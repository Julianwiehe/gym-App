"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { createBookingSchema, type CreateBookingInput } from "@/lib/validations/booking";
import { TIMELINES } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

interface BookingFormProps {
  character: { id: string; name: string };
  selectedTier?: { id: string; label: string; price: number };
  companyId: string;
}

export function BookingForm({ character, selectedTier }: BookingFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register, handleSubmit, setValue, watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateBookingInput>({
    resolver: zodResolver(createBookingSchema),
    defaultValues: {
      characterId: character.id,
      budgetAmount: selectedTier?.price ?? 0,
      pricingTierId: selectedTier?.id,
    },
  });

  async function onSubmit(data: CreateBookingInput) {
    setServerError("");
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = await res.json();
      setServerError(body.error?.message ?? "Failed to create booking");
      return;
    }

    const { booking } = await res.json();
    router.push(`/booking/${character.id}/confirm?bookingId=${booking.id}`);
  }

  const budget = watch("budgetAmount");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverError && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <input type="hidden" {...register("characterId")} />
      <input type="hidden" {...register("pricingTierId")} />

      {selectedTier && (
        <Card className="border-violet-200 bg-violet-50">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-violet-800">
              Selected: {selectedTier.label} — {formatCurrency(selectedTier.price)}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Campaign Title</Label>
        <Input
          id="title"
          placeholder="e.g. Spring Collection Product Launch"
          {...register("title")}
        />
        {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Campaign Brief</Label>
        <Textarea
          id="description"
          rows={5}
          placeholder="Describe what you need, the campaign goals, target audience, and any specific messaging..."
          {...register("description")}
        />
        {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="requirements">Specific Requirements (optional)</Label>
        <Textarea
          id="requirements"
          rows={3}
          placeholder="Any specific hashtags, mentions, brand guidelines, dos and don'ts..."
          {...register("requirements")}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="timeline">Timeline</Label>
          <Select onValueChange={(v) => setValue("timeline", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select timeline" />
            </SelectTrigger>
            <SelectContent>
              {TIMELINES.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.timeline && <p className="text-sm text-red-600">{errors.timeline.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="budgetAmount">Budget (USD)</Label>
          <Input
            id="budgetAmount"
            type="number"
            min={1}
            step={0.01}
            placeholder="500"
            {...register("budgetAmount", { valueAsNumber: true })}
          />
          {errors.budgetAmount && <p className="text-sm text-red-600">{errors.budgetAmount.message}</p>}
        </div>
      </div>

      {budget > 0 && (
        <div className="rounded-lg bg-slate-50 border p-4 text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-500">Budget</span>
            <span>{formatCurrency(budget)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Platform fee (15%)</span>
            <span>{formatCurrency(budget * 0.15)}</span>
          </div>
          <div className="flex justify-between font-semibold border-t pt-1 mt-1">
            <span>Total charged</span>
            <span>{formatCurrency(budget)}</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            The character receives {formatCurrency(budget * 0.85)} after platform fee.
          </p>
        </div>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Send Booking Request"}
      </Button>
    </form>
  );
}
