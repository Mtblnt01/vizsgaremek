<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BarberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => 'nullable|exists:users,id',
            'name' => 'required|string|max:255',
            'specialization' => 'nullable|string|max:255',
            'bio' => 'nullable|string|max:1000',
            'photo_url' => 'nullable|url',
        ];
    }
}
