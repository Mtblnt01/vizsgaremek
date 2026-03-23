<?php

namespace App\Services;

use App\Models\Booking;
use Carbon\Carbon;

class BookingService
{
  
    public function isSlotAvailable(int $barberId, Carbon $startTime, int $durationMin = 30): bool
    {
        $endTime = $startTime->clone()->addMinutes($durationMin);

      
        $conflictingBooking = Booking::where('barber_id', $barberId)
            ->where('status', 'confirmed')
            ->where('start_at', '<', $endTime)
            ->get()
            ->first(function ($booking) use ($startTime) {
                $existingEnd = Carbon::parse($booking->start_at)->addMinutes($booking->duration_min);
                return $existingEnd > $startTime;
            });

        return $conflictingBooking === null;
    }

    
    public function getAvailableSlots(int $barberId, Carbon $date, int $slotDuration = 30): array
    {
        $workStart = 9;  
        $workEnd = 18;   
        $slots = [];

        $current = $date->clone()->setTime($workStart, 0);
        $endOfDay = $date->clone()->setTime($workEnd, 0);

        while ($current < $endOfDay) {
            if ($this->isSlotAvailable($barberId, $current, $slotDuration)) {
                $slots[] = $current->toIso8601String();
            }
            $current->addMinutes(15); 
        }

        return $slots;
    }

  
    public function getNextAvailableSlot(int $barberId, int $slotDuration = 30): ?Carbon
    {
        $workStart = 9;
        $workEnd = 18;

        $startTime = now();
        $minutes = (int) $startTime->format('i');
        $rounded = (int) (ceil($minutes / 15) * 15);
        if ($rounded === 60) {
            $startTime->addHour()->setMinute(0)->setSecond(0);
        } else {
            $startTime->setMinute($rounded)->setSecond(0);
        }

      
        if ($startTime->hour >= $workEnd) {
            $startTime = $startTime->clone()->addDay()->setTime($workStart, 0);
        } elseif ($startTime->hour < $workStart) {
            $startTime->setTime($workStart, 0);
        }

       
        for ($i = 0; $i < 100; $i++) {
            if ($this->isSlotAvailable($barberId, $startTime, $slotDuration)) {
                return $startTime;
            }

            $startTime = $startTime->addMinutes(15);

         
            if ($startTime->hour >= $workEnd) {
                $startTime = $startTime->clone()->addDay()->setTime($workStart, 0);
            }
        }

        return null;
    }
}
